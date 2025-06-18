import React from 'react';
import { Bell, X, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationsPanelProps {
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute right-0 top-16 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-white">Notificações</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="text-center text-gray-400 py-8">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma notificação no momento</p>
        </div>
      </div>
    </motion.div>
  );
};