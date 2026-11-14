// Only called on the server. The identity toolkit verifies passwords; neither this
// application nor Firestore ever stores or hashes a user's password.
export async function signInFirebasePassword(email, password) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    const error = new Error("Firebase password sign-in is not configured.");
    error.status = 503;
    throw error;
  }

  let response;
  try {
    response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      },
    );
  } catch {
    const error = new Error("The sign-in service is temporarily unavailable.");
    error.status = 503;
    throw error;
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 401 || response.status === 403) return null;
    const error = new Error("The sign-in service is temporarily unavailable.");
    error.status = 503;
    throw error;
  }

  const result = await response.json().catch(() => null);
  return typeof result?.idToken === "string" ? result.idToken : null;
}
