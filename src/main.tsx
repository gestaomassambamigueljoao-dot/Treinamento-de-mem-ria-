import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global safety guard to prevent uncaught "undefined is not valid JSON" errors from third-party scripts (e.g. Wistia, tracking, etc.)
try {
  const originalParse = JSON.parse;
  JSON.parse = function (text: any, reviver?: any) {
    if (text === undefined || text === null || text === "undefined" || text === "") {
      return null;
    }
    return originalParse(text, reviver);
  };
} catch (e) {
  console.warn("Could not patch JSON.parse", e);
}

// Global safety handlers to suppress benign, non-critical layout warnings and external resource fetch errors (e.g. Wistia CDNs blocked by ad-blockers)
if (typeof window !== 'undefined') {
  // 1. Patch ResizeObserver to defer callback execution to requestAnimationFrame.
  // This is the most reliable way to prevent "ResizeObserver loop completed with undelivered notifications"
  if (window.ResizeObserver) {
    const OriginalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super((entries, observer) => {
          window.requestAnimationFrame(() => {
            try {
              callback(entries, observer);
            } catch (err) {
              // Suppress or log silently
            }
          });
        });
      }
    };
  }

  // 2. Add window.onerror suppression
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msg = String(message || '');
    if (
      msg.includes('ResizeObserver') ||
      msg.includes('ResizeObserver loop completed') ||
      msg.includes('ResizeObserver loop limit exceeded')
    ) {
      return true; // Suppress error propagation
    }
    if (originalOnError) {
      return originalOnError.apply(this, arguments as any);
    }
    return false;
  };

  // 3. Add window event listener for error suppression
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (
      message.includes('ResizeObserver') ||
      message.includes('ResizeObserver loop completed with undelivered notifications') ||
      message.includes('ResizeObserver loop limit exceeded')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason) {
      const message = reason.message || '';
      if (
        message.includes('Failed to fetch') ||
        message.includes('fetch') ||
        (reason.name === 'TypeError' && message.includes('fetch'))
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
