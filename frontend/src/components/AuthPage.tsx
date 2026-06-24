import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader2, Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (view === 'register') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setMessage('Check your email to confirm registration!');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) throw error;
        setMessage('Password reset email sent!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,107,0,0.15),rgba(255,255,255,0))] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-trade-orange selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Animated Brand Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-trade-orange to-[#FF3D00] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-[#121214] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
              <img src="/trade_check_logo.png" alt="TradeCheck Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {view === 'login' ? 'Welcome back' : view === 'register' ? 'Create an account' : 'Reset password'}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {view === 'login' ? (
            <>
              Or{' '}
              <button onClick={() => setView('register')} className="font-semibold text-trade-orange hover:text-[#FF802B] transition-colors focus:outline-none">
                register a new account
              </button>
            </>
          ) : view === 'register' ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setView('login')} className="font-semibold text-trade-orange hover:text-[#FF802B] transition-colors focus:outline-none">
                Sign In
              </button>
            </>
          ) : (
            <button onClick={() => setView('login')} className="font-semibold text-trade-orange hover:text-[#FF802B] transition-colors focus:outline-none">
              Back to Sign In
            </button>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/[0.02] backdrop-blur-xl py-8 px-4 shadow-2xl border border-white/5 sm:rounded-2xl sm:px-10"
        >
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-3 text-sm">
              <ShieldAlert size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-center gap-3 text-sm">
              <Sparkles size={20} className="shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-[#121214] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-trade-orange/50 focus:border-trade-orange transition-all text-sm"
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs font-semibold text-trade-orange hover:text-[#FF802B] focus:outline-none transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-[#121214] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-trade-orange/50 focus:border-trade-orange transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-trade-orange hover:bg-[#E66000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0c] focus:ring-trade-orange disabled:opacity-50 transition-all shadow-orange-500/10 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="animate-spin text-white" size={20} />
                ) : view === 'login' ? (
                  'Sign In'
                ) : view === 'register' ? (
                  'Create Account'
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
