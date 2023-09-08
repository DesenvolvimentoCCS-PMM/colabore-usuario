"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface IUserLogged {
  hasUserLogged: boolean;
  setHasUserLogged: Dispatch<SetStateAction<boolean>>;
}

const UserLoggedContext = createContext<IUserLogged>({
  hasUserLogged: false,
  setHasUserLogged: () => {},
});

export const UserLoggedProvider = ({ children }: { children: ReactNode }) => {
  const [hasUserLogged, setHasUserLogged] = useState<boolean>(false);

  return (
    <UserLoggedContext.Provider value={{ hasUserLogged, setHasUserLogged }}>
      {children}
    </UserLoggedContext.Provider>
  );
};

export const useUserLoggedContext = () => {
  return useContext(UserLoggedContext);
};
