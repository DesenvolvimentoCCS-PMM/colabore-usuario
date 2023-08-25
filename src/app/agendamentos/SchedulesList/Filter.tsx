"use client";

import { useRef } from "react";
import { ScheduleDataType } from "@/types/Schedule";
import { Dispatch, SetStateAction } from "react";
import { Funnel } from "phosphor-react";

interface FilterProps {
  setFilteredData: Dispatch<SetStateAction<ScheduleDataType[]>>;
  data: ScheduleDataType[];
}

export function Filter({ data, setFilteredData }: FilterProps) {
  const selectValueRef = useRef<HTMLSelectElement>(null);

  const pendingData = data.filter((item) => {
    return item.status === 0;
  });

  const concluedData = data.filter((item) => {
    return item.status === 1;
  });

  const deletedData = data.filter((item) => {
    return item.status === 2;
  });

  const handleFilter = () => {
    if (selectValueRef.current) {
      const selectValue = selectValueRef.current.value;

      switch (selectValue) {
        case "pending":
          setFilteredData(pendingData);
          break;
        case "conclued":
          setFilteredData(concluedData);
          break;
        case "deleted":
          setFilteredData(deletedData);
          break;
        default:
          setFilteredData(data);
      }
    }
  };

  return (
    <div className="flex items-center">
      <Funnel size={24} className="text-blueCol" />
      <select
        className="border rounded-3xl ml-2 px-2 py-1 border-blueCol"
        ref={selectValueRef}
        onChange={handleFilter}
      >
        <option value="all">Todos</option>
        <option value="pending">Pendentes</option>
        <option value="conclued">Confirmados</option>
        <option value="deleted">Cancelados</option>
      </select>
    </div>
  );
}
