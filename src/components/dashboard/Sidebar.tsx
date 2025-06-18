import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, Calendar, 
  PiggyBank, TrendingUp, Heart, Smile, Users, Trophy,
  Book, Newspaper
} from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Atividades', path: '/dashboard/activities' },
  { icon: PiggyBank, label: 'Financeiro', path: '/dashboard/financial' },
  { icon: TrendingUp, label: 'Investimentos', path: '/dashboard/investments' },
  { icon: Heart, label: 'Saúde', path: '/dashboard/health' },
  { icon: Smile, label: 'Emocional', path: '/dashboard/emotional' },
  { icon: Users, label: 'Comunidade', path: '/dashboard/community' },
  { icon: Trophy, label: 'Recompensas', path: '/dashboard/rewards' },
  { icon: Book, label: 'Diário', path: '/dashboard/diary' },
  { icon: Newspaper, label: 'Jornal', path: '/dashboard/journal' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  return (
    <aside 
      className={`
        bg-gray-800/50 backdrop-blur-lg border-r border-gray-700
        transition-all duration-300 flex flex-col
        ${isExpanded ? 'w-64' : 'w-20'}
      `}
    >
      <button
        onClick={onToggle}
        className="p-4 text-gray-400 hover:text-white transition-colors self-end"
      >
        {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      <nav className="flex-1 px-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-lg mb-1
              ${isActive ? 'bg-blue-500/10 text-blue-500' : 'text-gray-400 hover:text-white'}
              transition-colors
            `}
          >
            <Icon className="h-5 w-5" />
            {isExpanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};