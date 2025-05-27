
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertyOverview from '@/components/dashboard/PropertyOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [loading] = React.useState(false);
  
  // Simplified dashboard metrics
  const dashboardMetrics = {
    totalProperties: 5,
    totalValue: 1750000,
    monthlyIncome: 8500,
    annualReturn: 5.82,
    valueGrowth: 4.5,
  };

  // Property value evolution data
  const propertyValueData = [
    { year: 'Jan 2023', value: 1500000 },
    { year: 'Mar 2023', value: 1550000 },
    { year: 'Jun 2023', value: 1600000 },
    { year: 'Set 2023', value: 1650000 },
    { year: 'Dez 2023', value: 1700000 },
    { year: 'Mar 2024', value: 1750000 },
  ];

  // Monthly income data
  const monthlyIncomeData = [
    { month: 'Jan', value: 8000 },
    { month: 'Fev', value: 8200 },
    { month: 'Mar', value: 8200 },
    { month: 'Abr', value: 8500 },
    { month: 'Mai', value: 8500 },
    { month: 'Jun', value: 8500 }
  ];

  // Monthly expense data
  const monthlyExpenseData = [
    { month: 'Jan', value: 3000 },
    { month: 'Fev', value: 3200 },
    { month: 'Mar', value: 2800 },
    { month: 'Abr', value: 3100 },
    { month: 'Mai', value: 2900 },
    { month: 'Jun', value: 3000 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <PropertyOverview {...dashboardMetrics} loading={loading} />
        
        <Card>
          <CardHeader>
            <CardTitle>Evolução Patrimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={propertyValueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Valor Total" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyIncomeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar name="Receitas" dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyExpenseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar name="Despesas" dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
