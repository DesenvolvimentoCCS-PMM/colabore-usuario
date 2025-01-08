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

interface ScheduleContextType {
  scheduleData: ScheduleDataType[];
  setScheduleData: Dispatch<SetStateAction<ScheduleDataType[]>>;
  updateScheduleView: () => void;
  getScheduleData: () => Promise<void>
}

const SchedulesContext = createContext<ScheduleContextType>(
  {} as ScheduleContextType
);

export const SchedulesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleDataType[]>([]);
  const [ScheduleView, setScheduleView] = useState(false);

  useEffect(() => {
    getData();
  }, [ScheduleView]);

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

  const updateScheduleView = () => {
    setScheduleView((state) => !state);
  };

  return (
    <SchedulesContext.Provider
      value={{ scheduleData, setScheduleData, updateScheduleView, getScheduleData: getData }}
    >
      {children}
    </SchedulesContext.Provider>
  );
};

export const useScheduleContext = () => {
  return useContext(SchedulesContext);
};
