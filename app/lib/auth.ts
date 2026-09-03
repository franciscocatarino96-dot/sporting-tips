import { signInWithCustomToken, signOut } from "firebase/auth";

import { auth } from "./firebase";

export type User = {
  code: string;
  name: string;
  admin: boolean;
};

export async function loginWithCode(
  code: string
): Promise<User> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Erro ao fazer login."
    );
  }

  await signInWithCustomToken(auth, data.token);

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  return data.user;
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export async function logoutUser() {
  await signOut(auth);

  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}