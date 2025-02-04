import React, { createContext, useContext, useState } from "react";

const RefreshContext = createContext({
  refreshing: false,
  setRefreshing: (value: boolean) => {},
});

export const RefreshProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <RefreshContext.Provider value={{ refreshing, setRefreshing }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
