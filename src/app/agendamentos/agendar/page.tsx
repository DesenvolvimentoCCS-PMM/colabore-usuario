"use client";

import { Container } from "@/components/Container";
import { useUserLoggedContext } from "@/context/userLogged";
import axios from "axios";
import Link from "next/link";
import { ScheduleForm } from "./scheduleForm";

export default function Agendar() {
  const { hasUserLogged } = useUserLoggedContext();

  const enviarEmail = async () => {
    const data = {
      destinatario: "luanhenriquemiguelalves@gmail.com",
      assunto: "Assunto do E-mail",
      mensagem: "Corpo do E-mail",
    };

    try {
      const response = await axios.post(
        "https://us-central1-colaboredatabase.cloudfunctions.net/sendEmail",
        data
      );
      console.log("Resposta da função Firebase:", response.data);
      // Faça algo com a resposta, se necessário
    } catch (error) {
      console.error("Erro ao chamar a função Firebase:", error);
      // Trate o erro, se necessário
    }
  };

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
            Preencha o formulário para realizar o seu agendamento
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
