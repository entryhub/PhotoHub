import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentMediaItem, setCurrentMediaItem] = useState(null);
  const [isSelectMode, setIsSelectMode] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        currentAlbum,
        setCurrentAlbum,
        currentMediaItem,
        setCurrentMediaItem,
        isSelectMode,
        setIsSelectMode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
