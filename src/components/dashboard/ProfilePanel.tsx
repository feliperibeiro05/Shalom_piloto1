import React from 'react';
import { motion } from 'framer-motion';
import { User, X, Calendar, Mail, Phone, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfilePanelProps {
  onClose: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const metadata = user?.user_metadata;
  const createdAt = user?.created_at ? new Date(user.created_at) : null;
  const lastSignInAt = user?.last_sign_in_at ? new Date(user.last_sign_in_at) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute right-0 top-16 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-white">Perfil</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* User Info */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-white">
            {metadata?.first_name} {metadata?.last_name}
          </h4>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Nascimento: {format(new Date(metadata?.birth_date), 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Mail className="h-4 w-4" />
            <span>Email: {user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Conta criada em: {createdAt && format(createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Último acesso: {lastSignInAt && format(lastSignInAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </button>
        </div>
      </div>
    </motion.div>
  );
};