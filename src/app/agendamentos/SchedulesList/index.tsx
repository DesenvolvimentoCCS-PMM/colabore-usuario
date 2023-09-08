"use client";

import { ScheduleDataType } from "@/types/Schedule";
import { Filter } from "./Filter";
import { useEffect, useState } from "react";
import { SchedulePagination } from "./SchedulePagination";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";
import { useScheduleContext } from "@/context/schedulesContext";

export function ScheduleList() {
  const [data, setData] = useState<ScheduleDataType[]>([]);
  const [dataFiltered, setDataFiltered] = useState<ScheduleDataType[]>([]);

  const { updateScheduleView } = useUpdateScheduleView();
  const { setScheduleData } = useScheduleContext();
  useEffect(() => {
    getData();
  }, [updateScheduleView]);

  const user = auth.currentUser;

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "schedules"));
    const allDocuments: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      allDocuments.push({
        ...doc.data(),
        uid: doc.id,
      });
    });

    const data = allDocuments as ScheduleDataType[];
    const dataToDisplay = data.filter((doc) => {
      if (user) {
        return doc.created_by === user?.uid;
      }
    });

    setScheduleData(data);
    setData(dataToDisplay);
    setDataFiltered(dataToDisplay);
  };

  return (
    <div className="w-full pt-24">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div className="flex items-center gap-x-2">
          <div className="h-2 w-2 bg-green-500"></div>
          <span>Agendado</span>

          <div className="h-2 w-2 bg-gray-500"></div>
          <span>Concluídos</span>

          <div className="h-2 w-2 bg-red-500"></div>
          <span>Cancelados</span>
        </div>

        <Filter setFilteredData={setDataFiltered} data={data} />
      </div>

      <SchedulePagination data={dataFiltered} />
    </div>
  );
}
