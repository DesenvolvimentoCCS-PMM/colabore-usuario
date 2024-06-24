"use client";

import { ScheduleDataType } from "@/types/Schedule";
import { useState } from "react";
import Image from "next/image";
import NoDataImage from "@/assets/noData.svg";
import { Schedule } from "@/components/schedule";

interface SchedulePaginationProps {
  data: ScheduleDataType[];
}

export function SchedulePagination({ data }: SchedulePaginationProps) {
  const datasPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const qtdPages = Math.ceil(data.length / datasPerPage);
  const startIndex = currentPage * datasPerPage;
  const endIndex = startIndex + datasPerPage;
  const currentDatas = data.slice(startIndex, endIndex);

  return (
    <div className="mt-4 space-y-4">
      {/* Dados */}
      {data.length === 0 ? (
        <div className="flex flex-col justify-center items-center ">
          <h1 className="text-blueCol text-lg text-center font-medium pt-10">
            Ainda não há informações para exibir. 😕
          </h1>

          <Image src={NoDataImage} alt="Não há dados!" className="max-w-xs" />
        </div>
      ) : (
        currentDatas.map((datas, index) => {
          return <Schedule data={datas} key={index} />;
        })
      )}

      {/* Paginação */}
      <div className="w-full flex justify-center gap-x-4 pt-6">
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
    </div>
  );
}
