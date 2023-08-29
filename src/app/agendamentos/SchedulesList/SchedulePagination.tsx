"use client";

import { Button } from "@/components/buttons/DefaultButton";
import { Schedule } from "./Schedule";
import { ScheduleDataType } from "@/types/Schedule";
import { useState } from "react";
import { Clock } from "phosphor-react";

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
      <h1 className="text-blueCol text-lg text-center font-medium pt-20">
        Não há dados a serem exibidos ainda 😕
      </h1>
    );
  };

  const showDatas = () => {
    return currentDatas.map((datas, index) => {
      return <Schedule data={datas} key={index} />;
    });
  };

  return (
    <div className="mt-4 space-y-8">
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
      <div className="flex justify-center pt-10">
        <Button isLink href="/agendamentos/agendar">
          Agendar
          <Clock size={24} />
        </Button>
      </div>
    </div>
  );
}
