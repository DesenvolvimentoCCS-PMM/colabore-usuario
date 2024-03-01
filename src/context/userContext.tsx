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
  user: User;
  loadingData: boolean;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({} as User);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (pathname === "/entrar") {
          router.push("agendamentos");
        }

        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as User;

          setUser({ ...data, uid });
        }

        setLoadingData(false);
      } else if (pathname != "/termos-de-uso") {
        router.push("/entrar");
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, loadingData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
