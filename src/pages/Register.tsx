import React from 'react';
import { BrainCog } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register: React.FC = () => {
  return (
    <>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BrainCog className="h-12 w-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Comece sua jornada
        </h2>
        <p className="text-gray-400 mt-2">
          Crie sua conta e transforme seu potencial
        </p>
      </div>

      <Card className="backdrop-blur-lg bg-gray-800/50 border-gray-700">
        <RegisterForm />
      </Card>
    </>
  );
};