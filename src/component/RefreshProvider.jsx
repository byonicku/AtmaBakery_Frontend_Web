import { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useRefresh() {
  return useContext(RefreshContext);
}

// eslint-disable-next-line react/prop-types
export function RefreshProvider({ children }) {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <RefreshContext.Provider value={{ refresh, handleRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}
