import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, PiggyBank, BarChart2, DollarSign, 
  ArrowUpRight, ArrowDownRight, Briefcase, LineChart,
  PieChart, Calendar, AlertCircle, Plus, Filter
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Investment {
  id: string;
  type: 'stock' | 'crypto' | 'fixed_income' | 'real_estate' | 'funds';
  name: string;
  symbol: string;
  amount: number;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

export const Investments: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Example data - in a real app this would come from your backend
  const portfolioValue = 157432.89;
  const totalReturn = 12543.21;
  const returnPercentage = 7.89;
  const isPositiveReturn = totalReturn >= 0;

  const assetDistribution = [
    { type: 'Ações', percentage: 45, value: 70844.80 },
    { type: 'Renda Fixa', percentage: 30, value: 47229.87 },
    { type: 'Fundos', percentage: 15, value: 23614.93 },
    { type: 'Criptomoedas', percentage: 10, value: 15743.29 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Investimentos</h1>
          <p className="text-gray-400">Acompanhe e gerencie sua carteira de investimentos</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Investimento
        </Button>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm text-gray-400">Patrimônio Total</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">
              R$ {portfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </Card>

        <Card className={`bg-gradient-to-br ${
          isPositiveReturn 
            ? 'from-green-500/10 to-emerald-500/10 border-green-500/20'
            : 'from-red-500/10 to-pink-500/10 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 ${
              isPositiveReturn ? 'bg-green-500/20' : 'bg-red-500/20'
            } rounded-lg`}>
              {isPositiveReturn ? (
                <ArrowUpRight className={`h-6 w-6 ${
                  isPositiveReturn ? 'text-green-500' : 'text-red-500'
                }`} />
              ) : (
                <ArrowDownRight className="h-6 w-6 text-red-500" />
              )}
            </div>
            <span className="text-sm text-gray-400">Retorno Total</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">
              R$ {Math.abs(totalReturn).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className={`text-sm ${
              isPositiveReturn ? 'text-green-500' : 'text-red-500'
            }`}>
              {isPositiveReturn ? '+' : '-'}{Math.abs(returnPercentage)}%
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <PieChart className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-sm text-gray-400">Diversificação</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">4 Classes</h3>
            <p className="text-sm text-gray-400">Bem diversificado</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-500" />
            </div>
            <span className="text-sm text-gray-400">Risco</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">Moderado</h3>
            <p className="text-sm text-gray-400">Bem balanceado</p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Evolução Patrimonial</h3>
            <div className="flex items-center gap-2">
              {['1d', '1w', '1m', '1y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-400">Gráfico de evolução patrimonial</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Distribuição por Classe</h3>
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
          <div className="space-y-4">
            {assetDistribution.map((asset) => (
              <div key={asset.type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{asset.type}</span>
                  <span className="text-gray-400">{asset.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${asset.percentage}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  R$ {asset.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Recomendações Inteligentes</h3>
          <Button variant="secondary" size="sm">
            Ver Todas
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="font-medium text-white">Diversificação</h4>
            </div>
            <p className="text-sm text-gray-400">
              Sua carteira está concentrada em ações. Considere adicionar mais renda fixa para equilibrar o risco.
            </p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <PiggyBank className="h-5 w-5 text-blue-500" />
              </div>
              <h4 className="font-medium text-white">Oportunidade</h4>
            </div>
            <p className="text-sm text-gray-400">
              Os juros dos títulos públicos estão atrativos. Bom momento para investir em renda fixa.
            </p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart2 className="h-5 w-5 text-purple-500" />
              </div>
              <h4 className="font-medium text-white">Rebalanceamento</h4>
            </div>
            <p className="text-sm text-gray-400">
              Sua alocação em fundos está abaixo do ideal. Considere aumentar a exposição.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};