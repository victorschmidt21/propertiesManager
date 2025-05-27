import React from "react";
import {
  Building2,
  MapPin,
  TrendingUp,
  Home,
  BarChart3,
  Receipt,
  Wallet,
  Trash2,
  Tags,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AddressAttributes } from "@/service/route/address/address";
import { UserAttributes } from "@/service/route/user/user";
import { OwnerAttributes } from "@/service/route/owner/owner";
import { PropertiesAttributes } from "@/service/route/properties/properties";

export interface PropertyCardProps {
  imovel: PropertiesAttributes;
  layout?: "grid" | "list";
  onEdit?: (id: Number) => void;
  onDelete?: (id: Number) => void;
  onLiquidate?: (id: Number) => void;
  className?: string;
  local?: string;
}

const PropertyCard = ({
  imovel,
  onEdit,
  onDelete,
  className,
  local,
}: PropertyCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const valueGrowth = imovel.valueRegistration;

  const handleViewProperty = () => {
    navigate(`/properties/${imovel.id_imovel}`);
  };

  return (
    <Card className={cn("flex flex-row", className)}>
      <div className="relative h-auto w-28 bg-muted">
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <Home className="h-8 w-8 text-muted-foreground/50" />
        </div>
      </div>
      <div className="flex flex-1 justify-between">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold truncate">
            {imovel.nome_imovel}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{imovel.adress.toElegant()}</span>
          </div>

          {valueGrowth && (
            <div className="flex gap-4 mt-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Valor da compra: {formatCurrency(valueGrowth.toString())}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <div className="flex flex-col justify-center pr-4 gap-2">
          <Button variant="outline" size="sm" onClick={handleViewProperty}>
            Ver detalhes
          </Button>

          {local != "owner" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit && onEdit(imovel.id_imovel)}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => onDelete && onDelete(imovel.id_imovel)}
              >
                Excluir
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
