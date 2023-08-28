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
  updateScheduleView: () => void;
}

const ScheduleViewContext = createContext<IScheduleViewContext>({
  updateScheduleView: () => {},
});

export const ScheduleViewProvider = ({ children }: { children: ReactNode }) => {
  const [ScheduleView, setScheduleView] = useState(false);

  const updateScheduleView = () => {
    setScheduleView((state) => !state);
  };

  return (
    <ScheduleViewContext.Provider value={{ updateScheduleView }}>
      {children}
    </ScheduleViewContext.Provider>
  );
};

export const useUpdateScheduleView = () => {
  return useContext(ScheduleViewContext);
};
