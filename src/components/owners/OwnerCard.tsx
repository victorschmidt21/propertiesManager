import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import { OwnerAttributes } from "@/service/route/owner/owner";

export interface PropertyCardProps {
  owner: OwnerAttributes;
  layout?: "grid" | "list";
  onEdit?: (id: Number) => void;
  onDelete?: (id: Number) => void;
  onLiquidate?: (id: Number) => void;
  className?: string;
}

const OwnerCard = ({
  owner,
  onEdit,
  onDelete,
  className,
}: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleViewProperty = () => {
    navigate(`/owner/${owner.id}`);
  };

  return (
    <Card className={cn("flex flex-row", className)}>
      <div className="flex flex-1 justify-between p-2">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold truncate">{owner.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{owner.address.toElegant()}</span>
          </div>
        </CardContent>
        <div className="flex flex-col justify-center pr-4 gap-2">
          <Button variant="outline" size="sm" onClick={handleViewProperty}>
            Ver detalhes
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit && onEdit(owner.id)}
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete && onDelete(owner.id)}
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OwnerCard;
