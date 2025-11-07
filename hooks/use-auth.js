"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication state when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const freshToken = await firebaseUser.getIdToken(true);
        setUser(firebaseUser);
        setToken(freshToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ LOGIN
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ✅ SIGNUP WITH BACKEND USER CREATION
  const signup = async (email, password, displayName) => {
    // 1) Create Firebase user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // 2) Save Display Name
    await updateProfile(user, { displayName });

    // 3) Get Firebase token
    const freshToken = await user.getIdToken(true);

    // 4) Call backend to create DB user
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${freshToken}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      }),
    });

    // 5) Update UI state
    setUser({ ...user });
    setToken(freshToken);
  };

  // ✅ LOGOUT
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
