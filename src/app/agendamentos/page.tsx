"use client";

import { Container } from "@/components/Container";
import { ScheduleList } from "./SchedulesList";
import { LogoutButton } from "@/components/buttons/LogoutButton";
import { auth } from "@/services/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils/capitalize";
import { onAuthStateChanged } from "firebase/auth";
import { useUserContext } from "@/context/userContext";

export default function Agendamentos() {
  const [name, setName] = useState("");
  const router = useRouter();

  const { setUsername } = useUserContext();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const userData = user.email?.split(".")[0];
        const nameFormated = capitalize(userData);
        setName(nameFormated);
        setUsername(nameFormated);
      } else {
        router.push("/");
      }
    });
  }, []);

  return (
    <Container>
      <span className="absolute top-[100px] text-sm text-gray-400">
        /Agendamentos
      </span>
      <header className="flex justify-between items-center w-full">
        <div className=" space-y-4 w-full max-w-sm">
          <h1 className="text-blueCol font-medium text-3xl sm:text-4xl">
            Olá, <span className="underline">{name}</span>
          </h1>
          <p className="text-gray-900 text-base sm:text-lg">
            Acompanhe as solicitações e altere os status aqui
          </p>
        </div>

        <LogoutButton />
      </header>

      <ScheduleList />
    </Container>
  );
}
