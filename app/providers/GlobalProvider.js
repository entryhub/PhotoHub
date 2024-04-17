import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentMediaItem, setCurrentMediaItem] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        currentAlbum,
        setCurrentAlbum,
        currentMediaItem,
        setCurrentMediaItem,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
