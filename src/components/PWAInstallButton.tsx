import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside installed standalone app, hide install trigger
  if (isInstalled) {
    return (
      <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-semibold">
        Installed
      </span>
    );
  }

  return (
    <>
      {/* Install Button in Top Bar */}
      {isInstallable ? (
        <button
          onClick={install}
          className="text-xs bg-white text-emerald-900 font-bold px-2.5 py-1 rounded shadow-xs hover:bg-emerald-50 cursor-pointer transition-colors"
        >
          Install App
        </button>
      ) : (
        <button
          onClick={() => setShowGuide(true)}
          className="text-xs bg-emerald-900 text-emerald-100 hover:text-white px-2 py-1 rounded font-medium border border-emerald-700 cursor-pointer transition-colors"
        >
          Install
        </button>
      )}

      {/* Mobile Install Guide Dialog */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                Install on Your Mobile Phone
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base px-1"
              >
                &times;
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              This app is a compliant <strong>Progressive Web App (PWA)</strong> that installs directly to your home screen like a native mobile app.
            </p>

            {/* Android / Chrome Guide */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">Android (Chrome / Edge / Firefox):</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Open this app in your mobile browser.</li>
                <li>Tap the browser menu (<strong>3 dots &vellip;</strong> in top right).</li>
                <li>Tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</li>
              </ol>
            </div>

            {/* iPhone / Safari Guide */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">iPhone / iPad (Safari):</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Open this app in <strong>Safari</strong>.</li>
                <li>Tap the <strong>Share</strong> button (box with upward arrow).</li>
                <li>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
              </ol>
            </div>

            {/* GitHub Deployment note */}
            <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 text-emerald-900">
              <div className="font-bold mb-0.5">Using via GitHub:</div>
              <p className="text-[11px] leading-relaxed">
                When you push this repository to GitHub and enable <strong>GitHub Pages</strong> (or host on Vercel/Netlify/Cloud Run), open your live site link on any phone to install it immediately with offline support and local storage!
              </p>
            </div>

            {isInstallable && (
              <button
                onClick={() => {
                  setShowGuide(false);
                  install();
                }}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded text-xs transition-colors cursor-pointer"
              >
                Tap Here to Install Now
              </button>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 rounded text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
