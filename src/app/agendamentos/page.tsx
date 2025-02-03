"use client";

import { Container } from "@/components/Container";
import { LogoutButton } from "@/components/buttons/LogoutButton";
import { SchedulePageSkeletonLoading } from "@/components/loading/SchedulePageSkeletonLoading";
import { useUserContext } from "@/context/userContext";
import { ScheduleManagement } from "./schedules-management";
import Link from "next/link";
import { Clock } from "phosphor-react";

export default function Agendamentos() {
  const { loadingData, user } = useUserContext();

  return (
    <Container>
      {loadingData || !user ? (
        <SchedulePageSkeletonLoading />
      ) : (
        <>
          <span className="absolute top-28 text-xs text-gray-400">
            /agendamentos
          </span>
          <div className="flex justify-between items-center w-full">
            <div className=" space-y-4 w-full max-w-sm">
              {user.fullName && (
                <h1 className="text-blueCol font-medium text-3xl">
                  Olá,{" "}
                  <span className="underline">
                    {`${user.fullName.split(" ")[0]} ${
                      user?.fullName.split(" ")[1]
                    }`}
                    !
                  </span>
                </h1>
              )}
              <p className="text-gray-900 text-base">
                Acompanhe seu histórico e faça um novo agendamento aqui
              </p>
            </div>

            <LogoutButton />
          </div>

          <ScheduleManagement />

          <div className="flex justify-center pt-8">
            <Link
              className="flex items-center gap-x-2 rounded-3xl bg-[#CC9935] px-10 py-2 max-w-max text-white font-medium text-sm uppercase disabled:opacity-50 disabled:pointer-events-none sm:text-base"
              href="/agendamentos/agendar"
            >
              Agendar
              <Clock size={24} />
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}
