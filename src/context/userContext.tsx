"use client";

import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

interface UserContextType {
  userData: User;
  loadingData: boolean;
}

const UserContext = createContext<UserContextType>({
  userData: {
    fullName: "",
    imageRights: false,
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
  loadingData: true,
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
    imageRights: false,
    uid: "",
  });
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as User;

          setUserData({ ...data, uid });
        }

        setLoadingData(false);
      } else if (pathname != "/termos-de-uso") {
        router.push("/entrar");
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ userData, loadingData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserDataContext = () => {
  return useContext(UserContext);
};
