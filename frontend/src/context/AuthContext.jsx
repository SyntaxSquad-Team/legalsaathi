import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ls_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  function getRegisteredUsers() {
    try {
      const saved = localStorage.getItem("ls_registered_users");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  function signup(name, email) {
    const registeredUsers = getRegisteredUsers();

    const alreadyExists = registeredUsers.some((u) => u.email === email);
    if (alreadyExists) {
      return { success: false, error: "User already exists. Please sign in." };
    }

    const newUser = { name, email };
    const updatedUsers = [...registeredUsers, newUser];
    localStorage.setItem("ls_registered_users", JSON.stringify(updatedUsers));

    return { success: true };
  }

  function login(name, email) {
    const registeredUsers = getRegisteredUsers();

    const matchedUser = registeredUsers.find((u) => u.email === email);
    if (!matchedUser) {
      return { success: false, error: "No account found. Please sign up first." };
    }

    const userData = { name: matchedUser.name, email: matchedUser.email };
    localStorage.setItem("ls_user", JSON.stringify(userData));
    setUser(userData);

    return { success: true };
  }

  function logout() {
    localStorage.removeItem("ls_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}