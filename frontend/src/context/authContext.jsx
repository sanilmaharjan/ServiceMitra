import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const setUserData = (userData, userToken) => {
    console.log(userData)
    setUser(userData);
    setToken(userToken);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    if (userToken) {
      localStorage.setItem("token", userToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUserData(null, null);
  };

  const getUserData = () => user;

  return (
    <AuthContext.Provider value={{ user, token, setUserData, getUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};