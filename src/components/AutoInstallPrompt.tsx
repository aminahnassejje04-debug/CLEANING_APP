import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const AutoInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSChrome, setIsIOSChrome] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already running standalone as an installed home screen app
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (standaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS devices
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isCriOS = ua.includes('crios'); // Chrome on iOS
    setIsIOS(isIOSDevice);
    setIsIOSChrome(isCriOS);

    if (isIOSDevice) {
      // On iOS, prompt immediately so user knows how to add it to Home Screen
      setShowPrompt(true);
    }

    // Android / Chrome beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
      }
    } catch (err) {
      console.error('Install prompt error:', err);
    } finally {
      setInstalling(false);
    }
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl text-slate-900 border border-slate-200 space-y-4">
        {/* App Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-white shrink-0 font-bold shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              Install CleanTrack on iPhone
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Add to Home Screen for fast offline access
            </p>
          </div>
        </div>

        {/* iPhone Safari Step-by-Step Guide */}
        {isIOS && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 text-xs">
            <div className="font-bold text-emerald-900 text-xs flex items-center justify-between">
              <span>Follow these 2 quick steps:</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                iOS Safari
              </span>
            </div>

            {isIOSChrome ? (
              // Chrome on iOS
              <div className="space-y-2 text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> or <strong>3-Dots</strong> button in Chrome.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    Scroll and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                  </span>
                </div>
              </div>
            ) : (
              // Standard Safari on iPhone
              <div className="space-y-2.5 text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    Tap the <strong>Share button</strong> in Safari:
                    <div className="mt-1 flex items-center gap-1.5 text-emerald-900 font-semibold bg-white p-1.5 rounded border border-slate-200 inline-flex text-[11px]">
                      <svg className="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6l-6-6-6 6m6-6v12" />
                      </svg>
                      <span>Share icon (bottom toolbar)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>:
                    <div className="mt-1 flex items-center gap-1.5 text-emerald-900 font-semibold bg-white p-1.5 rounded border border-slate-200 inline-flex text-[11px]">
                      <svg className="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="4" />
                        <path d="M12 8v8m-4-4h8" />
                      </svg>
                      <span>Add to Home Screen</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    Tap <strong>&ldquo;Add&rdquo;</strong> in the top-right corner to finish!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Android / Chrome One-Tap Install Button */}
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            {installing ? 'Opening Installer...' : 'Install App Now'}
          </button>
        )}

        {/* Dismiss Button */}
        <div className="text-center pt-1 border-t border-slate-100">
          <button
            onClick={() => setShowPrompt(false)}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            Got it / Continue in browser &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
