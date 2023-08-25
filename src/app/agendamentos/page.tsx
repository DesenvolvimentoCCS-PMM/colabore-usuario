"use client";

import { Container } from "@/components/Container";
import { ScheduleList } from "./SchedulesList";
import { LogoutButton } from "@/components/buttons/LogoutButton";
import { auth, db } from "@/services/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils/capitalize";
import { onAuthStateChanged } from "firebase/auth";
import { useUserDataContext } from "@/context/userContext";
import { doc, getDoc } from "firebase/firestore";
import { SchedulePageSkeletonLoading } from "@/components/loading/SchedulePageSkeletonLoading";
import { notifySuccess } from "@/components/Toast";

export default function Agendamentos() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { setUserData, userData } = useUserDataContext();

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

        setLoading(false);
      } else {
        router.push("/entrar");
      }
    });
  }, []);

  const formations = {
    name: `${userData.fullName.split(" ")[0]} ${
      userData.fullName.split(" ")[1]
    }`,
  };

  return (
    <Container>
      {loading ? (
        <SchedulePageSkeletonLoading />
      ) : (
        <>
          <span className="absolute top-28 text-xs text-gray-400">
            /agendamentos
          </span>
          <header className="flex justify-between items-center w-full">
            <div className=" space-y-4 w-full max-w-sm">
              <h1 className="text-blueCol font-medium text-3xl sm:text-4xl">
                Olá, <span className="underline">{formations.name}!</span>
              </h1>
              <p className="text-gray-900 text-base sm:text-lg">
                Acompanhe seu histórico e faça um novo agendamento aqui
              </p>
            </div>

            <LogoutButton />
          </header>

          <ScheduleList />
        </>
      )}
    </Container>
  );
}
