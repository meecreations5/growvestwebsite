import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const ANALYTICS_STATE_KEY = "__growvestFirebaseAnalyticsState";

function getAnalyticsState() {
  if (typeof window === "undefined") {
    return { promise: null, instance: null };
  }

  if (!window[ANALYTICS_STATE_KEY]) {
    window[ANALYTICS_STATE_KEY] = {
      promise: null,
      instance: null,
    };
  }

  return window[ANALYTICS_STATE_KEY];
}

export function isFirebaseClientConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId &&
      firebaseConfig.measurementId,
  );
}

export function getFirebaseClientApp() {
  if (!isFirebaseClientConfigured()) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export async function initializeFirebaseAnalytics() {
  if (typeof window === "undefined" || !isFirebaseClientConfigured()) return null;

  const state = getAnalyticsState();
  if (state.instance) return state.instance;
  if (state.promise) return state.promise;

  state.promise = import("firebase/analytics")
    .then(async ({ getAnalytics, initializeAnalytics, isSupported, setAnalyticsCollectionEnabled }) => {
      const supported = await isSupported();
      if (!supported) return null;

      const app = getFirebaseClientApp();
      if (!app) return null;

      let analytics;
      try {
        analytics = initializeAnalytics(app, {
          config: {
            send_page_view: false,
            anonymize_ip: true,
          },
        });
      } catch (error) {
        if (error?.code !== "analytics/already-exists") throw error;
        analytics = getAnalytics(app);
      }

      setAnalyticsCollectionEnabled(analytics, true);
      state.instance = analytics;
      return analytics;
    })
    .catch((error) => {
      state.promise = null;
      if (process.env.NODE_ENV !== "production") {
        console.warn("GrowVest Firebase Analytics could not be initialized:", error);
      }
      return null;
    });

  return state.promise;
}

export async function setFirebaseAnalyticsConsent(allowed) {
  if (typeof window === "undefined") return false;

  const state = getAnalyticsState();

  if (!allowed) {
    if (!state.instance) return true;
    const { setAnalyticsCollectionEnabled } = await import("firebase/analytics");
    setAnalyticsCollectionEnabled(state.instance, false);
    return true;
  }

  const analytics = await initializeFirebaseAnalytics();
  if (!analytics) return false;

  const { setAnalyticsCollectionEnabled } = await import("firebase/analytics");
  setAnalyticsCollectionEnabled(analytics, true);
  return true;
}

export async function logFirebaseAnalyticsEvent(eventName, parameters = {}) {
  if (typeof window === "undefined" || !eventName) return false;

  const analytics = await initializeFirebaseAnalytics();
  if (!analytics) return false;

  const { logEvent } = await import("firebase/analytics");
  logEvent(analytics, eventName, parameters);
  return true;
}
