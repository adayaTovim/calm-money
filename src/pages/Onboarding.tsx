import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Onboarding() {
  const setOnboardingDone = useStore((s) => s.setOnboardingDone);
  const navigate = useNavigate();

  const handleStart = () => {
    setOnboardingDone();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-calm-green-light rounded-2xl flex items-center justify-center">
            <Leaf size={32} className="text-calm-green" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">Calm Money</h1>
        <p className="text-gray-500 text-lg mb-2">Your calm financial assistant</p>
        <p className="text-gray-400 text-sm mb-10">
          Built for Israeli small business owners who want to understand their finances — simply and without stress.
        </p>

        <div className="bg-white rounded-2xl border border-beige-200 p-6 mb-6 text-left space-y-4">
          {[
            { emoji: '📊', title: 'See your free money instantly', desc: 'Know exactly what you can spend this month.' },
            { emoji: '💡', title: 'Smart insights', desc: 'Get clear actions based on your real numbers.' },
            { emoji: '✅', title: 'Simple input', desc: 'Add income and expenses in seconds. Always editable.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <div className="font-medium text-gray-700">{title}</div>
                <div className="text-sm text-gray-400">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 bg-calm-blue text-white py-3.5 rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Get started <ArrowRight size={18} />
        </button>
        <p className="text-xs text-gray-400 mt-3">All data stays on your device. No accounts required.</p>
      </div>
    </div>
  );
}
