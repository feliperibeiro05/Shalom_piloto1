import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Flame } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Logo Header - Always visible */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Flame className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Shalom
        </span>
      </Link>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 animated-gradient opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900" />
        <div className="relative w-full flex flex-col items-center justify-center p-12 text-center">
          <Flame className="h-20 w-20 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8" />
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Transforme seu potencial em realidade
          </h1>
          <p className="text-xl text-gray-300 max-w-md">
            Junte-se a milhares de pessoas que já estão transformando suas vidas através do desenvolvimento pessoal e profissional.
          </p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};