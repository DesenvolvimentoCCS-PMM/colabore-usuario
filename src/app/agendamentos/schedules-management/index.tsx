"use client";

import { useScheduleContext } from "@/context/schedulesContext";
import { ScheduleDataType } from "@/types/Schedule";
import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { ScheduleList } from "./List";
import { useUserContext } from "@/context/userContext";

export function ScheduleManagement() {
  const { scheduleData } = useScheduleContext();
  const [data, setData] = useState<ScheduleDataType[]>([]);
  const [dataFiltered, setDataFiltered] = useState<ScheduleDataType[]>([]);
  const { user } = useUserContext();


  useEffect(() => {
    getUserData();
  }, [scheduleData]);

  const getUserData = () => {
    const dataToDisplay = scheduleData.filter((doc) => {
      if (user) {
        return doc.created_by === user.uid;
      }
    });

    setDataFiltered(dataToDisplay);
    setData(dataToDisplay);
  };

    return (
      <div className="w-full pt-24">
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div className="flex items-center gap-x-2">
              <div className="h-2 w-2 bg-blueCol"></div>
              <span>Agendado</span>

              <div className="h-2 w-2 bg-green-600"></div>
              <span>Concluídos</span>

              <div className="h-2 w-2 bg-red-500"></div>
              <span>Cancelados</span>
            </div>

            <Filter setFilteredData={setDataFiltered} data={data} />
          </div>

          <ScheduleList data={dataFiltered} />
        </div>
      </div>
    );
}
