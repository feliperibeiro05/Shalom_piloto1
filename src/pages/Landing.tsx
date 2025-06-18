import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Brain, Target, Sparkles, ArrowRight, Check, Star } from 'lucide-react';
import { TypewriterText } from '../components/TypewriterText';
import { Button } from '../components/ui/Button';
import { TestimonialCard } from '../components/TestimonialCard';
import { PricingCard } from '../components/PricingCard';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Flame className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Shalom
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,0),rgba(24,24,27,1))]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 flex flex-col gap-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Desenvolva seu potencial
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">com</span>
              <TypewriterText 
                texts={[
                  'foco.',
                  'disciplina.',
                  'consistência.',
                  'excelência.'
                ]} 
              />
            </div>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            Alcance a excelência através do autodesenvolvimento consistente e disciplinado.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link to="/register">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-lg px-12"
              >
                Comece Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden bg-gray-900/50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Desenvolva-se em todas as áreas
            </h2>
            <p className="text-xl text-gray-400">
              Uma plataforma completa para seu desenvolvimento pessoal e profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-8 hover:bg-gray-800/40 transition-all hover:scale-105">
              <Brain className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Desenvolvimento Pessoal</h3>
              <p className="text-gray-400">
                Desenvolva hábitos positivos e alcance seu potencial máximo através de práticas consistentes.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-8 hover:bg-gray-800/40 transition-all hover:scale-105">
              <Target className="h-12 w-12 text-purple-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Gestão de Metas</h3>
              <p className="text-gray-400">
                Defina metas claras e acompanhe seu progresso com métricas objetivas e acionáveis.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-8 hover:bg-gray-800/40 transition-all hover:scale-105">
              <Sparkles className="h-12 w-12 text-cyan-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Produtividade</h3>
              <p className="text-gray-400">
                Otimize seu tempo e energia com técnicas comprovadas de produtividade e foco.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              O que dizem nossos usuários
            </h2>
            <p className="text-xl text-gray-400">
              Histórias reais de transformação e crescimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              content="A plataforma revolucionou minha forma de desenvolver hábitos. Em apenas 3 meses, consegui estabelecer uma rotina matinal consistente e produtiva."
              author="Ana Silva"
              role="Desenvolvedora"
              imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TestimonialCard
              content="O sistema de metas e acompanhamento de progresso é incrível. Finalmente consigo manter o foco no que realmente importa."
              author="Carlos Santos"
              role="Empresário"
              imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TestimonialCard
              content="As técnicas de produtividade e gestão de energia mudaram completamente minha forma de trabalhar. Agora produzo mais em menos tempo."
              author="Julia Costa"
              role="Designer"
              imageUrl="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 relative overflow-hidden bg-gray-900/50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Planos para todos os objetivos
            </h2>
            <p className="text-xl text-gray-400">
              Escolha o plano ideal para sua jornada de desenvolvimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Básico"
              price="R$ 0"
              features={[
                "Gestão de tarefas básica",
                "Análise de produtividade",
                "3 projetos",
                "Suporte por email"
              ]}
            />
            <PricingCard
              title="Pro"
              price="R$ 29"
              features={[
                "Gestão de tarefas avançada",
                "Análise detalhada",
                "Projetos ilimitados",
                "Metas e hábitos avançados",
                "Suporte prioritário"
              ]}
              isPopular
            />
            <PricingCard
              title="Empresas"
              price="R$ 99"
              features={[
                "Tudo do plano Pro",
                "Gestão de equipes",
                "Relatórios personalizados",
                "API access",
                "Suporte dedicado"
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};