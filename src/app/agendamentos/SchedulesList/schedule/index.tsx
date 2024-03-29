"use client";

import { notifyError, notifySuccess } from "@/components/Toast";
import { ScheduleVoucher } from "@/components/Voucher";
import { CancelSchedule } from "@/app/agendamentos/SchedulesList/schedule/actions/CancelSchedule";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";
import { useUserContext } from "@/context/userContext";
import { db } from "@/services/firebase";
import { ScheduleDataType } from "@/types/Schedule";
import { currentDate, dateToDDMMAA, dateToText } from "@/utils/dateFunctions";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { doc, updateDoc } from "firebase/firestore";
import {
  CaretDown,
  CaretUp,
  Checks,
  EnvelopeSimple,
  Note,
  WhatsappLogo,
  XCircle,
} from "phosphor-react";
import { useState } from "react";
import { ScheduleDetails } from "./scheduleDetails";

interface ScheduleDataProps {
  data: ScheduleDataType;
}

export function Schedule({ data }: ScheduleDataProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const formatations = {
    date: dateToText(data.date),
    whatsapp: "5521969718153",
    resumeService: data.service.split("(")[0],
    endTime: data.reservedTimes[data.reservedTimes.length - 1],
  };

  const styleVariants = {
    scheduled: data.status === 0 && "bg-blueCol text-white",
    completedColor:
      data.status === 1 && "bg-green-600 text-gray-300 border-black",
    deletedColor: data.status === 2 && "bg-red-500 text-white",
  };

  const scheduleConfigs = {
    scheduled: data.status === 0,
    deleted: data.status === 2,
    completed: data.status === 1,
  };

  const whatsappLink = `https://api.whatsapp.com/send?phone=${formatations.whatsapp}`;

  return (
    // Container principal

    <div className="w-full max-w-7xl z-20">
      {/* Container de interação*/}
      <div className="shadow-md rounded-lg bg-slate-50 z-20 relative transition-all hover:bg-slate-100">
        <div className="flex items-center lg:justify-between flex-wrap relative flex-col md:flex-row">
          {/* Dados da reunião */}
          <div
            className={`flex flex-col items-center justify-center gap-y-2 ${styleVariants.scheduled} ${styleVariants.completedColor} ${styleVariants.deletedColor} h-28 w-full lg:w-40`}
          >
            <p className="text-lg font-medium">{formatations.date}</p>
            <p
              className={`text-base rounded-sm px-3 border  ${
                scheduleConfigs.scheduled ? "border-black" : "border-white"
              }`}
            >
              {data.startHour}
            </p>
            <p className="tracking-wider text-base uppercase">
              {formatations.resumeService}
            </p>
          </div>

          <div className="flex flex-wrap w-full lg:w-4/5 ">
            {/* Nome e email do usuario */}
            <div className="w-full p-6 md:w-2/5">
              <p className="text-base font-semibold">{data.userInfo.name}</p>
              <p className="flex items-center gap-x-1 text-sm text-left">
                <EnvelopeSimple size={20} />
                {data.userInfo.email}
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center justify-center flex-wrap w-full gap-4 p-4  sm:justify-start md:w-3/5">
              <a
                href={whatsappLink}
                className="px-3 py-3 rounded-3xl text-sm flex items-center h-12 justify-center gap-x-1 max-w-xs  group bg-green-600 hover:scale-95 hover:brightness-95 sm:w-max"
                target="_blank"
              >
                <WhatsappLogo size={26} color="white" />

                <span className="w-0 m-[-2px] opacity-0 overflow-hidden text-white transition-all duration-300 group-hover:w-32 group-hover:m-auto group-hover:opacity-100">
                  Entrar em contato
                </span>
              </a>

              <PDFDownloadLink
                className="px-3 py-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 max-w-xs transition-all group bg-yellow-600 hover:scale-95 hover:brightness-95 sm:w-max "
                document={
                  <ScheduleVoucher
                    date={dateToDDMMAA(data.date)}
                    name={data.userInfo.name}
                    scheduleCode={data.scheduleCode}
                    service={formatations.resumeService}
                    time={data.startHour}
                  />
                }
              >
                <Note size={26} className="text-white" />
                <span className="w-0 m-[-2px] overflow-hidden text-white transition-all duration-300 group-hover:w-28 group-hover:m-auto">
                  Comprovante
                </span>
              </PDFDownloadLink>

              {scheduleConfigs.scheduled && (
                <CancelSchedule data={data} date={data.date} />
              )}
              {scheduleConfigs.completed && (
                <button
                  className="text-white bg-gray-500 p-2 rounded-3xl text-sm flex items-center justify-center gap-x-1 w-full max-w-xs sm:w-max"
                  disabled
                >
                  <Checks size={26} />
                  Concluído
                </button>
              )}
              {scheduleConfigs.deleted && (
                <button
                  className="text-white bg-red-300 p-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 max-w-xs w-max"
                  disabled
                >
                  <XCircle size={26} />
                </button>
              )}
            </div>
          </div>

          {/* Botão de abrir e fechar os detalhes */}
          <button
            className="h-28 absolute right-4 top-24 lg:relative md:top-0"
            aria-label={isOpen ? "Fechar detalhes" : "Abrir detalhes"}
            onClick={toggleModal}
          >
            {isOpen ? (
              <CaretUp size={24} weight="bold" />
            ) : (
              <CaretDown size={24} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {/* Container dos detalhes */}
      <ScheduleDetails data={data} isOpen={isOpen} />
    </div>
  );
}
