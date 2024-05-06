"use client";

import { useScheduleContext } from "@/context/schedulesContext";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";
import { auth } from "@/services/firebase";
import { ScheduleDataType } from "@/types/Schedule";
import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { SchedulePagination } from "./SchedulePagination";
import { EmailNotVerified } from "@/components/EmailNotVerified";
import { useUserContext } from "@/context/userContext";
import { useChangeRealtime } from "@/hooks/useChangeRealtime";

export function ScheduleList() {
  const { scheduleData } = useScheduleContext();
  const [data, setData] = useState<ScheduleDataType[]>([]);
  const [dataFiltered, setDataFiltered] = useState<ScheduleDataType[]>([]);
  const { updateScheduleView } = useUpdateScheduleView();
  const { user } = useUserContext();

  const userAuth = auth.currentUser;

  useEffect(() => {
    getUserData();
  }, [updateScheduleView]);

  const getUserData = () => {
    const dataToDisplay = scheduleData.filter((doc) => {
      if (user) {
        return doc.created_by === user.uid;
      }
    });

    setDataFiltered(dataToDisplay);
    setData(dataToDisplay);
  };

  if (userAuth && !userAuth.emailVerified) {
    return <EmailNotVerified userAuth={userAuth} />;
  } else {
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

          <SchedulePagination data={dataFiltered} />
        </div>
      </div>
    );
  }
}
