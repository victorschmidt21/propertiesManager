
import React from 'react';
import {
  Building2,
  DollarSign,
  Home,
  Percent,
  TrendingUp
} from 'lucide-react';
import StatCard from './StatCard';

export interface PropertyMetrics {
  totalProperties: number;
  totalValue: number;
  monthlyIncome: number;
  annualReturn: number;
  valueGrowth: number;
  occupancyRate?: number; // Added occupancyRate as an optional property
  loading?: boolean;
}

const PropertyOverview = ({
  totalProperties,
  totalValue,
  monthlyIncome,
  annualReturn,
  valueGrowth,
  occupancyRate,
  loading = false
}: PropertyMetrics) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total de Imóveis"
        value={totalProperties}
        icon={<Building2 className="h-6 w-6" />}
        loading={loading}
      />
      
      <StatCard
        title="Valor Total do Patrimônio"
        value={formatCurrency(totalValue)}
        icon={<Home className="h-6 w-6" />}
        trend={{
          value: valueGrowth,
          positive: valueGrowth > 0
        }}
        loading={loading}
      />
      
      <StatCard
        title="Receita Mensal"
        value={formatCurrency(monthlyIncome)}
        icon={<DollarSign className="h-6 w-6" />}
        loading={loading}
      />
      
      <StatCard
        title="Retorno Anual"
        value={`${annualReturn.toFixed(2)}%`}
        icon={<Percent className="h-6 w-6" />}
        loading={loading}
      />
      
      <StatCard
        title="Valorização"
        value={`${valueGrowth > 0 ? '+' : ''}${valueGrowth.toFixed(2)}%`}
        icon={<TrendingUp className="h-6 w-6" />}
        className={valueGrowth >= 0 ? "bg-income/10" : "bg-expense/10"}
        loading={loading}
      />
    </div>
  );
};

export default PropertyOverview;
