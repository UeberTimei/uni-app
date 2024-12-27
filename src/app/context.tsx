"use client";

import React, { createContext, useContext } from "react";

interface RoleContextProps {
  role: "ADMIN" | "CLIENT" | "NONE";
  userId: string | null;
  CustomerID: number | null;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider: React.FC<
  React.PropsWithChildren<RoleContextProps>
> = ({ children, role, userId, CustomerID }) => {
  return (
    <RoleContext.Provider value={{ role, userId, CustomerID }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
