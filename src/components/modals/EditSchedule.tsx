"use client";

//React
import { Fragment, useState, useRef } from "react";
//UI
import { Dialog, Transition } from "@headlessui/react";
import { notifySuccess, notifyError } from "../Toast";
//Firebase
import { db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";
//Utils
import { currentDate, dateToDefaultDb } from "@/utils/dateFunctions";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";
//Icon
import { PencilSimple, X } from "phosphor-react";
//Validation configs
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface RescheduleProps {
  uid: string;
  username: string;
}

const rescheduleSchema = z.object({
  date: z
    .string()
    .nonempty("*Selecione uma data para continuar!")
    .refine(
      (date) => {
        const inputDate = new Date(date);
        inputDate.setDate(inputDate.getDate() + 1);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const minDate = new Date(currentDate.getTime() + 0 * 60 * 60 * 1000); // Adiciona 1 dia à data atual

        const maxDate = new Date(
          currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
        ); // Adiciona 7 dias à data atual

        const validation = inputDate < minDate || inputDate > maxDate;
        return validation === false; //deve colocar oq é esperado
      },
      {
        message: "A data deve estar entre 1 e 7 dias a partir de hoje.",
      }
    ),
  time: z
    .string()
    .nonempty("*Selecione um horário para continuar!")
    .regex(
      /^(0?[9]|1[0-7]):[0-5][0-9]$/,
      "A hora inserida deve estar entre 9h e 17h"
    ),
});

type rescheduleSchemaType = z.infer<typeof rescheduleSchema>;

export function Reschedule({ uid, username }: RescheduleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { updateScheduleView } = useUpdateScheduleView();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<rescheduleSchemaType>({
    resolver: zodResolver(rescheduleSchema),
    mode: "onBlur",
  });

  const editSchedule: SubmitHandler<rescheduleSchemaType> = async (data) => {
    const docRef = doc(db, "agendamento", uid);
    try {
      await updateDoc(docRef, {
        alteradoPor: username,
        alteradoEm: currentDate(),
        horario: data.time,
        data: dateToDefaultDb(data.date),
      });
      updateScheduleView();
      notifySuccess("Agendamento alterado com sucesso!");
    } catch (error) {
      console.error(error);
      notifyError(
        "Não foi possível alterar seu agendamento, tente novamente mais tarde!"
      );
      throw new Error();
    }

    closeModal();
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        className="px-3 py-3 rounded-3xl text-sm flex items-center justify-center gap-x-1  max-w-xs transition-all group bg-blue-400 hover:scale-95 hover:brightness-95 sm:w-max "
        onClick={openModal}
        type="button"
      >
        <PencilSimple size={20} className="text-white" />
        <span className="w-0 m-[-2px] overflow-hidden text-white transition-all duration-300 group-hover:w-20 group-hover:m-auto">
          Reagendar
        </span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md  overflow-hidden rounded-3xl bg-blueCol/40 p-2 text-left text-white align-middle shadow-xl transition-all">
                  <div className="bg-blueCol px-16 py-20 rounded-3xl">
                    <Dialog.Title
                      as="h1"
                      className="text-2xl font-medium leading-6 text-yellow-400 border-b-2 pb-2"
                    >
                      Reagendar horário
                    </Dialog.Title>

                    <ul className="mt-8">
                      <h2 className="font-medium text-base">Lembre-se</h2>
                      <li className="text-xs">
                        Data: máximo de 7 dias de antecedência a partir de hoje
                      </li>
                      <li className="text-xs">Horário: entre 9h e 17h</li>
                    </ul>

                    <form onSubmit={handleSubmit(editSchedule)}>
                      <button
                        onClick={closeModal}
                        aria-label="Fechar reagendamento"
                        type="button"
                      >
                        <X
                          size={24}
                          color="white"
                          weight="bold"
                          className="absolute top-10 right-10 hover:bg-red-500"
                        />
                      </button>

                      <div className="flex flex-col">
                        <label
                          htmlFor="date"
                          className="mb-2 font-semibold text-base"
                        >
                          Nova data
                        </label>

                        <input
                          type="date"
                          className="rounded-[20px] h-10 text-black text-base px-3 max-w-xs"
                          {...register("date")}
                        />
                        {errors.date && (
                          <span className="text-xs text-red-500 mt-2 ml-3">
                            {errors.date.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col mt-6">
                        <label
                          htmlFor="time"
                          className="mb-2 font-semibold text-base"
                        >
                          Novo horário
                        </label>

                        <input
                          type="time"
                          id="time"
                          className="rounded-[20px] h-10 text-black text-base px-3 max-w-xs"
                          {...register("time")}
                        />

                        {errors.time && (
                          <span className="text-xs text-red-500 mt-2 ml-3">
                            {errors.time.message}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-center flex-wrap gap-4 sm:gap-0">
                        <button
                          className="rounded-3xl bg-[#F8CD30] h-10 w-36 text-lg text-[#3B2566] font-semibold transition-all mt-10 uppercase hover:brightness-90 hover:scale-95"
                          type="submit"
                        >
                          Confirmar
                        </button>

                        <button
                          className="rounded-3xl  h-10 w-36 text-lg text-white font-semibold transition-all mt-10 uppercase hover:brightness-90 hover:scale-95"
                          type="button"
                          onClick={closeModal}
                        >
                          Cancelar
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
