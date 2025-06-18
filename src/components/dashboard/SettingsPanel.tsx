import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, X, Moon, Sun, Bell, Lock, Shield, 
  Download, Trash2, Globe, Eye, UserCog 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // TODO: Implement theme switching logic
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change logic
  };

  const handleExportData = () => {
    // TODO: Implement data export logic
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute right-0 top-16 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-white">Configurações</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Preferences */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Preferências</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-500" />
                )}
                <span className="text-gray-300">Tema {theme === 'light' ? 'Claro' : 'Escuro'}</span>
              </div>
              <button
                onClick={handleThemeToggle}
                className="w-12 h-6 bg-gray-700 rounded-full relative transition-colors"
              >
                <div className={`
                  absolute top-1 w-4 h-4 rounded-full transition-transform
                  ${theme === 'light' ? 'right-1 bg-yellow-500' : 'left-1 bg-blue-500'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-green-500" />
                <span className="text-gray-300">Idioma</span>
              </div>
              <select className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm text-gray-300">
                <option value="pt-BR">Português (BR)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Segurança</h4>
          
          <div className="space-y-4">
            <button
              onClick={handlePasswordChange}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
            >
              <Lock className="h-5 w-5 text-blue-500" />
              <div>
                <span className="text-gray-300">Alterar Senha</span>
                <p className="text-sm text-gray-500">Atualize sua senha de acesso</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <span className="text-gray-300">Autenticação em Dois Fatores</span>
                <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Notificações</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-300">Notificações por Email</span>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  emailNotifications ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <div className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${emailNotifications ? 'right-1' : 'left-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-300">Notificações Push</span>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  pushNotifications ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <div className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${pushNotifications ? 'right-1' : 'left-1'}
                `} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Privacidade e Dados</h4>
          
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <span className="text-gray-300">Preferências de Privacidade</span>
                <p className="text-sm text-gray-500">Gerencie suas configurações de privacidade</p>
              </div>
            </button>

            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
            >
              <Download className="h-5 w-5 text-blue-500" />
              <div>
                <span className="text-gray-300">Exportar Dados</span>
                <p className="text-sm text-gray-500">Baixe uma cópia dos seus dados</p>
              </div>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-left text-red-500"
            >
              <Trash2 className="h-5 w-5" />
              <div>
                <span>Excluir Conta</span>
                <p className="text-sm text-red-500/70">Exclua permanentemente sua conta</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};