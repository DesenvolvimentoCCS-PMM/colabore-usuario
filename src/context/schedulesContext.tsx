"use client";

import { ScheduleDataType } from "@/types/Schedule";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

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

  return (
    <SchedulesContext.Provider value={{ scheduleData, setScheduleData }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useScheduleContext = () => {
  return useContext(SchedulesContext);
};
