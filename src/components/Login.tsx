import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, User, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (isRegistering && !name) {
      setError('Por favor, informe o seu nome para cadastro.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);
    
    // Simulate real auth experience
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: isRegistering ? name : email.split('@')[0],
        email: email,
        phone: "(11) 99999-8888",
        address: "Endereço cadastrado - São Paulo, SP",
        points: isRegistering ? 50 : 120,
        avatar: isRegistering 
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
          : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6" id="login-container-page">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden z-10"
      >
        {/* Upper area */}
        <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="bg-white/15 h-9 w-9 rounded-xl flex items-center justify-center text-white font-extrabold">
              <span className="font-display text-xs tracking-tighter">PET</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">Agendamentos</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight font-display">
            {isRegistering ? 'Criar conta' : 'Acessar o app'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
            {isRegistering 
              ? 'Cadastre-se para gerenciar seus pets e agendar os atendimentos.' 
              : 'Entre com seu e-mail e senha para acessar seus agendamentos.'
            }
          </p>
        </div>

        {/* Content area */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isRegistering && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600 block">Senha</label>
                {!isRegistering && (
                  <button type="button" className="text-[10px] font-bold text-emerald-600 hover:underline">
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Carregando...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isRegistering ? 'Cadastrar e Entrar' : 'Entrar'}
                </>
              )}
            </button>
          </form>

          {/* Register switch */}
          <div className="text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-slate-500 hover:text-emerald-600 transition font-medium"
            >
              {isRegistering 
                ? 'Já tem uma conta? Entre aqui' 
                : 'Criar uma nova conta'
              }
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
