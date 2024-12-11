"use client";

import { currentDataToDatabase } from "@/utils/dateFunctions";
import { Dialog, Transition } from "@headlessui/react";
import { doc, updateDoc } from "firebase/firestore";
import { Fragment, useState } from "react";
import { db } from "@/services/firebase";
import { XCircle } from "phosphor-react";
import { ScheduleDataType } from "@/types/Schedule";
import { useUserContext } from "@/context/userContext";
import { useScheduleContext } from "@/context/schedulesContext";
import { notifyError, notifySuccess } from "@/components/Toast";

interface cancelScheduleProps {
  data: ScheduleDataType;
  date: string;
}

const motives = [
  {
    title: "Imprevisto pessoal",
    description:
      "Doença, Emergência familiar, Outros compromissos não adiáveis, etc...",
  },
  {
    title: "Não necessidade do serviço agendado",
    description: "Mudança de circunstâncias, Serviço não mais necessário",
  },
  {
    title: "Conflitos de agenda",
    description: "Outro compromisso inesperado, alteração de planos, etc...",
  },
  {
    title: "Problemas de transporte",
    description:
      "Avaria de veículo, Interrupções no transporte público, etc...",
  },
  {
    title: "Condições meteorológicas",
    description: "Condições climáticas ruins, alertas meteorológicos",
  },
  {
    title: "Problemas de saúde",
    description: "Condições médicas repentinas, Sintomas de doença",
  },
  {
    title: "Desistência ou mudança de planos",
    description: "Decisões pessoais ou mudanças de última hora",
  },
];

export function CancelSchedule({ data, date }: cancelScheduleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [motiveSelected, setMotiveSelect] = useState("");
  const { user } = useUserContext();
  const { updateScheduleView } = useScheduleContext();

  const cancelSchedule = async () => {
    if (motiveSelected) {
      if (confirm("Confirmar cancelamento do agendamento? ")) {
        try {
          await updateDoc(doc(db, "schedules", data.uid), {
            status: 2,
            deleted_at: currentDataToDatabase(),
            deleted_by: user.fullName,
            cancelMotive: motiveSelected,
          });
          updateScheduleView();
          notifySuccess("Agendamento cancelado com sucesso!");
          closeModal();
        } catch (error) {
          console.log(error);
          notifyError(
            "Não foi possível cancelar o agendamento, tente novamente mais tarde!"
          );
        }
      }
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setMotiveSelect("");
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        className="px-3 py-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 max-w-xs transition-all group bg-red-500 hover:scale-95 hover:brightness-95 sm:w-max "
        onClick={openModal}
      >
        <XCircle size={26} className="text-white" />

        <span className="w-0 m-[-2px] overflow-hidden text-white transition-all duration-300 group-hover:w-20 group-hover:m-auto">
          Cancelar
        </span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-600"
                  >
                    Motivo do cancelamento
                  </Dialog.Title>
                  <div>
                    <p className="text-sm my-2">
                      Marque a opção pela qual você deseja cancelar seu
                      agendamento.
                    </p>

                    <form className="my-4">
                      {motives.map(({ title, description }) => {
                        return (
                          <fieldset
                            className={`${
                              motiveSelected === title &&
                              "bg-neutral-100 rounded-md"
                            } p-2 my-2 border-b`}
                            key={title}
                          >
                            <div
                              className={`flex justify-between items-center `}
                            >
                              <label htmlFor={title} className="flex flex-col">
                                <span className="text-base font-medium ">
                                  {title}
                                </span>
                                <span className="text-sm text-gray-400 font-light">
                                  {description}
                                </span>
                              </label>
                              <input
                                type="radio"
                                name="option"
                                value={title}
                                id={title}
                                className="cursor-pointer"
                                onChange={(e) =>
                                  setMotiveSelect(e.target.value)
                                }
                              />
                            </div>
                          </fieldset>
                        );
                      })}

                      <div className="flex items-center gap-x-4 justify-end mt-10">
                        <button onClick={closeModal} type="button">
                          Voltar
                        </button>
                        <button
                          className="h-12 w-28 bg-neutral-200 text-black rounded-md transition-all hover:bg-neutral-300"
                          type="button"
                          onClick={cancelSchedule}
                        >
                          Confirmar
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
