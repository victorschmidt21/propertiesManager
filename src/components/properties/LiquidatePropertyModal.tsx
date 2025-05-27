
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyCardProps } from './PropertyCard';
import { Separator } from '@/components/ui/separator';

interface LiquidatePropertyModalProps {
  property: PropertyCardProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: any) => void;
}

const LiquidatePropertyModal = ({
  property,
  open,
  onOpenChange,
  onConfirm,
}: LiquidatePropertyModalProps) => {
  const [saleValue, setSaleValue] = useState<string>('');
  const [errors, setErrors] = useState<{ saleValue?: string }>({});
  
  const purchaseValue = parseFloat(String(property.purchaseValue));
  const currentValue = property.currentValue ? parseFloat(String(property.currentValue)) : purchaseValue;
  
  // Calcular valores com base no valor de venda inserido
  const saleValueNum = parseFloat(saleValue || '0');
  const periodResult = saleValueNum - purchaseValue;
  const taxPercentage = periodResult > 0 ? 15 : 0; // 15% de imposto sobre o lucro
  const taxAmount = periodResult > 0 ? periodResult * (taxPercentage / 100) : 0;
  const netProfit = periodResult - taxAmount;
  const finalRevenue = saleValueNum - taxAmount;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { saleValue?: string } = {};
    
    if (!saleValue || parseFloat(saleValue) <= 0) {
      newErrors.saleValue = 'O valor de venda é obrigatório e deve ser maior que zero';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onConfirm({
        saleValue: saleValueNum,
        periodResult,
        taxAmount,
        netProfit,
        finalRevenue,
      });
    }
  };
  
  const valueGrowth = ((currentValue - purchaseValue) / purchaseValue) * 100;
  const saleVsPurchase = ((saleValueNum - purchaseValue) / purchaseValue) * 100;
  const saleVsCurrent = currentValue > 0 ? ((saleValueNum - currentValue) / currentValue) * 100 : 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Liquidar Imóvel</DialogTitle>
          <DialogDescription>
            Informe o valor de venda do imóvel {property.name} para calcular os impostos e o valor líquido final.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="saleValue">Valor de Venda*</Label>
              <Input
                id="saleValue"
                type="number"
                placeholder="Digite o valor de venda"
                value={saleValue}
                onChange={(e) => setSaleValue(e.target.value)}
                className={errors.saleValue ? "border-destructive" : ""}
              />
              {errors.saleValue && (
                <p className="text-sm font-medium text-destructive mt-1">{errors.saleValue}</p>
              )}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor da matrícula</p>
                <p className="text-lg font-semibold">{formatCurrency(purchaseValue)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Última avaliação</p>
                <p className="text-lg font-semibold">{formatCurrency(currentValue)}</p>
                <p className={`text-xs ${valueGrowth >= 0 ? 'text-income' : 'text-expense'}`}>
                  {valueGrowth >= 0 ? '+' : ''}{formatPercent(valueGrowth)} desde a compra
                </p>
              </div>
            </div>
            
            {saleValue && parseFloat(saleValue) > 0 && (
              <>
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor de venda proposto</p>
                  <p className="text-lg font-semibold">{formatCurrency(saleValueNum)}</p>
                  <div className="flex gap-4">
                    <p className={`text-xs ${saleVsPurchase >= 0 ? 'text-income' : 'text-expense'}`}>
                      {saleVsPurchase >= 0 ? '+' : ''}{formatPercent(saleVsPurchase)} da compra
                    </p>
                    <p className={`text-xs ${saleVsCurrent >= 0 ? 'text-income' : 'text-expense'}`}>
                      {saleVsCurrent >= 0 ? '+' : ''}{formatPercent(saleVsCurrent)} da avaliação
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resultado do período</p>
                    <p className={`text-lg font-semibold ${periodResult >= 0 ? 'text-income' : 'text-expense'}`}>
                      {periodResult >= 0 ? '+' : ''}{formatCurrency(periodResult)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Imposto ({taxPercentage}%)</p>
                    <p className="text-lg font-semibold text-expense">-{formatCurrency(taxAmount)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lucro líquido</p>
                    <p className={`text-lg font-semibold ${netProfit >= 0 ? 'text-income' : 'text-expense'}`}>
                      {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Receita final</p>
                    <p className="text-lg font-semibold">{formatCurrency(finalRevenue)}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
            >
              Confirmar Venda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LiquidatePropertyModal;
