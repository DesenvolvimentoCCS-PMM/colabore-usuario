"use client";

import { Button } from "@/components/buttons/DefaultButton";
import { Schedule } from "./Schedule";
import { ScheduleDataType } from "@/types/Schedule";
import { useState } from "react";
import { Clock } from "phosphor-react";
import Image from "next/image";

import NoDataImage from "@/assets/noData.svg";
import Link from "next/link";

interface SchedulePaginationProps {
  data: ScheduleDataType[];
}

export function SchedulePagination({ data }: SchedulePaginationProps) {
  const [datasPerPage, setDatasPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const qtdPages = Math.ceil(data.length / datasPerPage);
  const startIndex = currentPage * datasPerPage;
  const endIndex = startIndex + datasPerPage;
  const currentDatas = data.slice(startIndex, endIndex);

  const notShowData = () => {
    return (
      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-blueCol text-lg text-center font-medium pt-10">
          Ainda não há informações para exibir. 😕
        </h1>

        <Image src={NoDataImage} alt="Não há dados!" className="max-w-sm" />
      </div>
    );
  };

  const showDatas = () => {
    return currentDatas.map((datas, index) => {
      return <Schedule data={datas} key={index} />;
    });
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Dados */}

      {data.length === 0 ? notShowData() : showDatas()}

      {/* Navegação */}
      <div className="w-full flex justify-center gap-x-4">
        {Array.from(Array(qtdPages), (_, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`text-xl rounded-3xl border-2 w-10 h-10 hover:border-blueCol transition-all ${
                currentPage === index && "bg-blueCol text-white border-blueCol"
              }`}
              onClick={() => setCurrentPage(Number(index))}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Botão agendar */}
      <div className="flex justify-center">
        <Link
          className="flex items-center gap-x-2 rounded-3xl bg-[#CC9935] px-10 py-2 max-w-max text-white font-medium text-sm uppercase disabled:opacity-50 disabled:pointer-events-none sm:text-base"
          href="/agendamentos/agendar"
        >
          Agendar
          <Clock size={24} />
        </Link>
      </div>
    </div>
  );
}
