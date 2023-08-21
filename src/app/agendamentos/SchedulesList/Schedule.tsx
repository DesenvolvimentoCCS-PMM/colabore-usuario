"use client";

import { useState } from "react";
import { currentDate, dateToDDMMAA, dateToText } from "@/utils/dateFunctions";
import {
  CaretDown,
  EnvelopeSimple,
  WhatsappLogo,
  Check,
  Checks,
  CaretUp,
  XCircle,
} from "phosphor-react";
import { ScheduleDataType } from "@/types/Schedule";
import { capitalize } from "@/utils/capitalize";
import { useUserContext } from "@/context/userContext";
import { db } from "@/services/firebase";
import { notifyError, notifySuccess } from "@/components/Toast";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";
import { doc, updateDoc } from "firebase/firestore";
import { Reschedule } from "@/components/modals/EditSchedule";
import { hiddenCpf } from "@/utils/hiddenCPF";

interface ScheduleDataProps {
  data: ScheduleDataType;
}

export function Schedule({ data }: ScheduleDataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { username } = useUserContext();

  const { setUpdateScheduleView } = useUpdateScheduleView();

  const concludeSchedule = async () => {
    if (confirm("Confirmar conclusão do agendamento?")) {
      try {
        const docRef = doc(db, "agendamento", data.uid);

        await updateDoc(docRef, {
          status: 1,
          concluidoEm: currentDate(),
        });
        setUpdateScheduleView((state) => !state);
        notifySuccess("Agendamento concluído com sucesso!");
      } catch (error) {
        notifyError(
          "Não foi possível concluir seu agendamento, tente novamente mais tarde!"
        );
      }
    }
  };

  const deleteSchedule = async () => {
    if (confirm("Confirmar exclusão do agendamento? ")) {
      try {
        const docRef = doc(db, "agendamento", data.uid);

        await updateDoc(docRef, {
          status: 2,
          excluidoEm: currentDate(),
          excluidPor: username,
        });
        setUpdateScheduleView((state) => !state);
        notifySuccess("Agendamento excluído com sucesso!");
      } catch (error) {
        notifyError(
          "Não foi possível excluir o agendamento, tente novamente mais tarde!"
        );
      }
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const formatations = {
    date: dateToText(data.data),
    whatsapp: data.whatsapp
      .replace(/\(|\)|\-/g, "")
      .split(" ")
      .join(""),
  };

  const styleVariants = {
    pendingColor: data.status === 0 && "bg-yellow-500 text-black border-black",
    completedColor: data.status === 1 && "bg-green-500 text-white",
    deletedColor: data.status === 2 && "bg-red-500 text-white",
    pendingTextColor: data.status === 0 && "text-yellow-500",
    completedTextColor: data.status === 1 && "text-green-500",
    deletedTextColor: data.status === 2 && "text-red-500",
  };

  const scheduleConfigs = {
    pending: data.status === 0,
    deleted: data.status === 2,
    completed: data.status === 1,
    hasAdmin: username.includes("Admin"),
  };

  const whatsappLink = `https://api.whatsapp.com/send?phone=${formatations.whatsapp}`;

  //Criar div para desbugar abertura do botão de cancelar

  return (
    // Container principal

    <div className="w-full max-w-7xl z-20">
      {/* Container de interação*/}
      <div className="shadow-md rounded-lg bg-slate-50 z-20 relative transition-all hover:bg-slate-100">
        <div className="flex items-center lg:justify-between flex-wrap flex-col md:flex-row">
          {/* Dados da reunião */}
          <div
            className={`flex flex-col items-center justify-center gap-y-2 ${styleVariants.pendingColor} ${styleVariants.completedColor} ${styleVariants.deletedColor} h-28 w-full lg:w-40`}
          >
            <p className="text-lg font-medium">{formatations.date}</p>
            <p
              className={`text-base rounded-sm px-3 border  ${
                scheduleConfigs.pending ? "border-black" : "border-white"
              }`}
            >
              {data.horario}
            </p>
            <p className="tracking-wider text-base uppercase">
              {data.tipoServico}
            </p>
          </div>

          <div className="flex flex-wrap w-full lg:w-4/5 ">
            {/* Nome e email do usuario */}
            <div className="w-full p-6 md:w-2/5">
              <p className="text-base font-semibold">{data.nome}</p>
              <p className="flex items-center gap-x-1 text-sm text-left">
                <EnvelopeSimple size={20} />
                {data.email}
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center justify-center flex-wrap w-full gap-4 p-4  sm:justify-start md:w-3/5">
              <a
                href={whatsappLink}
                target="_blank"
                className="flex items-center justify-center gap-x-1 bg-green-500 rounded-3xl text-white text-sm p-3 w-full max-w-xs transition-all hover:scale-95 hover:brightness-95 sm:w-max"
              >
                <WhatsappLogo size={20} />
                Entrar em contato
              </a>
              {scheduleConfigs.pending && (
                <>
                  {" "}
                  <button
                    className="text-white bg-green-500 px-3 py-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 max-w-xs transition-all hover:scale-95 hover:brightness-95  sm:w-max"
                    onClick={concludeSchedule}
                  >
                    <Check size={20} />
                    Concluir
                  </button>
                  <Reschedule uid={data.uid} username={username} />
                  <button
                    className="px-3 py-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 max-w-xs transition-all group bg-red-500 hover:scale-95 hover:brightness-95 sm:w-max "
                    onClick={deleteSchedule}
                  >
                    <XCircle size={20} className="text-white" />
                    <span className="w-0 m-[-2px] overflow-hidden text-white transition-all duration-300 group-hover:w-20 group-hover:m-auto">
                      Cancelar
                    </span>
                  </button>
                </>
              )}
              {scheduleConfigs.completed && (
                <button
                  className="text-white bg-gray-500 p-2 rounded-3xl text-sm flex items-center justify-center gap-x-1 w-full max-w-xs sm:w-max"
                  disabled
                >
                  <Checks size={20} />
                  Concluído
                </button>
              )}
              {scheduleConfigs.deleted && (
                <button
                  className="text-white bg-gray-500 p-2 rounded-3xl text-sm flex items-center justify-center gap-x-1 w-full max-w-xs  sm:w-max"
                  disabled
                >
                  <XCircle size={20} />
                  Cancelado
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Col 1 */}
          <div className="flex flex-col">
            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">Nome:</h3>
              <span className="text-sm">{data.nome}</span>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">Whatsapp:</h3>
              <span className="text-sm">{data.whatsapp}</span>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">E-mail:</h3>
              <span className="text-sm">{data.email}</span>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">CPF:</h3>
              <span className="text-sm">{hiddenCpf(data.cpf)}</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col">
            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">CEP:</h3>
              <span className="text-sm">{data.endereco.cep}</span>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">Rua:</h3>
              <span className="text-sm">{data.endereco.rua}</span>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">Bairro:</h3>
              <span className="text-sm">{data.endereco.bairro}</span>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">Cidade:</h3>
              <span className="text-sm">
                {capitalize(data.endereco.cidade)}
              </span>
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col">
            <div className="inline-flex gap-x-2 my-1 max-w-xs">
              <h3 className="text-sm font-semibold">Motivo da solicitação:</h3>
              <span className="text-sm">{data.motivo}</span>
            </div>

            <div className="inline-flex gap-x-2 my-1 items-center">
              <h3 className="text-sm font-semibold">Status:</h3>
              <span
                className={`text-sm p-1 rounded-3xl font-semibold ${styleVariants.completedTextColor} ${styleVariants.deletedTextColor} ${styleVariants.pendingTextColor}`}
              >
                {scheduleConfigs.pending && "Pendente"}
                {scheduleConfigs.completed && "Concluído"}
                {scheduleConfigs.deleted && "Excluído"}
              </span>
            </div>

            {/* Data de agendamentos concluidos */}
            {data.concluidoEm && !scheduleConfigs.deleted && (
              <div className="inline-flex gap-x-2 my-1 items-center">
                <h3 className="text-sm font-semibold">Concluído em:</h3>
                <span className={`text-sm text-green-500 font-semibold p-1 `}>
                  {dateToDDMMAA(data.concluidoEm)}
                </span>
              </div>
            )}

            {/* Data de agendamentos cancelados */}
            {data.excluidoEm && !scheduleConfigs.completed && (
              <div className="inline-flex gap-x-2 my-1 items-center">
                <h3 className="text-sm font-semibold">Excluído em:</h3>
                <span className={`text-sm text-red-500 font-semibold p-1 `}>
                  {dateToDDMMAA(data.excluidoEm)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-x-2 my-1">
              <h3 className="text-sm font-semibold">
                Agendado para:
                <span className="text-sm font-normal ml-2">
                  {dateToDDMMAA(data.data)}
                </span>
              </h3>

              <h3 className="text-sm font-semibold">
                Horário:
                <span className="text-sm font-normal ml-2">{data.horario}</span>
              </h3>
            </div>

            <div className="inline-flex gap-x-2 my-1">
              <h3 className="text-sm font-semibold">Serviço:</h3>
              <span className="text-sm">{data.tipoServico}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
