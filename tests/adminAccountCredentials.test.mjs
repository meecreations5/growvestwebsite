import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeAdminUsername,
  isValidAdminUsername,
  normalizeAdminEmail,
  isValidAdminEmail,
  isValidInitialPassword,
} from "../src/app/lib/server/adminAccountCredentials.js";

test("username normalization is case insensitive", () => {
  assert.equal(normalizeAdminUsername("  Rahul.SEO "), "rahul.seo");
  assert.equal(normalizeAdminUsername(undefined), "");
});

test("valid username formats", () => {
  for (const name of ["rahul.seo", "seo_team", "a-b", "abc", "a1b"]) {
    assert.equal(isValidAdminUsername(name), true, name);
  }
});

test("invalid usernames are rejected", () => {
  for (const name of ["", "ab", "1start", "_start", "space value", "../../escape", "admin", "ROOT", "growvest", "a".repeat(33), "test@example.com", "a/../b"]) {
    assert.equal(isValidAdminUsername(name), false, name);
  }
});

test("normalized email is lowercased and basic email shapes enforced", () => {
  assert.equal(normalizeAdminEmail(" Rahul@Example.com "), "rahul@example.com");
  assert.equal(isValidAdminEmail("rahul@example.com"), true);
  assert.equal(isValidAdminEmail("missing-at"), false);
  assert.equal(isValidAdminEmail(""), false);
});

test("initial passwords require length, letters, digits and no identity words", () => {
  assert.equal(isValidInitialPassword("Generous-Weather9&Block", "rahul.seo", "rahul@example.com"), true);
  assert.equal(isValidInitialPassword("short123", "rahul.seo", "rahul@example.com"), false);
  assert.equal(isValidInitialPassword("abcdefghijklmnop", "rahul.seo", "rahul@example.com"), false);
  assert.equal(isValidInitialPassword("12345678909876543210", "rahul.seo", "rahul@example.com"), false);
  assert.equal(isValidInitialPassword("1Rahul.SEOprotected", "rahul.seo", "rahul@example.com"), false);
  assert.equal(isValidInitialPassword("rahul-Password99", "rahul.seo", "rahul@example.com"), false);
  assert.equal(isValidInitialPassword("Valid1".repeat(22), "rahul.seo", "rahul@example.com"), false);
});
