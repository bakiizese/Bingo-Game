import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type StoreDataType = {
  id: string;
  type: string;
};

type AppContextType = {
  storedData: StoreDataType[];
  setStoredData: Dispatch<SetStateAction<StoreDataType[]>>;
  updateMineData: number;
  setUpdateMineData: Dispatch<SetStateAction<number>>;
  showNot: boolean;
  setShowNot: Dispatch<SetStateAction<boolean>>;
  notContent: string;
  setNotContent: Dispatch<SetStateAction<string>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: any }) => {
  const [storedData, setStoredData] = useState<StoreDataType[]>([]);
  const [updateMineData, setUpdateMineData] = useState<number>(0);
  const [showNot, setShowNot] = useState(false);
  const [notContent, setNotContent] = useState("");

  return (
    <AppContext.Provider
      value={{
        storedData,
        setStoredData,
        updateMineData,
        setUpdateMineData,
        showNot,
        setShowNot,
        notContent,
        setNotContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppcontext must be used with in a DataProvided");
  }
  return context;
};
