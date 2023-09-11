"use client";

import Ilustration from "@/assets/ilustration-about.jpg";
import { Container } from "@/components/Container";
import Image from "next/image";
import { CaretDoubleLeft, CaretDoubleRight } from "phosphor-react";
import { useState } from "react";

export default function ComoFunciona() {
  const [currentContent, setCurrentContent] = useState(0);

  const contents = [
    {
      id: 0,
      title: "Coworking",
      text: "O Espaço Colabore é um local com modelo de trabalho integrado, onde funcionários de empresas e freelancers compartilham o mesmo ambiente para realizar suas atividades. Além disso, o espaço é direcionado aos estudantes e às pessoas que desejam solicitar algum serviço público, já que o equipamento conta com conexão à rede de internet.",
    },
    {
      id: 1,
      title: "Tecnologia",
      text: "Todos os computadores do Espaço Colabore estão conectados à rede Wi-fi, possibilitando a realização de atividades empresariais e pesquisas na internet. Além disso, o local possui duas salas, uma de reunião e outra de palestras. Para agendar o espaço de reuniões, o usuário poderá acessar o site do Espaço Colabore. Já o ambiente de palestras é equipado com televisão e aparelho de som, para exibir conteúdos informativos. Vale lembrar que todos os ambientes são climatizados.",
    },
    {
      id: 2,
      title: "Praticidade",
      text: "Ao chegar ao local, o mesquitense consegue facilmente se conectar à internet, precisando apenas realizar o cadastro no sistema. O ambiente também foi preparado especialmente para otimizar a rotina dos usuários, com várias tomadas e assentos. Através do site do Espaço Colabore, também é possível realizar o agendamento das salas para garantir e agilizar processos técnicos de eventos.",
    },
  ];

  const nextContent = () => {
    if (currentContent < 2) {
      setCurrentContent((state) => state + 1);
    }
  };

  const prevContext = () => {
    if (currentContent > 0) {
      setCurrentContent((state) => state - 1);
    }
  };

  return (
    <Container center>
      <span className="absolute top-24 left-10 text-sm text-gray-400 pointer-events-none">
        /Como Funciona
      </span>
      <main className="grid grid-cols-1 m-auto place-items-center md:grid-cols-2  min-h-full">
        <Image
          src={Ilustration}
          alt="Ilustração de pessoas vendo um calendário"
          className="w-11/12 max-w-md 2xl:max-w-2xl"
        />
        <div className="flex items-center gap-x-4">
          <button
            onClick={prevContext}
            className={`${currentContent == 0 && "hidden"}`}
          >
            <CaretDoubleLeft size={32} />
          </button>

          <div className="space-y-4 text-center pt-10">
            <h1 className="font-medium text-xl md:text-2xl">
              {contents[currentContent].title}
            </h1>
            <p className="text-md">{contents[currentContent].text}</p>
          </div>

          <button
            onClick={nextContent}
            className={`${currentContent == 2 && "hidden"}`}
          >
            <CaretDoubleRight size={32} />
          </button>
        </div>
      </main>
    </Container>
  );
}
