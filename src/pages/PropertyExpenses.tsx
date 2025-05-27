
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Expenses = () => {
  const [loading] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Tax summary data
  const taxSummary = {
    iptuTotal: 4200,
    iptuPaid: 2100,
    iptuPending: 2100,
    incomeTaxEstimate: 12000,
    incomeTaxPaid: 6000,
    incomeTaxPending: 6000,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Despesas</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                IPTU Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(taxSummary.iptuTotal)}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">Pago: {formatCurrency(taxSummary.iptuPaid)}</span>
                <span className="text-sm text-destructive">Pendente: {formatCurrency(taxSummary.iptuPending)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Imposto de Renda (Estimado)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(taxSummary.incomeTaxEstimate)}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">Pago: {formatCurrency(taxSummary.incomeTaxPaid)}</span>
                <span className="text-sm text-destructive">Pendente: {formatCurrency(taxSummary.incomeTaxPending)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Impostos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(taxSummary.iptuTotal + taxSummary.incomeTaxEstimate)}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">Pago: {formatCurrency(taxSummary.iptuPaid + taxSummary.incomeTaxPaid)}</span>
                <span className="text-sm text-destructive">Pendente: {formatCurrency(taxSummary.iptuPending + taxSummary.incomeTaxPending)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Expenses;
