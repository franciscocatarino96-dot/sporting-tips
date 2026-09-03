"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
  getCurrentUser,
  loginWithCode,
  logoutUser,
} from "../lib/auth";

import { auth } from "../lib/firebase";

type User = {
  code: string;
  name: string;
  admin: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User | string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          const storedUser = getCurrentUser();

          if (storedUser) {
            setUser(storedUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function login(userOrCode: User | string) {
    const code =
      typeof userOrCode === "string"
        ? userOrCode
        : userOrCode.code;

    const loggedUser = await loginWithCode(code);

    setUser(loggedUser);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}