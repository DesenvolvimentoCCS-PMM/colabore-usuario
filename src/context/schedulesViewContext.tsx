"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IScheduleViewContext {
  updateScheduleView: boolean;
  setUpdateScheduleView: Dispatch<SetStateAction<boolean>>;
}

const ScheduleViewContext = createContext<IScheduleViewContext>({
  setUpdateScheduleView: (): boolean => false,
  updateScheduleView: false,
});

export const ScheduleViewProvider = ({ children }: { children: ReactNode }) => {
  const [updateScheduleView, setUpdateScheduleView] = useState(false);

  return (
    <ScheduleViewContext.Provider
      value={{ updateScheduleView, setUpdateScheduleView }}
    >
      {children}
    </ScheduleViewContext.Provider>
  );
};

export const useUpdateScheduleView = () => {
  return useContext(ScheduleViewContext);
};
