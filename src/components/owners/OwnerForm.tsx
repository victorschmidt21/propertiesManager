import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Home, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { CityAttributes } from "@/service/route/city/city";
import { Api } from "@/service/api";
import {
  PropertiesAttributes,
  PropertiesDTOAttributes,
} from "@/service/route/properties/properties";
import { AuthContext } from "@/contexts/AuthContext";
import {
  OwnerAttributes,
  OwnerDTOAttributes,
} from "@/service/route/owner/owner";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z
    .string()
    .email({ message: "O nome deve ter pelo menos 3 caracteres" }),
  phone: z
    .string()
    .min(9, { message: "" })
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: "O valor da matrícula deve ser um número positivo",
    }),
  street: z
    .string()
    .min(2, { message: "Rua deve ter pelo menos 2 caracteres" }),

  neighborhood: z
    .string()
    .min(2, { message: "Bairro deve ter pelo menos 2 caracteres" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  cep: z.string().min(5, { message: "CEP é obrigatório" }),
  cpf_cnpj: z.string().min(11, { message: "CEP é obrigatório" }),
});

type FormValues = z.infer<typeof formSchema>;

const brazilianStates = [
  { id: 1, label: "Acre" },
  { id: 2, label: "Alagoas" },
  { id: 3, label: "Amapá" },
  { id: 4, label: "Amazonas" },
  { id: 5, label: "Bahia" },
  { id: 6, label: "Ceará" },
  { id: 7, label: "Distrito Federal" },
  { id: 8, label: "Espírito Santo" },
  { id: 9, label: "Goiás" },
  { id: 10, label: "Maranhão" },
  { id: 11, label: "Mato Grosso" },
  { id: 12, label: "Mato Grosso do Sul" },
  { id: 13, label: "Minas Gerais" },
  { id: 14, label: "Pará" },
  { id: 15, label: "Paraíba" },
  { id: 16, label: "Paraná" },
  { id: 17, label: "Pernambuco" },
  { id: 18, label: "Piauí" },
  { id: 19, label: "Rio de Janeiro" },
  { id: 20, label: "Rio Grande do Norte" },
  { id: 21, label: "Rio Grande do Sul" },
  { id: 22, label: "Rondônia" },
  { id: 23, label: "Roraima" },
  { id: 24, label: "Santa Catarina" },
  { id: 25, label: "São Paulo" },
  { id: 26, label: "Sergipe" },
  { id: 27, label: "Tocantins" },
];

interface PropertyFormProps {
  initialData?: OwnerAttributes | null;
  onSubmit: (ownerDTO: OwnerDTOAttributes) => void;
  onSubmitEdit: (ownerDTO: Partial<OwnerDTOAttributes>, id: number) => void;
  isSubmitting?: boolean;
  setOpenDialog?: any;
}

const OwnerForm = ({
  initialData,
  onSubmit,
  onSubmitEdit,
  isSubmitting = false,
  setOpenDialog,
}: PropertyFormProps) => {
  const { user } = useContext(AuthContext);
  const api = new Api();
  const [editOwner, setEditOwner] = useState<Partial<OwnerDTOAttributes>>();
  const [ownerDTO, setOwnerDTO] = useState<OwnerDTOAttributes>({
    name: initialData?.name || "",
    street: initialData?.address.street || "",
    number: initialData?.address.number || 0,
    neighborhood: initialData?.address.neighborhood || "",
    cpf_cnpj: initialData?.cpf_cnpj || "",
    email: initialData?.email || "",
    cityId: initialData?.address.city.id || 0,
    cep: initialData?.address.cep || 0,
    phone: initialData?.phone.toString() || "",
    userId: user.id,
  });

  const updateDTO = (field: keyof OwnerDTOAttributes, value: any) => {
    if (initialData) {
      setEditOwner((prev) => ({ ...prev, [field]: value }));
    }
    setOwnerDTO((prev) => ({ ...prev, [field]: value }));
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      street: initialData?.address.street || "",
      number: initialData?.address.number.toString() || "",
      neighborhood: initialData?.address.neighborhood || "",
      cpf_cnpj: initialData?.cpf_cnpj || "",
      email: initialData?.email || "",
      city: initialData?.address.city.nome || "",
      state: initialData?.address.city.state.name || "",
      cep: initialData?.address.cep.toString() || "",
      phone: initialData?.phone.toString() || "",
    },
  });
  const [city, setCity] = useState<CityAttributes[]>([]);

  async function handleCity(id: Number) {
    const response = await api.city.getByState(id);
    setCity(response);
  }

  useEffect(() => {
    handleCity(initialData?.address.city.state.id || 0);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          initialData
            ? onSubmitEdit(editOwner, Number(initialData.id))
            : onSubmit(ownerDTO)
        )}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informações Básicas
              </h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do proprietário</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateDTO("name", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Um nome para identificar seu imóvel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("email", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("phone", e.target.value);
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
                  name="cpf_cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateDTO("cpf_cnpj", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Localização e Características
              </h3>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome da rua"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("street", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("number", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome do bairro"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateDTO("neighborhood", e.target.value);
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? brazilianStates.find(
                                    (state) => state.label === field.value
                                  )?.label
                                : "Selecione um estado"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar estado..." />
                            <CommandEmpty>
                              Nenhum estado encontrado.
                            </CommandEmpty>
                            <CommandList className="max-h-48 overflow-y-auto">
                              <CommandGroup>
                                {brazilianStates.map((state) => (
                                  <CommandItem
                                    key={state.label}
                                    value={state.label}
                                    onSelect={() => {
                                      form.setValue("state", state.label);
                                      handleCity(state.id);
                                    }}
                                  >
                                    {state.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? city.find((city) => city.nome === field.value)
                                    ?.nome
                                : "Selecione uma cidade"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar cidade..." />
                            <CommandEmpty>
                              Nenhuma cidade encontrada.
                            </CommandEmpty>
                            <CommandList className="max-h-48 overflow-y-auto">
                              <CommandGroup>
                                {city.map((city) => (
                                  <CommandItem
                                    key={city.nome}
                                    value={city.nome}
                                    onSelect={(e) => {
                                      field.onChange(e);
                                      updateDTO("cityId", city.id);
                                    }}
                                  >
                                    {city.nome}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateDTO("cep", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            {isSubmitting ? "Salvando..." : "Salvar proprietário"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OwnerForm;
