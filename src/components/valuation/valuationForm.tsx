import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BadgeCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CloudinaryStorage } from "@/database/storage";
import {
  ValuationAttributes,
  ValuationDTOAttributes,
} from "@/service/route/valuation/valuation";
import { useToast } from "@/hooks/use-toast";
import { Api } from "@/service/api";

const formSchema = z.object({
  nameResponsible: z.string(),
  date: z.string(),
  description: z.string(),
  rotaImage: z.string(),
  value: z.string(),
  imovelId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

interface ValuationFormProps {
  onSubmit: (valuationDTO: ValuationDTOAttributes) => void;
  isSubmitting?: boolean;
  setOpenDialog?: any;
  setValuation?: any;
  setValuations?: any;
  valuations?: ValuationAttributes[];
  id: number;
}

const ValuationForm = ({
  id,
  onSubmit,
  setOpenDialog,
  setValuation,
  setValuations,
  valuations,
}: ValuationFormProps) => {
  const today = new Date().toISOString().split("T")[0];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valuationDTO, setvaluationDTO] = useState<ValuationDTOAttributes>({
    nameResponsible: "",
    date: new Date(),
    description: "",
    rotaImage: "",
    value: 0,
    imovelId: id,
  });
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const { toast } = useToast();
  const api = new Api();

  const updateDTO = (field: keyof ValuationDTOAttributes, value: any) => {
    setvaluationDTO((prev) => ({ ...prev, [field]: value }));
  };

  const sortValuations = (valuationsData: ValuationAttributes[]) => {
    const valuationsSort = valuationsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setValuations(valuationsSort);
  };

  async function handleFormSubmit(valuationDTO: ValuationDTOAttributes) {
    setIsSubmitting(true);
    const storage = new CloudinaryStorage();
    const image = await storage.uploadPDF(fileSelected);
    if (image) {
      valuationDTO.rotaImage = image;
      api.valuation
        .create(valuationDTO)
        .then((response) => {
          toast({
            title: "Avaliação criada!",
            description: "Nova avaliação adicionada com sucesso.",
            duration: 3000,
          });
          setValuation(response);
          sortValuations([...valuations, response]);
          setOpenDialog(false);
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao adicionar avaliação",
            description: "Tente novamente",
            duration: 3000,
          });
        });
    } else {
      toast({
        title: "Erro ao salvar imagem",
        description: "Tente novamente",
        duration: 3000,
      });
    }
    setIsSubmitting(false);
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameResponsible: "",
      date: "",
      description: "",
      rotaImage: "",
      value: "",
      imovelId: id,
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileSelected(file);

      updateDTO("rotaImage", file);
      form.setValue("rotaImage", file.name);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => handleFormSubmit(valuationDTO))}
        className="space-y-8"
      >
        <div className="grid grid-cols-1">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Informações da avaliação
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="nameResponsible"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Responsável pelo avaliação</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("nameResponsible", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da avaliação</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            max={today}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("date", new Date(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da avaliação</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateDTO("description", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor da avaliação (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("value", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rotaImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arquivo de avaliação</FormLabel>
                        <FormControl>
                          <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                            <label
                              htmlFor="file-upload"
                              className="relative flex items-center space-x-2 cursor-pointer bg-white rounded-md font-medium text-[#243444] hover:text-[#1a2631] focus-within:outline-none"
                            >
                              {fileSelected ? (
                                <div className="bg-green-50 space-x-2 p-1 rounded-lg flex items-start">
                                  <BadgeCheck className="text-sm text-green-700 mt-1" />
                                  <p className="text-sm text-green-700 mt-1">
                                    {fileSelected.name} (
                                    {(fileSelected.size / 1024 / 1024).toFixed(
                                      2
                                    )}{" "}
                                    MB)
                                  </p>
                                </div>
                              ) : (
                                <span>Faça upload do arquivo </span>
                              )}
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".pdf"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpenDialog(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Imóvel"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ValuationForm;
