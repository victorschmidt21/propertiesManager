
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import TransactionList, { Transaction } from '@/components/transactions/TransactionList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const expenseTransactions: Transaction[] = [
  {
    id: '3',
    date: '2023-06-05',
    amount: 800,
    description: 'Condomínio',
    category: 'Condomínio',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '4',
    date: '2023-06-10',
    amount: 450,
    description: 'Manutenção Ar Condicionado',
    category: 'Manutenção',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '9',
    date: '2023-06-12',
    amount: 350,
    description: 'IPTU',
    category: 'Impostos',
    type: 'expense',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
  {
    id: '10',
    date: '2023-06-15',
    amount: 280,
    description: 'Seguro Residencial',
    category: 'Seguros',
    type: 'expense',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
  {
    id: '11',
    date: '2023-05-05',
    amount: 800,
    description: 'Condomínio',
    category: 'Condomínio',
    type: 'expense',
    propertyId: '1',
    propertyName: 'Apartamento Centro',
  },
  {
    id: '12',
    date: '2023-05-12',
    amount: 350,
    description: 'IPTU',
    category: 'Impostos',
    type: 'expense',
    propertyId: '2',
    propertyName: 'Casa Jardins',
  },
];

// Tax summary data
const taxSummary = {
  iptuTotal: 4200,
  iptuPaid: 2100,
  iptuPending: 2100,
  incomeTaxEstimate: 12000,
  incomeTaxPaid: 6000,
  incomeTaxPending: 6000,
};

const Expenses = () => {
  const [loading] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Despesas</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nova Despesa
          </Button>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="list">Lista</TabsTrigger>
                <TabsTrigger value="detailed">Detalhada</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Imóvel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseTransactions.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="text-expense font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>{expense.propertyName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="detailed">
                <TransactionList transactions={expenseTransactions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Expenses;
