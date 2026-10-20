import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  guestUuid: string;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  guestUuid,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMode, setActiveMode] = useState<'login' | 'register'>(mode);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(email || 'engineer@enterprise.ai');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#16161f] border border-[#2a2931] rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#2a2931] text-[#c7c4d8] hover:text-[#e4e1eb] flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#8781ff]/20 text-[#c4c0ff] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[24px]">
              {activeMode === 'login' ? 'login' : 'how_to_reg'}
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-[#e4e1eb]">
            {activeMode === 'login' ? 'Welcome Back to DocExplorer' : 'Create Enterprise Account'}
          </h2>
          <p className="text-[13px] text-[#c7c4d8] mt-1">
            {activeMode === 'login'
              ? 'Sign in to access your saved knowledge bases and chats.'
              : 'Permanent registration with instant guest session claiming.'}
          </p>
        </div>

        {/* Guest Session Auto-Migration Banner */}
        <div className="p-3 rounded-xl bg-[#1f1f26] border border-[#2a2931] mb-5 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#41eec2] text-[20px]">sync_alt</span>
          <div className="text-left font-mono text-[11px] leading-tight">
            <span className="text-[#e4e1eb] font-semibold block">Automatic Vector Session Migration</span>
            <span className="text-[#c7c4d8]">UUID: {guestUuid} will automatically link to this account</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeMode === 'register' && (
            <div>
              <label className="block text-[12px] font-medium text-[#c7c4d8] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e14] border border-[#2a2931] text-[#e4e1eb] placeholder-[#918fa1] focus:outline-none focus:border-[#8781ff] text-[14px]"
              />
            </div>
          )}

          <div>
            <label className="block text-[12px] font-medium text-[#c7c4d8] mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@enterprise.corp"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e14] border border-[#2a2931] text-[#e4e1eb] placeholder-[#918fa1] focus:outline-none focus:border-[#8781ff] text-[14px]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#c7c4d8] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e14] border border-[#2a2931] text-[#e4e1eb] placeholder-[#918fa1] focus:outline-none focus:border-[#8781ff] text-[14px]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#8781ff] hover:bg-[#c4c0ff] text-[#100069] font-semibold text-[14px] transition-all shadow-lg hover:shadow-[#8781ff]/25 mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
            ) : (
              <>
                <span>{activeMode === 'login' ? 'Sign In & Migrate Data' : 'Create Account & Claim Sandbox'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-[12px] text-[#c7c4d8]">
          {activeMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveMode('register')}
                className="text-[#c4c0ff] hover:underline font-medium"
              >
                Register now
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                className="text-[#c4c0ff] hover:underline font-medium"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
