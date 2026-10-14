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
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed and opened from home screen
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (standaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // On iOS Safari, show prompt immediately since beforeinstallprompt is not supported
      setShowPrompt(true);
    }

    // Listen for native Android / Chrome beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);

      // Attempt immediate prompt invocation
      promptEvent.prompt().catch(() => {
        // If browser blocks non-gesture prompt, promptEvent is preserved for the button tap
      });
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Also trigger prompt if user taps anywhere if prompt is ready
    const handleGlobalClick = () => {
      if (deferredPrompt && !isStandalone) {
        deferredPrompt.prompt().catch(() => {});
      }
    };
    window.addEventListener('click', handleGlobalClick, { once: true });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [deferredPrompt, isStandalone]);

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

  // If already installed and running standalone, do not display install modal
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-center space-y-4 border border-slate-200">
        {/* App Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-800 flex items-center justify-center text-white shadow-md">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>

        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Install Cleaning Service App
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Install this app on your phone for full-screen use, fast access, and offline data storage.
          </p>
        </div>

        {/* Android / Chrome flow */}
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            {installing ? 'Opening Phone Installer...' : 'Install App to Phone'}
          </button>
        )}

        {/* iOS Safari flow instructions */}
        {isIOS && !deferredPrompt && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-left text-xs text-emerald-900 space-y-1.5">
            <div className="font-bold">To install on your iPhone:</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Tap the <strong>Share</strong> button at bottom of Safari (box with up arrow).</li>
              <li>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
            </ol>
          </div>
        )}

        {/* Fallback if beforeinstallprompt is still warming up */}
        {!deferredPrompt && !isIOS && (
          <div className="text-xs text-slate-500 py-1">
            Tap the browser menu (<strong>3 dots &vellip;</strong>) and select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
          </div>
        )}

        {/* Dismiss option */}
        <button
          onClick={() => setShowPrompt(false)}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
        >
          Continue in browser &rarr;
        </button>
      </div>
    </div>
  );
};
