"use client";

import { useState } from "react";
import { currentDate, dateToDDMMAA, dateToText } from "@/utils/dateFunctions";
import {
  CaretDown,
  EnvelopeSimple,
  WhatsappLogo,
  Checks,
  CaretUp,
  XCircle,
  Note,
} from "phosphor-react";
import { ScheduleDataType } from "@/types/Schedule";
import { useUserDataContext } from "@/context/userContext";
import { db } from "@/services/firebase";
import { notifyError, notifySuccess } from "@/components/Toast";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";
import { doc, updateDoc } from "firebase/firestore";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ScheduleVoucher } from "@/components/Voucher";

interface ScheduleDataProps {
  data: ScheduleDataType;
}

export function Schedule({ data }: ScheduleDataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useUserDataContext();
  const { updateScheduleView } = useUpdateScheduleView();

  const cancelSchedule = async () => {
    const cDate = new Date().toLocaleDateString();

    const date = new Date(data.date);
    date.setDate(date.getDate() + 1);
    const inputDate = date.toLocaleDateString();

    if (cDate === inputDate) {
      notifyError(
        "Lamentamos informar que não é possível cancelar o agendamento hoje, pois já é o dia do agendamento. Caso haja necessidade de alteração, por favor, entre em contato conosco para que possamos ajudá-lo(a) "
      );
    } else {
      if (confirm("Confirmar cancelamento do agendamento? ")) {
        try {
          const docRef = doc(db, "agendamento", data.uid);

          await updateDoc(docRef, {
            status: 2,
            deleted_at: currentDate(),
            deleted_by: userData.fullName,
          });
          updateScheduleView();
          notifySuccess("Agendamento cancelado com sucesso!");
        } catch (error) {
          notifyError(
            "Não foi possível cancelar o agendamento, tente novamente mais tarde!"
          );
        }
      }
    }
    //Notificar a equipe ?
  };

  const downloadVoucher = () => {};

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
    scheduledTextColor: data.status === 0 && "text-blueCol",
    completedTextColor: data.status === 1 && "text-green-600",
    deletedTextColor: data.status === 2 && "text-red-500",
  };

  const scheduleConfigs = {
    scheduled: data.status === 0,
    deleted: data.status === 2,
    completed: data.status === 1,
    hasAdmin: userData.fullName.includes("Admin"),
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
                    scheduleCode={data.uid.slice(0, 6)}
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

              {/* <PDFViewer>
                <ScheduleVoucher
                  date={dateToDDMMAA(data.date)}
                  name={data.userInfo.name}
                  scheduleCode={123}
                  service={formatations.resumeService}
                  time={data.startHour}
                />
              </PDFViewer> */}

              {scheduleConfigs.scheduled && (
                <button
                  className="px-3 py-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 max-w-xs transition-all group bg-red-500 hover:scale-95 hover:brightness-95 sm:w-max "
                  onClick={cancelSchedule}
                >
                  <XCircle size={26} className="text-white" />

                  <span className="w-0 m-[-2px] overflow-hidden text-white transition-all duration-300 group-hover:w-20 group-hover:m-auto">
                    Cancelar
                  </span>
                </button>
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
                  className="text-white bg-red-300 p-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 w-full max-w-xs  sm:w-max"
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
      <div
        className={`border shadow-sm relative -top-1 z-10 w-full overflow-auto transition-all duration-300 ${
          isOpen ? "lg:h-64 p-3 scale-100" : "h-0 p-0 scale-0"
        }`}
      >
        <h2 className="text-lg font-medium underline my-2">
          Detalhes da solicitação
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {/* Col 1 */}
          <div className="flex flex-col">
            <div className="inline-flex gap-x-2 my-1 w-full">
              <h3 className="text-sm font-semibold">Motivo da solicitação:</h3>
              <p className="text-sm">{data.motive}</p>
            </div>

            <div className="inline-flex gap-x-2 my-1 w-full">
              <h3 className="text-sm font-semibold">Observação:</h3>
              <p className="text-sm">{data.obs}</p>
            </div>

            <div className="inline-flex gap-x-2 my-1 items-center">
              <h3 className="text-sm font-semibold">Status:</h3>
              <span
                className={`text-sm p-1 rounded-3xl font-semibold ${styleVariants.completedTextColor} ${styleVariants.deletedTextColor} ${styleVariants.scheduledTextColor}`}
              >
                {scheduleConfigs.scheduled && "Agendado"}
                {scheduleConfigs.completed && "Concluído"}
                {scheduleConfigs.deleted && "Cancelado"}
              </span>
            </div>

            {/* Data de agendamentos concluidos */}
            {data.conclued_at && !scheduleConfigs.deleted && (
              <div className="inline-flex gap-x-2 my-1 items-center">
                <h3 className="text-sm font-semibold">Concluído em:</h3>
                <span className={`text-sm text-green-500 font-semibold p-1 `}>
                  {dateToDDMMAA(data.conclued_at)}
                </span>
              </div>
            )}

            {/* Data de agendamentos cancelados */}
            {data.deleted_at && !scheduleConfigs.completed && (
              <div className="inline-flex gap-x-2 my-1 items-center">
                <h3 className="text-sm font-semibold">Excluído em:</h3>
                <span className={`text-sm text-red-500 font-semibold p-1 `}>
                  {dateToDDMMAA(data.deleted_at)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-x-2 my-1">
              <h3 className="text-sm font-semibold">
                Agendado para:
                <span className="text-sm font-normal ml-2">
                  {dateToDDMMAA(data.date)}
                </span>
              </h3>

              <h3 className="text-sm font-semibold">
                Horário:
                <span className="text-sm font-normal ml-2">
                  {data.startHour} às {formatations.endTime}
                </span>
              </h3>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">Serviço:</h3>
              <span className="text-sm">{data.service}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
