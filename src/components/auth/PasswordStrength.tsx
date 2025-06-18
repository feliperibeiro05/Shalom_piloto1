import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const checks = [
    { regex: /.{8,}/, label: '8+ caracteres' },
    { regex: /[A-Z]/, label: 'Letra maiúscula' },
    { regex: /[a-z]/, label: 'Letra minúscula' },
    { regex: /[0-9]/, label: 'Número' },
    { regex: /[^A-Za-z0-9]/, label: 'Caractere especial' }
  ];

  const strength = checks.reduce((acc, check) => 
    acc + (check.regex.test(password) ? 1 : 0), 0);

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength / checks.length) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {checks.map(({ label, regex }) => (
          <div 
            key={label} 
            className={`flex items-center gap-1 ${
              regex.test(password) ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              regex.test(password) ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};