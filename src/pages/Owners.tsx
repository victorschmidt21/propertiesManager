import { useState, useEffect, useContext } from "react";
import { Plus, Search, List } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Api } from "@/service/api";
import OwnerCard from "@/components/owners/OwnerCard";
import {
  OwnerAttributes,
  OwnerDTOAttributes,
} from "@/service/route/owner/owner";
import OwnerForm from "@/components/owners/OwnerForm";

const Owners = () => {
  const api = new Api();

  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list">("list");
  const [owners, setOwners] = useState<OwnerAttributes[]>();
  const [editingProperty, setEditingProperty] =
    useState<OwnerAttributes | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  async function getOwners() {
    const response = await api.owner.getOwners();
    setOwners(response);
  }

  useEffect(() => {
    getOwners();
  }, []);

  const handleEdit = (id: Number) => {
    const property = owners.find((o) => o.id === id);
    if (property) {
      setEditingProperty(property);
      setOpenDialog(true);
    }
  };

  const handleDelete = (id: Number) => {
    api.owner
      .deleteOwner(id)
      .then(() => {
        toast({
          title: "Proprietário excluído",
          description: "O proprietário foi removido com sucesso.",
          duration: 3000,
        });
        setOwners(owners.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Proprietário não excluído",
          description: "Erro ao tentar excluir proprietário",
          duration: 3000,
        });
      });
  };

  async function handleFormSubmitEdit(
    ownerDTO: Partial<OwnerDTOAttributes>,
    id?: number
  ) {
    setLoading(true);
    api.owner
      .editOwner(ownerDTO, id)
      .then(() => {
        toast({
          title: "Proprietário editado",
          description: "O proprietário editado com sucesso.",
          duration: 3000,
        });
        setLoading(false);
        setOpenDialog(false);
        getOwners();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao editar proprietário",
          description: "Tente novamente",
          duration: 3000,
        });
        setLoading(false);
      });
    return;
  }

  async function handleFormSubmit(ownerDTO: OwnerDTOAttributes, id?: number) {
    setLoading(true);
    api.owner
      .createOwner(ownerDTO)
      .then((response) => {
        toast({
          title: "Proprietário adicionado",
          description: "O novo proprietário foi adicionado com sucesso.",
          duration: 3000,
        });
        setLoading(false);
        setOpenDialog(false);
        getOwners();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao adicionar proprietário",
          description: "Tente novamente",
          duration: 3000,
        });
        setLoading(false);
      });
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Proprietários</h1>{" "}
          <Button
            onClick={() => {
              setEditingProperty(null);
              setOpenDialog(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Adicionar proprietário
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar proprietário..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 items-center">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center border rounded-md">
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-md"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className={"flex flex-col gap-4"}>
          {owners?.map((owner) => (
            <OwnerCard
              key={owner.id.toString()}
              owner={owner}
              layout={view}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
          {owners?.length === 0 && (
            <div className="col-span-full text-center p-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                Nenhum proprietário encontrado
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty
                ? "Editar propretário"
                : "Adicionar Novo Proprietário"}
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes do proprietário.
            </DialogDescription>
          </DialogHeader>
          <OwnerForm
            setOpenDialog={setOpenDialog}
            onSubmit={handleFormSubmit}
            onSubmitEdit={handleFormSubmitEdit}
            isSubmitting={loading}
            initialData={editingProperty}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Owners;
