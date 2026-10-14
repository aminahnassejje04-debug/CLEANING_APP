import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'usb' | 'browser'>('usb');

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
          Install / USB
        </button>
      )}

      {/* Installation Guide Dialog */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl text-xs space-y-3 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                Install on Phone
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base px-1"
              >
                &times;
              </button>
            </div>

            {/* Tabs: USB vs Browser */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setActiveTab('usb')}
                className={`py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  activeTab === 'usb'
                    ? 'bg-emerald-800 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔌 Via USB Cable
              </button>
              <button
                onClick={() => setActiveTab('browser')}
                className={`py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  activeTab === 'browser'
                    ? 'bg-emerald-800 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌐 Via Browser Link
              </button>
            </div>

            {/* TAB 1: USB Installation Steps */}
            {activeTab === 'usb' && (
              <div className="space-y-2.5">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-900 space-y-1.5">
                  <div className="font-bold text-xs">Direct USB Installation Steps:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    <li>
                      <strong>Plug your phone into your computer</strong> using a USB cable.
                    </li>
                    <li>
                      On your phone, enable <strong>USB Debugging</strong> (go to <em>Settings &gt; Developer Options &gt; USB Debugging &rarr; Turn ON</em>).
                    </li>
                    <li>
                      On your computer's Chrome browser, open:
                      <div className="bg-white p-1 rounded font-mono text-[10px] my-0.5 border select-all text-slate-800">
                        chrome://inspect/#devices
                      </div>
                    </li>
                    <li>
                      Click <strong>&ldquo;Port forwarding...&rdquo;</strong>, enter Port <code>3000</code> mapped to <code>localhost:3000</code>.
                    </li>
                    <li>
                      On your phone's browser, open <strong>http://localhost:3000</strong>.
                    </li>
                    <li>
                      Tap <strong>&ldquo;Install App&rdquo;</strong> &mdash; the app installs directly onto your phone screen via USB!
                    </li>
                  </ol>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-600">
                  <div className="font-bold text-slate-800 mb-0.5">Android Native CLI (Capacitor/ADB):</div>
                  <p className="text-[11px] leading-relaxed">
                    You can also build directly to your USB-connected device:
                  </p>
                  <pre className="bg-slate-900 text-emerald-300 p-2 rounded mt-1 font-mono text-[10px] overflow-x-auto">
npm run build
npx cap run android
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 2: Browser / GitHub Link Installation */}
            {activeTab === 'browser' && (
              <div className="space-y-2">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Android (Chrome / Edge):</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Open your live link in Chrome on your phone.</li>
                    <li>Tap the <strong>3 dots (&vellip;)</strong> menu.</li>
                    <li>Tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</li>
                  </ol>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">iPhone / iPad (Safari):</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Open your live link in Safari.</li>
                    <li>Tap the <strong>Share</strong> button (box with upward arrow).</li>
                    <li>Tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
                  </ol>
                </div>
              </div>
            )}

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
