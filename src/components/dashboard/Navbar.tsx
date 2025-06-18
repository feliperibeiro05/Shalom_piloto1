import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Settings, Flame, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationsPanel } from './NotificationsPanel';
import { ProfilePanel } from './ProfilePanel';
import { SettingsPanel } from './SettingsPanel';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activePanel, setActivePanel] = useState<'notifications' | 'profile' | 'settings' | null>(null);

  const handlePanelToggle = (panel: 'notifications' | 'profile' | 'settings') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 relative z-50">
      <div className="px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Shalom
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePanelToggle('notifications')}
            className={`p-2 rounded-lg transition-colors ${
              activePanel === 'notifications' 
                ? 'bg-blue-500/20 text-blue-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            onClick={() => handlePanelToggle('settings')}
            className={`p-2 rounded-lg transition-colors ${
              activePanel === 'settings'
                ? 'bg-blue-500/20 text-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => handlePanelToggle('profile')}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                activePanel === 'profile'
                  ? 'bg-blue-500/20 text-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span className="text-sm">{user?.user_metadata?.first_name}</span>
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Panels */}
      {activePanel === 'notifications' && (
        <NotificationsPanel onClose={() => setActivePanel(null)} />
      )}

      {activePanel === 'profile' && (
        <ProfilePanel onClose={() => setActivePanel(null)} />
      )}

      {activePanel === 'settings' && (
        <SettingsPanel onClose={() => setActivePanel(null)} />
      )}
    </nav>
  );
};