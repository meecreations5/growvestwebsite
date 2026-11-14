import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (file) => readFileSync(file, "utf8");
const auth = read("src/app/lib/server/adminAuth.js");
const repo = read("src/app/lib/server/adminUsersRepository.js");
const signin = read("src/app/api/admin/login/password/route.js");
const reset = read("src/app/api/admin/account/password/route.js");
const login = read("src/app/admin/login/AdminLogin.jsx");
const shell = read("src/app/admin/_components/AdminShell.jsx");
const users = read("src/app/admin/_components/AdminUsersManager.jsx");
const session = read("src/app/api/admin/session/route.js");

for (const text of ["auth.createUser", "db.runTransaction", "tx.create(usernameRef", "requiresPasswordChange: true", "auth.deleteUser", "ADMIN_ROLES.includes(role)"]) {
  assert.ok(repo.includes(text), `Provisioning is missing ${text}`);
}
for (const text of ["enforceRateLimit", "signInFirebasePassword", "verifyIdToken", "createSessionCookie", "websiteAdminUsernames", "profile.isActive === false", "INVALID_CREDENTIALS"]) {
  assert.ok(signin.includes(text), `Username sign-in missing ${text}`);
}
for (const text of ["enforceRateLimit", "verifyAdminSessionCookie", "signInFirebasePassword", "auth.updateUser", "revokeRefreshTokens", "requiresPasswordChange: false"]) {
  assert.ok(reset.includes(text), `Password rotation is missing ${text}`);
}
assert.ok(auth.includes('if (admin.requiresPasswordChange) redirect("/admin/change-password")'), "Password-change-only guard missing in page auth");
assert.ok(auth.includes('error.code = "ADMIN_PASSWORD_CHANGE_REQUIRED"'), "API must block pre-rotation access");
assert.ok(auth.includes('viewer: ["insights.read", "website.read", "seo.read"]'), "Viewer must be least privilege");
assert.ok(login.includes("/api/admin/login/password"), "Login screen missing username sign-in");
assert.ok(login.includes("Continue with Microsoft"), "Existing Microsoft sign-in must be retained");
assert.ok(login.includes("signInWithEmailAndPassword"), "Existing email/password sign-in must be retained");
assert.ok(users.includes("/api/admin/users"), "Admin user creation UI missing");
assert.ok(users.includes("generatePassword"), "Secure password generation missing");
assert.ok(shell.includes("User Management"), "Navigation to User Management missing");
assert.ok(session.includes("requiresPasswordChange"), "Email sign-in must route first-login users to password change");
console.log("Username/password admin integration checks passed.");
