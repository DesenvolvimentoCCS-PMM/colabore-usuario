"use client";

import { Container } from "@/components/Container";
import { ScheduleForm } from "./scheduleForm";
import Link from "next/link";
import { useUserLoggedContext } from "@/context/userLogged";

export default function Agendar() {
  const { hasUserLogged } = useUserLoggedContext();

  return (
    <Container>
     
          <nav className="absolute top-28">
            <Link href={"/agendamentos"} className="text-gray-400  text-xs">
              agendamentos {" > "}
            </Link>

            <span className="bg-blueCol text-white p-1 rounded-lg text-xs">
              agendar
            </span>
          </nav>
          <main>
            <section className="space-y-4 max-w-md pl-2 sm:pl-8">
              <h1 className="text-2xl text-yellowCol font-medium sm:text-5xl">
                Espaço Colabore
              </h1>
              <p className="text-base font-normal sm:text-lg">
                Preencha o formulário para relaizar o seu agendamento
              </p>
            </section>

            <section className="mt-10">
              <h2 className="bg-yellowCol text-white p-3">Agendamento</h2>
              <ScheduleForm />
            </section>
          </main>
    </Container>
  );
}
