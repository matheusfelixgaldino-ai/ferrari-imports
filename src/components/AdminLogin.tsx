import { useState, type FormEvent } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminLoginProps {
  onBack: () => void;
}

export default function AdminLogin({ onBack }: AdminLoginProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message);
      }
    } else {
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Conta criada! Você já está logado.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ferrari-black flex flex-col items-center justify-center p-4">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-white/60 hover:text-white flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para loja
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-white mb-1">
            FERRARI<span className="text-ferrari-red"> IMPORTS</span>
          </h1>
          <p className="text-white/50 text-sm">Painel Administrativo</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock size={20} className="text-ferrari-red" />
            <h2 className="text-lg font-bold text-ferrari-black">
              {mode === 'login' ? 'Acesso Restrito' : 'Criar Conta Admin'}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ferrariimports.com.br"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/30 focus:border-ferrari-red transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ferrari-red text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-ferrari-red-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError(null);
              setSuccess(null);
            }}
            className="w-full text-center text-sm text-neutral-500 hover:text-ferrari-red mt-4 transition-colors"
          >
            {mode === 'login'
              ? 'Não tem conta? Criar acesso de administrador'
              : 'Já tem conta? Fazer login'}
          </button>
        </div>

        <p className="text-center text-xs text-white/30 mt-6 leading-relaxed">
          Acesso protegido por autenticação real (Supabase Auth).<br />
          Em produção, apenas usuários autorizados devem ter conta.
        </p>
      </div>
    </div>
  );
}
