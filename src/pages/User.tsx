
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';

// Exemplos de proprietários
const ownersSample = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    properties: 3,
    lastAccess: '2023-06-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    properties: 5,
    lastAccess: '2023-06-18T09:45:00Z',
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos@exemplo.com',
    properties: 2,
    lastAccess: '2023-06-14T16:20:00Z',
  },
  {
    id: '4',
    name: 'Ana Pereira',
    email: 'ana@exemplo.com',
    properties: 1,
    lastAccess: '2023-06-17T11:10:00Z',
  },
  {
    id: '5',
    name: 'Roberto Ferreira',
    email: 'roberto@exemplo.com',
    properties: 4,
    lastAccess: '2023-06-16T13:55:00Z',
  },
];

// Esquema de validação para o formulário de proprietário
const ownerFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [owners, setOwners] = useState(ownersSample);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingOwnerId, setEditingOwnerId] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof ownerFormSchema>>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleEdit = (id: string) => {
    const owner = owners.find(o => o.id === id);
    if (owner) {
      form.setValue('name', owner.name);
      form.setValue('email', owner.email);
      form.setValue('password', ''); // Não mostrar a senha atual por segurança
      setEditingOwnerId(id);
      setOpenDialog(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este proprietário?')) {
      setOwners(owners.filter(o => o.id !== id));
      toast({
        title: 'Proprietário excluído',
        description: 'O proprietário foi removido com sucesso.',
      });
    }
  };

  const onSubmit = (data: z.infer<typeof ownerFormSchema>) => {
    setLoading(true);
    
    // Simulando uma operação de API
    setTimeout(() => {
      if (editingOwnerId) {
        // Atualizar proprietário existente
        setOwners(owners.map(owner => 
          owner.id === editingOwnerId 
            ? { ...owner, name: data.name, email: data.email } 
            : owner
        ));
        
        toast({
          title: 'Proprietário atualizado',
          description: 'As informações foram atualizadas com sucesso.',
        });
      } else {
        // Adicionar novo proprietário
        const newOwner = {
          id: `${owners.length + 1}`,
          name: data.name,
          email: data.email,
          properties: 0,
          lastAccess: new Date().toISOString(),
        };
        
        setOwners([...owners, newOwner]);
        
        toast({
          title: 'Proprietário adicionado',
          description: 'O novo proprietário foi adicionado com sucesso.',
        });
      }
      
      form.reset();
      setEditingOwnerId(null);
      setLoading(false);
      setOpenDialog(false);
    }, 1000);
  };

  const filteredOwners = owners.filter((owner) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      owner.name.toLowerCase().includes(searchLower) ||
      owner.email.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Proprietários</h1>
          <Button onClick={() => {
            form.reset();
            setEditingOwnerId(null);
            setOpenDialog(true);
          }} className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Proprietário
          </Button>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar proprietários..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Proprietários</CardTitle>
            <CardDescription>
              Gerencie os proprietários que têm acesso ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Imóveis</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell className="font-medium">{owner.name}</TableCell>
                    <TableCell>{owner.email}</TableCell>
                    <TableCell>{owner.properties}</TableCell>
                    <TableCell>{formatDate(owner.lastAccess)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <Link to={`/owners/${owner.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(owner.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(owner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOwners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Nenhum proprietário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOwnerId ? 'Editar Proprietário' : 'Adicionar Proprietário'}
            </DialogTitle>
            <DialogDescription>
              {editingOwnerId
                ? 'Atualize as informações do proprietário'
                : 'Preencha os dados para adicionar um novo proprietário'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{editingOwnerId ? 'Nova Senha (opcional)' : 'Senha'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        {...field} 
                        required={!editingOwnerId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : editingOwnerId ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default User;
