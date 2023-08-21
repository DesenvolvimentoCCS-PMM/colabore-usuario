"use client";

import Ilustration from "@/assets/ilustration-about.jpg";
import { Container } from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CaretDoubleLeft, CaretDoubleRight } from "phosphor-react";
import { useState } from "react";

export default function ComoFunciona() {
  const [currentContent, setCurrentContent] = useState(0);

  const contents = [
    {
      id: 0,
      title: "Titulo 1",
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati quam aliquid, iure nemo reprehenderit aut accusamus temporibus. Nam eaque iure, odit ea neque amet minus ex repudiandae quam, quasi debitis?",
    },
    {
      id: 1,
      title: "Titulo 2",
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati quam aliquid, iure nemo reprehenderit aut accusamus temporibus. Nam eaque iure, odit ea neque amet minus ex repudiandae quam, quasi debitis?",
    },
    {
      id: 2,
      title: "Titulo 3",
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati quam aliquid, iure nemo reprehenderit aut accusamus temporibus. Nam eaque iure, odit ea neque amet minus ex repudiandae quam, quasi debitis?",
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
      <main className="grid grid-cols-1 m-auto place-items-center sm:grid-cols-2  min-h-full">
        <Image
          src={Ilustration}
          alt="Ilustração de pessoas vendo um calendário"
          className="w-11/12 max-w-lg 2xl:max-w-2xl"
        />
        <div className="flex items-center gap-x-4">
          <button
            onClick={prevContext}
            className={`${currentContent == 0 && "hidden"}`}
          >
            <CaretDoubleLeft size={32} />
          </button>

          <div className="space-y-4 text-center ">
            <h1 className="font-medium text-4xl">
              {contents[currentContent].title}
            </h1>
            <p className="text-xl">{contents[currentContent].text}</p>
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
