"use client";

import { Container } from "@/components/Container";
import Image from "next/image";
import Ilustration from "@/assets/ilustration-home.jpg";
import Logo from "@/assets/logoColabore.png";
import Link from "next/link";
import { DefaultButton } from "@/components/buttons/DefaultButton";
import { Clock, Hourglass, MagnifyingGlass } from "phosphor-react";

export default function Home() {
  return (
    <Container center>
      <main className="grid grid-cols-1 place-items-center space-y-10 sm:grid-cols-2 sm:space-y-0 sm:space-x-12">
        <Image
          src={Ilustration}
          alt="Ilustração da home page"
          className="w-10/12 max-w-2xl sm:w-fullh"
        />

        <section className="flex flex-col gap-y-4">
          <Image
            src={Logo}
            alt="Espaço Colabore Mesquita"
            className="w-10/12 max-w-sm m-auto sm:w-full"
          />

          <p className="text-sm font-medium sm:text-base">
            Olá! Seja bem-vindo(a) à plataforma de agendamento do Espaço
            Colabore.{" "}
          </p>

          <p className="text-sm font-medium sm:text-base">
            Aqui, você pode agendar sua reunião de forma rápida e fácil,
            escolhendo a data e o horário que melhor se encaixam na sua rotina.
          </p>

          <p className="text-sm font-medium sm:text-base">
            Cadastre-se e aproveite!
          </p>

          <div className="flex flex-col-reverse justify-center items-center gap-4 mt-4 flex-wrap-reverse md:flex-row md:justify-end">
            <Link
              href={"/entrar"}
              className="text-sm text-blueCol sm:text-base"
            >
              Já tenho cadastro
            </Link>
            <DefaultButton href={"/cadastro"} isLink>
              <Clock size={20} color="white" />
              Cadastra-se
            </DefaultButton>
          </div>
        </section>
      </main>
    </Container>
  );
}
