"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface UserContextType {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

const UserContext = createContext<UserContextType>({
  username: "",
  setUsername: (): string => "",
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
