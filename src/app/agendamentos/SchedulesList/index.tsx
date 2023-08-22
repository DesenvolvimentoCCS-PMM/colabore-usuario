"use client";

import { ScheduleDataType } from "@/types/Schedule";
import { Filter } from "./Filter";
import { useEffect, useState } from "react";
import { SchedulePagination } from "./SchedulePagination";
import { ScheduleSkeletonLoading } from "@/components/loading/ScheduleSkeletonLoading";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";

export function ScheduleList() {
  const [data, setData] = useState<ScheduleDataType[]>([]);
  const [dataFiltered, setDataFiltered] = useState<ScheduleDataType[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const { setUpdateScheduleView, updateScheduleView } = useUpdateScheduleView();

  useEffect(() => {
    getData();
  }, [updateScheduleView]);

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "agendamento"));
    const allDocuments: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      allDocuments.push({
        ...doc.data(),
        uid: doc.id,
      });
    });

    const data = allDocuments as ScheduleDataType[];
    setData(data);
    setDataFiltered(data);
    setIsFetching(false);
  };

  return (
    <div className="w-full pt-24">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div className="flex items-center gap-x-2">
          <div className="h-2 w-2 bg-green-500"></div>
          <span>Confirmado</span>

          <div className="h-2 w-2 bg-yellow-500"></div>
          <span>Pendente</span>

          <div className="h-2 w-2 bg-red-500"></div>
          <span>Cancelados</span>
        </div>

        <Filter setFilteredData={setDataFiltered} data={data} />
      </div>

      {isFetching ? (
        <ScheduleSkeletonLoading />
      ) : (
        <SchedulePagination data={dataFiltered} />
      )}
    </div>
  );
}
