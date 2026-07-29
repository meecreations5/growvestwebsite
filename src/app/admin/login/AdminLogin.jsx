"use client";

import { useRef, useState } from "react";
import {
  getAuth,
  inMemoryPersistence,
  OAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { getFirebaseClientApp } from "../../lib/firebaseClient";
import { GrowVestMark } from "../../components/GrowVestMark";

const MICROSOFT_TENANT_ID = process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID || "common";

function MicrosoftGlyph() {
  return (
    <span className="grid h-[18px] w-[18px] grid-cols-2 gap-[2px]" aria-hidden="true">
      <span className="bg-[#F25022]" />
      <span className="bg-[#7FBA00]" />
      <span className="bg-[#00A4EF]" />
      <span className="bg-[#FFB900]" />
    </span>
  );
}

function normalizeLoginError(error, stage = "unknown") {
  if (error instanceof Error) {
    return {
      stage,
      name: error.name || "Error",
      code: typeof error.code === "string" ? error.code : "",
      message: error.message || "An unknown sign-in error occurred.",
      status: Number(error.status || error.customData?.status || 0),
      customData: error.customData || null,
    };
  }

  if (error && typeof error === "object") {
    return {
      stage,
      name: typeof error.name === "string" ? error.name : "UnknownError",
      code: typeof error.code === "string" ? error.code : "",
      message:
        (typeof error.message === "string" && error.message) ||
        (typeof error.error === "string" && error.error) ||
        (typeof error.reason === "string" && error.reason) ||
        "An unknown sign-in error occurred.",
      status: Number(error.status || error.customData?.status || 0),
      customData: error.customData || null,
    };
  }

  return {
    stage,
    name: "UnknownError",
    code: "",
    message: error ? String(error) : "An unknown sign-in error occurred.",
    status: 0,
    customData: null,
  };
}

function matchesCode(code, expected) {
  return code === expected || code.endsWith(`/${expected}`) || code.includes(expected);
}

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busyMethod, setBusyMethod] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const microsoftPopupInFlight = useRef(false);

  const busy = Boolean(busyMethod);

  function getConfiguredAuth() {
    const app = getFirebaseClientApp();
    if (!app) {
      const configurationError = new Error("Firebase is not configured for this environment.");
      configurationError.code = "admin-login/firebase-not-configured";
      throw configurationError;
    }
    return getAuth(app);
  }

  async function createAdminSession(user) {
    const idToken = await user.getIdToken(true);
    const response = await fetch("/api/admin/session", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const responseText = await response.text();
    let result = {};

    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { message: responseText };
      }
    }

    if (!response.ok) {
      const sessionError = new Error(
        result.error ||
          result.message ||
          `Admin session creation failed with status ${response.status}.`,
      );
      sessionError.code = result.code || `admin-session/http-${response.status}`;
      sessionError.status = response.status;
      sessionError.customData = {
        status: response.status,
        response: result,
      };
      throw sessionError;
    }

    return result;
  }

  async function finishSignIn(auth, user) {
    await createAdminSession(user);
    await signOut(auth).catch(() => null);
    window.location.replace("/admin/dashboard");
  }

  async function handleMicrosoftSignIn() {
    if (busy || microsoftPopupInFlight.current) return;

    microsoftPopupInFlight.current = true;
    setBusyMethod("microsoft");
    setError("");
    setMessage("Complete the sign-in in the Microsoft window.");

    let stage = "initialising_microsoft_login";

    try {
      const auth = getConfiguredAuth();
      await setPersistence(auth, inMemoryPersistence);

      const provider = new OAuthProvider("microsoft.com");
      const customParameters = {
        prompt: "select_account",
        tenant: MICROSOFT_TENANT_ID,
      };

      if (email.trim()) {
        customParameters.login_hint = email.trim();
      }

      provider.setCustomParameters(customParameters);
      stage = "waiting_for_microsoft_account";

      const credential = await signInWithPopup(auth, provider);
      if (!credential?.user) {
        const missingUserError = new Error(
          "Microsoft authentication completed without returning a Firebase user.",
        );
        missingUserError.code = "admin-login/missing-firebase-user";
        throw missingUserError;
      }

      stage = "creating_admin_session";
      setMessage("Microsoft sign-in completed. Creating your secure admin session...");
      await finishSignIn(auth, credential.user);
    } catch (loginError) {
      const details = normalizeLoginError(loginError, stage);

      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[GrowVest Admin Login] stage=${details.stage} code=${details.code || "none"} status=${details.status || "none"} message=${details.message}`,
        );
      }

      setMessage("");

      if (matchesCode(details.code, "popup-closed-by-user")) {
        setError("Microsoft sign-in was cancelled. Choose Continue with Microsoft to try again.");
      } else if (matchesCode(details.code, "cancelled-popup-request")) {
        setError("Another Microsoft sign-in window is already open. Complete or close it before trying again.");
      } else if (matchesCode(details.code, "popup-blocked")) {
        setError("Your browser blocked the Microsoft sign-in window. Allow pop-ups for this site and try again.");
      } else if (matchesCode(details.code, "account-exists-with-different-credential")) {
        setError("This email is connected to another sign-in method. Use that method or contact the GrowVest administrator.");
      } else if (matchesCode(details.code, "operation-not-allowed")) {
        setError("Microsoft sign-in is not enabled in Firebase Authentication.");
      } else if (matchesCode(details.code, "unauthorized-domain")) {
        setError("This website domain is not authorised for Firebase sign-in. Add it under Firebase Authentication authorised domains.");
      } else if (matchesCode(details.code, "ADMIN_ACCESS_NOT_FOUND")) {
        setError("Microsoft sign-in succeeded, but this Firebase user is not listed in the Website Admin directory.");
      } else if (matchesCode(details.code, "ADMIN_ACCESS_INACTIVE")) {
        setError("This Website Admin account is currently inactive. Contact the GrowVest system administrator.");
      } else if (matchesCode(details.code, "ADMIN_ROLE_INVALID")) {
        setError("This Website Admin account does not have a valid admin role.");
      } else if (details.stage === "creating_admin_session") {
        setError(
          details.message ||
            "Microsoft sign-in succeeded, but the secure Website Admin session could not be created.",
        );
      } else {
        setError(details.message || "Microsoft sign-in could not be completed.");
      }
    } finally {
      microsoftPopupInFlight.current = false;
      setBusyMethod("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;

    setBusyMethod("password");
    setError("");
    setMessage("");

    let stage = "signing_in_with_password";

    try {
      const auth = getConfiguredAuth();
      await setPersistence(auth, inMemoryPersistence);
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      stage = "creating_admin_session";
      await finishSignIn(auth, credential.user);
    } catch (loginError) {
      const details = normalizeLoginError(loginError, stage);

      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[GrowVest Admin Login] stage=${details.stage} code=${details.code || "none"} status=${details.status || "none"} message=${details.message}`,
        );
      }

      if (
        matchesCode(details.code, "invalid-credential") ||
        matchesCode(details.code, "wrong-password") ||
        matchesCode(details.code, "user-not-found")
      ) {
        setError("The email or password is not correct.");
      } else if (matchesCode(details.code, "account-exists-with-different-credential")) {
        setError("This account uses Microsoft sign-in. Choose Continue with Microsoft above.");
      } else if (details.stage === "creating_admin_session") {
        setError(details.message || "The secure Website Admin session could not be created.");
      } else {
        setError(details.message || "Unable to sign in.");
      }
    } finally {
      setBusyMethod("");
    }
  }

  async function handleReset() {
    if (busy) return;

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your admin email first, then choose Reset password.");
      return;
    }

    try {
      const auth = getConfiguredAuth();
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("A password reset email has been requested for this address.");
    } catch (resetError) {
      const details = normalizeLoginError(resetError, "requesting_password_reset");
      if (matchesCode(details.code, "user-not-found")) {
        setError("No email-and-password account was found. Try Continue with Microsoft.");
      } else {
        setError(details.message || "Unable to request a password reset.");
      }
    }
  }

  return (
    <main className="grid min-h-screen overflow-hidden bg-[#0B0B0F] lg:grid-cols-[minmax(0,0.88fr)_minmax(460px,0.72fr)]">
      <section className="relative hidden min-w-0 overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between xl:p-14 2xl:p-16">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 15% 16%, rgba(31,78,216,.34), transparent 37%), radial-gradient(circle at 82% 76%, rgba(245,179,1,.11), transparent 34%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,.65) 0.7px, transparent 0.7px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex items-center justify-between gap-6">
          <img
            src="/growvest-logo-white.svg"
            alt="GrowVest"
            className="h-auto w-[176px] select-none"
            draggable="false"
          />
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
            <ShieldCheck size={14} className="text-[#F5B301]" />
            Authorised access
          </div>
        </div>

        <div className="relative max-w-[660px] py-12">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1F4ED8]/35 bg-[#1F4ED8]/10 text-[#1F4ED8] shadow-[0_16px_45px_rgba(31,78,216,.18)]">
              <GrowVestMark className="w-9" decorative />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#F5B301]">Insights &amp; Blog Workspace</p>
              <p className="mt-1 text-sm text-white/45">GrowVest Website Admin</p>
            </div>
          </div>

          <h1 className="max-w-[620px] font-serif text-[clamp(3rem,5vw,5.4rem)] font-bold leading-[0.99] tracking-[-0.035em] text-white">
            Ideas that help people experience wealth with greater clarity.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/58">
            Create, review, schedule and publish GrowVest educational content through one controlled editorial workflow.
          </p>
        </div>

        <div className="relative flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/35">
          <span>Your Conscious Wealth Partner</span>
          <span>growvest.info/admin</span>
        </div>
      </section>

      <section className="relative flex min-w-0 items-center justify-center bg-[#F4F6F9] px-5 py-10 sm:px-8 lg:px-10 xl:px-14">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1F4ED8] via-[#F5B301] to-[#1F4ED8]" />

        <div className="w-full max-w-[470px]">
          <div className="mb-7 flex items-center justify-between lg:hidden">
            <img
              src="/growvest-logo-dark.svg"
              alt="GrowVest"
              className="h-auto w-[150px] select-none"
              draggable="false"
            />
            <span className="rounded-full border border-[#1F4ED8]/15 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1F4ED8]">
              Website Admin
            </span>
          </div>

          <div className="rounded-[30px] border border-black/[0.05] bg-white p-6 shadow-[0_28px_90px_rgba(11,11,15,.12)] sm:p-9 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Secure admin access</p>
            <h2 className="mt-3 font-serif text-[2.55rem] font-bold leading-tight tracking-[-0.025em] text-[#0B0B0F]">
              Welcome back.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              Sign in with an approved GrowVest Website Admin account.
            </p>

            <button
              type="button"
              onClick={handleMicrosoftSignIn}
              disabled={busy}
              className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#D8DCE5] bg-white px-4 text-sm font-bold text-[#0B0B0F] shadow-sm transition hover:-translate-y-0.5 hover:border-[#BFC6D4] hover:shadow-md disabled:cursor-wait disabled:opacity-65"
            >
              {busyMethod === "microsoft" ? (
                <LoaderCircle className="animate-spin" size={19} />
              ) : (
                <MicrosoftGlyph />
              )}
              {busyMethod === "microsoft" ? "Connecting to Microsoft..." : "Continue with Microsoft"}
            </button>

            <div className="my-7 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-[#E6E9EF]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9AA1AE]">or use email</span>
              <span className="h-px flex-1 bg-[#E6E9EF]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-[#1F2937]">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#1F4ED8] focus:ring-4 focus:ring-[#1F4ED8]/10"
                    placeholder="connect@growvest.info"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label htmlFor="admin-password" className="block text-sm font-semibold text-[#1F2937]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={busy}
                    className="text-xs font-semibold text-[#1F4ED8] hover:underline disabled:opacity-60"
                  >
                    Reset password
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#1F4ED8] focus:ring-4 focus:ring-[#1F4ED8]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#6B7280] hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                  {error}
                </p>
              )}
              {message && (
                <p role="status" className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-800">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white shadow-[0_14px_30px_rgba(31,78,216,.2)] transition hover:-translate-y-0.5 hover:bg-[#173CB2] hover:shadow-[0_18px_36px_rgba(31,78,216,.26)] disabled:cursor-wait disabled:opacity-70"
              >
                {busyMethod === "password" ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <>
                    Sign in securely <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 rounded-2xl bg-[#F4F6F9] px-4 py-3.5 text-xs leading-5 text-[#6B7280]">
              Access is limited to approved GrowVest administrators. Your account must also be active in the Website Admin directory.
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[#6B7280]">
            Having trouble signing in? Contact the GrowVest system administrator.
          </p>
        </div>
      </section>
    </main>
  );
}
