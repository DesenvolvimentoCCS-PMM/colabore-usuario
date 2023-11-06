"use client";

import { Container } from "@/components/Container";
import { LogoutButton } from "@/components/buttons/LogoutButton";
import { SchedulePageSkeletonLoading } from "@/components/loading/SchedulePageSkeletonLoading";
import { useUserDataContext } from "@/context/userContext";
import { ScheduleList } from "./SchedulesList";

export default function Agendamentos() {
  const { loadingData, userData } = useUserDataContext();

  const formations = {
    name: `${userData.fullName.split(" ")[0]} ${
      userData.fullName.split(" ")[1]
    }`,
  };

  return (
    <Container>
      {loadingData ? (
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
