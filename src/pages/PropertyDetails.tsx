import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Edit,
  Trash2,
  ArrowLeft,
  Receipt,
  Wallet,
  Plus,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PropertyForm from "@/components/properties/PropertyForm";
import { useToast } from "@/components/ui/use-toast";
import { Api } from "@/service/api";
import { PropertiesAttributes } from "@/service/route/properties/properties";
import { ValuationAttributes } from "@/service/route/valuation/valuation";
import ValuationForm from "@/components/valuation/valuationForm";
import { AuthContext } from "@/contexts/AuthContext";

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [openDialogPropertie, setOpenDialogPropertie] = useState(false);
  const [openDialogValuation, setOpenDialogValuation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<PropertiesAttributes>();
  const [valuation, setValuation] = useState<ValuationAttributes>();
  const [valuations, setValuations] = useState<ValuationAttributes[]>();
  const api = new Api();
  const { user } = useContext(AuthContext);
  
  useState(() => {
    async function getPropertieById() {
      const response = await api.propertie.getByUserAndPropertie(
        Number(propertyId)
      );
      setProperty(response);
    }
    getPropertieById();
  });

  useState(() => {
    async function getValuation() {
      const response = await api.valuation.getByIdPropertie(Number(propertyId));
      setValuation(response[0]);
      setValuations(response);
    }
    getValuation();
  });

  if (!property) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold">Imóvel não encontrado</h2>
          <Button className="mt-4" onClick={() => navigate("/properties")}>
            Voltar para a lista de imóveis
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi removido com sucesso.",
      });
      navigate("/properties");
    }
  };

  const handleFormSubmit = (data: any) => {
    setLoading(true);

    setTimeout(() => {
      toast({
        title: "Imóvel atualizado",
        description: "As informações do imóvel foram atualizadas com sucesso.",
      });

      setLoading(false);
      setOpenDialogPropertie(false);
    }, 1000);
  };

  const transformDate = (date: string) => {
    let data = new Date(date + "T00:00:00");
    const dataFormatada = data.toLocaleDateString("pt-BR");
    return dataFormatada;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/properties")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="ml-4 text-3xl font-bold tracking-tight">
              {property.nome_imovel}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDialogPropertie(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="flex items-center gap-2 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Endereço
                  </h3>
                  <p className="text-lg flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {property.adress.toElegant()}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Valor de matricula
                    </h3>
                    <p className="text-lg font-medium mt-1">
                      {property.formatCurrency()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Data de matricula
                    </h3>
                    <p className="text-lg font-medium mt-1">
                      {transformDate(property.date_Value)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Proprietário
                    </h3>
                    <p className="text-lg font-medium mt-1">
                      {property.owner.name}
                    </p>
                  </div>
                </div>

                <Separator />
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Análises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/properties/${propertyId}/incomes`)}
                  className="flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4 text-income" />
                  <span>Receitas</span>
                </Button>
                <Separator />
                <Button
                  variant="outline"
                  onClick={() => navigate(`/properties/${propertyId}/expenses`)}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4 text-expense" />
                  <span>Despesas</span>
                </Button>
                <Separator />
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="flex justify-between flex-row">
              <CardTitle>Avaliação</CardTitle>
              <Button
                variant="test"
                onClick={() => setOpenDialogValuation(true)}
              >
                <Plus className="h-5  w-5" />
              </Button>
            </CardHeader>
            {valuation ? (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Responsável pela avaliação
                      </h3>
                      <p className="text-lg flex items-center gap-2 mt-1">
                        {valuation.nameResponsible}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Data de avaliação
                      </h3>
                      <p className="text-lg flex items-center gap-2 mt-1">
                        {transformDate(valuation.date.toString())}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Valor de avaliação
                      </h3>
                      <p className="text-lg font-medium mt-1">
                        {formatCurrency(valuation.value.toString())}
                      </p>
                    </div>
                    <a
                      href={valuation.rotaImage}
                      target="blank"
                      download={"avaliacao.pdf"}
                      className="bg-primary text-primary-foreground hover:bg-primary/900 p-2 cursor-pointer rounded-md"
                    >
                      <span>Visualizar avaliação</span>
                    </a>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Descrição da avaliação
                      </h3>
                      <span className="text-sm mt-1">
                        {valuation.description}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <div className="space-y-4 flex flex-col justify-center items-center">
                  <h3 className="text-md font-medium text-muted-foreground">
                    Esse ímovel não possuí nenhuma avaliação!
                  </h3>
                  <Button
                    variant="default"
                    onClick={() => setOpenDialogValuation(true)}
                    className="flex items-center gap-2"
                  >
                    <span>Fazer avaliação</span>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
          {valuations.length > 1 && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Histórico de avaliações</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[35vh] min-h-[35vh] h-full min overflow-y-auto w-full space-y-2">
                {valuations.map((valuation) => (
                  <div
                    key={valuation.id.toString()}
                    className=" border-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <a className="cursor-pointer space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Valor de avaliação
                          </h3>
                          <p className="text-lg font-medium mt-1">
                            {formatCurrency(valuation.value.toString())}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Data de avaliação
                          </h3>
                          <p className="text-lg flex items-center gap-2 mt-1">
                            {transformDate(valuation.date.toString())}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={openDialogPropertie} onOpenChange={setOpenDialogPropertie}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Imóvel</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do seu imóvel. Todos os campos marcados com *
              são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm
            onSubmit={handleFormSubmit}
            isSubmitting={loading}
            initialData={undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialogValuation} onOpenChange={setOpenDialogValuation}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar nova avaliação</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da avaliação. Todos os campos marcados com *
              são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <ValuationForm
            setOpenDialog={setOpenDialogValuation}
            onSubmit={handleFormSubmit}
            isSubmitting={loading}
            id={Number(propertyId)}
            setValuation={setValuation}
            setValuations={setValuations}
            valuations={valuations}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PropertyDetails;
