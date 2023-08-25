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
  userData: User;
  setUserData: Dispatch<SetStateAction<User>>;
}

const UserContext = createContext<UserContextType>({
  userData: {
    fullName: "",
    birthDate: "",
    cep: "",
    city: "",
    cpf: "",
    email: "",
    neighborhood: "",
    number: "",
    otherPhone: "",
    profession: "",
    state: "",
    street: "",
    whatsapp: "",
    photo: "",
    lgpd: false,
    terms: false,
    uid: "",
  },
  setUserData: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<User>({
    fullName: "",
    birthDate: "",
    cep: "",
    city: "",
    cpf: "",
    email: "",
    neighborhood: "",
    number: "",
    otherPhone: "",
    profession: "",
    state: "",
    street: "",
    whatsapp: "",
    photo: "",
    lgpd: false,
    terms: false,
    uid: "",
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserDataContext = () => {
  return useContext(UserContext);
};
