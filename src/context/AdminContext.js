// src/context/AdminContext.js
import { createContext, useContext, useEffect, useState } from "react";
import dayjs from "dayjs";

const AdminContext = createContext();

const expirationDate = dayjs().add(30, "minutes").toDate();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // ✅ 컴포넌트 마운트 시 localStorage에서 로그인 정보 불러오기
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(storedAdmin);
    }
  }, []);

  const login = (id) => {
    setAdmin(id);
    localStorage.setItem("admin", id); // ✅ 저장
    localStorage.setItem("expiration", expirationDate)
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin"); // ✅ 삭제
    localStorage.removeItem("expiration");
  };

  return <AdminContext.Provider value={{ admin, login, logout }}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
