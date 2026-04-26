import { useNavigate } from 'react-router-dom';
import { Scale, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useT } from '../i18n/useT';
import type { Lang } from '../i18n/translations';

export function Onboarding() {
  const { setOnboardingDone, language, setLanguage } = useStore();
  const t = useT();
  const navigate = useNavigate();

  const handleStart = () => {
    setOnboardingDone();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Language picker */}
        <div className="flex justify-center gap-2 mb-6">
          {(['en', 'he'] as Lang[]).map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                language === lang ? 'bg-calm-blue text-white border-calm-blue' : 'border-beige-200 text-gray-400 hover:bg-beige-100'
              }`}>
              {lang === 'en' ? '🇺🇸 EN' : '🇮🇱 HE'}
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-calm-blue-light rounded-2xl flex items-center justify-center">
            <Scale size={32} className="text-calm-blue" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">{t.onboarding_title}</h1>
        <p className="text-gray-500 text-lg mb-2">{t.onboarding_sub}</p>
        <p className="text-gray-400 text-sm mb-10">{t.onboarding_desc}</p>

        <div className="bg-white rounded-2xl border border-beige-200 p-6 mb-6 text-start space-y-4">
          {[
            { emoji: '📊', title: t.onboarding_f1_title, desc: t.onboarding_f1_desc },
            { emoji: '💡', title: t.onboarding_f2_title, desc: t.onboarding_f2_desc },
            { emoji: '✅', title: t.onboarding_f3_title, desc: t.onboarding_f3_desc },
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

        <button onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 bg-calm-blue text-white py-3.5 rounded-xl font-medium hover:bg-blue-600 transition-colors">
          {t.onboarding_cta} <ArrowRight size={18} className="rtl:rotate-180" />
        </button>
        <p className="text-xs text-gray-400 mt-3">{t.onboarding_privacy}</p>
      </div>
    </div>
  );
}
