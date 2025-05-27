
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dados de exemplo para rendimentos mensais
const monthlyIncomeData = [
  { month: 'Jan', income: 5000, expenses: 1200 },
  { month: 'Fev', income: 5000, expenses: 1350 },
  { month: 'Mar', income: 5200, expenses: 1400 },
  { month: 'Abr', income: 5150, expenses: 1250 },
  { month: 'Mai', income: 5300, expenses: 1600 },
  { month: 'Jun', income: 5400, expenses: 1500 },
  { month: 'Jul', income: 5400, expenses: 1300 },
  { month: 'Ago', income: 5500, expenses: 1450 },
  { month: 'Set', income: 5600, expenses: 1400 },
  { month: 'Out', income: 5700, expenses: 1350 },
  { month: 'Nov', income: 5800, expenses: 1400 },
  { month: 'Dez', income: 6000, expenses: 1500 },
];

// Dados de exemplo para evolução patrimonial
const propertyValueData = [
  { month: 'Jan', value: 850000 },
  { month: 'Fev', value: 852000 },
  { month: 'Mar', value: 855000 },
  { month: 'Abr', value: 858000 },
  { month: 'Mai', value: 862000 },
  { month: 'Jun', value: 865000 },
  { month: 'Jul', value: 870000 },
  { month: 'Ago', value: 875000 },
  { month: 'Set', value: 880000 },
  { month: 'Out', value: 885000 },
  { month: 'Nov', value: 890000 },
  { month: 'Dez', value: 895000 },
];

// Dados de exemplo para a distribuição de categorias de despesas
const expenseCategoriesData = [
  { name: 'Manutenção', value: 35 },
  { name: 'Impostos', value: 30 },
  { name: 'Seguros', value: 15 },
  { name: 'Condomínio', value: 10 },
  { name: 'Serviços', value: 10 },
];

// Cores para o gráfico de pie
const EXPENSE_COLORS = ['#0D9488', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'];

interface DashboardChartsProps {
  loading?: boolean;
}

const DashboardCharts = ({ loading = false }: DashboardChartsProps) => {
  const [timeRange, setTimeRange] = React.useState('12m');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Rendimentos Mensais</CardTitle>
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="12m">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyIncomeData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend />
              <Bar name="Receitas" dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar name="Despesas" dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Análises</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patrimony">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="patrimony">Valor Patrimonial</TabsTrigger>
              <TabsTrigger value="expenses">Despesas por Categoria</TabsTrigger>
            </TabsList>
            <TabsContent value="patrimony" className="pt-2">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={propertyValueData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0D9488"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="expenses" className="pt-2">
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseCategoriesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
