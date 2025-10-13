import React, { createContext, useContext, useState } from "react";

type User = {
  name: string;
  walletAddress: string | null;
  companyId: string;
};

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: "Usuario Demo",
    walletAddress: null,
    companyId: "COMPANY_ID", // Puedes obtenerlo dinámicamente tras login
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
}