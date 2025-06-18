import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { PasswordStrength } from './PasswordStrength';
import { registerSchema } from '../../utils/validation';
import { formatCPF } from '../../utils/format';

type FormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    cpf: '',
    birthDate: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      registerSchema.parse(formData);
      await signUp(formData.email, formData.password, formData);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(error => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        setErrors({ submit: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
            Nome
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-900/50 rounded-lg border ${
              errors.firstName ? 'border-red-500' : 'border-gray-700'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
            Sobrenome
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-900/50 rounded-lg border ${
              errors.lastName ? 'border-red-500' : 'border-gray-700'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">
          CPF
        </label>
        <input
          id="cpf"
          name="cpf"
          type="text"
          value={formData.cpf}
          onChange={handleChange}
          maxLength={14}
          placeholder="000.000.000-00"
          className={`w-full px-4 py-3 bg-gray-900/50 rounded-lg border ${
            errors.cpf ? 'border-red-500' : 'border-gray-700'
          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
        />
        {errors.cpf && (
          <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300">
          Data de Nascimento
        </label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-gray-900/50 rounded-lg border ${
            errors.birthDate ? 'border-red-500' : 'border-gray-700'
          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
        />
        {errors.birthDate && (
          <p className="text-sm text-red-500 mt-1">{errors.birthDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-gray-900/50 rounded-lg border ${
            errors.email ? 'border-red-500' : 'border-gray-700'
          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-gray-900/50 rounded-lg border ${
            errors.password ? 'border-red-500' : 'border-gray-700'
          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
        />
        <PasswordStrength password={formData.password} />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <Button 
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </Button>

      <p className="text-center text-sm text-gray-400">
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 transition-colors"
        >
          Faça login
        </button>
      </p>
    </form>
  );
};