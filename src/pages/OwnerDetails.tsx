import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  Search,
  Grid,
  List,
  Edit,
  Trash2,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PropertyCard, {
  PropertyCardProps,
} from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropertyForm from "@/components/properties/PropertyForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import PropertyOverview from "@/components/dashboard/PropertyOverview";
import { OwnerAttributes } from "@/service/route/owner/owner";
import { PropertiesAttributes } from "@/service/route/properties/properties";
import { Api } from "@/service/api";
import { Separator } from "@radix-ui/react-dropdown-menu";

// Métricas para o dashboard
const dashboardMetrics = {
  totalProperties: 3,
  totalValue: 1050000,
  occupancyRate: 66.7,
  monthlyIncome: 4500,
  annualReturn: 5.14,
  valueGrowth: 7.8,
};

const OwnerDetails = () => {
  const api = new Api();
  const { ownerId } = useParams();
  const [owner, setOwner] = useState<OwnerAttributes>();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list">("list");
  const [properties, setProperties] = useState<PropertiesAttributes[]>([]);
  const [editingProperty, setEditingProperty] =
    useState<PropertyCardProps | null>(null);

  const { toast } = useToast();

  // Carregar dados do proprietário
  useEffect(() => {
    async function getOwner() {
      const response = await api.owner.getOwnerById(Number(ownerId));
      setOwner(response);
    }
    getOwner();
  }, []);

  useEffect(() => {
    async function getProperties() {
      const response = await api.propertie.getByOwner(Number(ownerId));
      setProperties(response);
    }
    getProperties();
  }, []);

  const handleFormSubmit = (data: any) => {
    setLoading(true);

    // Simula uma chamada de API
    setTimeout(() => {
      // setProperties(
      //   properties.map((property) =>
      //     property.id === editingProperty.id
      //       ? { ...property, ...data }
      //       : property
      //   )
      // );

      toast({
        title: "Imóvel atualizado",
        description: "As informações do imóvel foram atualizadas com sucesso.",
      });
      // Adicionar nova propriedade
      const newProperty = {
        id: `${properties.length + 1}`,
        ...data,
        ownerId: ownerId,
      };

      setProperties([...properties, newProperty]);

      toast({
        title: "Imóvel adicionado",
        description: "O novo imóvel foi adicionado com sucesso.",
      });

      setLoading(false);
      setOpenDialog(false);
      setEditingProperty(null);
    }, 1000);
  };

  const parseValue = (value: string | number | undefined): number => {
    if (value === undefined) return 0;
    if (typeof value === "number") return value;
    return parseFloat(value) || 0;
  };

  if (!owner) {
    return (
      <MainLayout requireAdmin>
        <div className="text-center p-12">
          <p>Proprietário não encontrado.</p>
          <Button asChild className="mt-4">
            <Link to="/owners">Voltar para Lista de Proprietários</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex space-x-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/owners">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {owner.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="owner">
          <TabsList className="mb-6">
            <TabsTrigger value="owner">Dados do proprietário</TabsTrigger>
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="owner">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Informações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Nome completo
                        </h3>
                        <p className="text-lg flex items-center gap-2 mt-1">
                          {owner.name}
                        </p>
                      </div>
                      <hr className="bg-black" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Documento
                        </h3>
                        <p className="text-lg flex items-center gap-2 mt-1">
                          {owner.documentFormatter()}
                        </p>
                      </div>
                      <hr className="bg-black" />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Telefone para contato
                        </h3>
                        <p className="text-lg flex items-center gap-2 mt-1">
                          {owner.phoneFormatter()}
                        </p>
                      </div>
                      <hr className="bg-black" />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Email
                        </h3>
                        <p className="text-lg flex items-center gap-2 mt-1">
                          {owner.email}
                        </p>
                      </div>
                      <hr className="bg-black" />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Endereço
                        </h3>
                        <p className="text-lg flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {owner.address.toElegant()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="properties">
            <div className="space-y-6">
              <Tabs defaultValue="all">
                <TabsContent value="all" className="mt-6">
                  <div className="flex flex-col gap-4">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id_imovel.toString()}
                        imovel={property}
                        layout={view}
                        local="owner"
                      />
                    ))}
                    {properties.length === 0 && (
                      <div className="col-span-full text-center p-12 bg-muted rounded-lg">
                        <p className="text-muted-foreground">
                          Nenhum imóvel encontrado
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Proprietário</CardTitle>
                  <CardDescription>
                    Resumo dos imóveis e indicadores financeiros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyOverview
                    totalProperties={properties.length}
                    totalValue={properties.reduce(
                      (sum, prop) => sum + parseValue("100"),
                      0
                    )}
                    // occupancyRate={
                    //   properties.length > 0
                    //     ? Math.round(
                    //         (properties.filter((p) => isRented(p)).length /
                    //           properties.length) *
                    //           100
                    //       )
                    //     : 0
                    // }
                    monthlyIncome={properties.reduce(
                      (sum, prop) => sum + parseValue("100"),
                      0
                    )}
                    annualReturn={
                      properties.filter((p) => typeof "number" === "number")
                        .length > 0
                        ? properties.reduce(
                            (sum, prop) =>
                              sum + (typeof "number" === "number" ? 10 : 0),
                            0
                          ) /
                          properties.filter((p) => typeof "number" === "number")
                            .length
                        : 0
                    }
                    valueGrowth={
                      (properties
                        .filter((p) => p.valueRegistration)
                        .reduce(
                          (sum, prop) =>
                            sum + (parseValue("100") - parseValue("100")),
                          0
                        ) /
                        properties
                          .filter((p) => p.valueRegistration)
                          .reduce((sum, prop) => sum + parseValue("1000"), 1)) *
                        100 || 0
                    }
                    loading={loading}
                  />
                </CardContent>
              </Card>

              <DashboardCharts loading={loading} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default OwnerDetails;
