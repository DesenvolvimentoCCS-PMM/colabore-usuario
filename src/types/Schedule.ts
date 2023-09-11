export interface ScheduleDataType {
  uid: string;
  userInfo: {
    name: string;
    email: string;
  };
  created_by: string;
  conclued_at?: string;
  deleted_by?: string;
  deleted_at?: string;
  date: string;
  startHour: string;
  totTime: string;
  motive: string;
  obs: string;
  service: string;
  status: number;
  hasCoffeBreak: string;
  lgpd: boolean;
  reservedTimes: string[];
  scheduleCode: string;
}
