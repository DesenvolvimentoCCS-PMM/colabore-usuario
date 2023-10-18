"use client";

import { db } from "@/services/firebase";
import { ScheduleDataType } from "@/types/Schedule";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUpdateScheduleView } from "./schedulesViewContext";

interface ScheduleContextType {
  scheduleData: ScheduleDataType[];
  setScheduleData: Dispatch<SetStateAction<ScheduleDataType[]>>;
}

const SchedulesContext = createContext<ScheduleContextType>({
  scheduleData: [],
  setScheduleData: () => {},
});

export const SchedulesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleDataType[]>([]);
  const { updateScheduleView } = useUpdateScheduleView();

  useEffect(() => {
    getData();
  }, [updateScheduleView]);

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
    setScheduleData(data);
  };

  return (
    <SchedulesContext.Provider value={{ scheduleData, setScheduleData }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useScheduleContext = () => {
  return useContext(SchedulesContext);
};
