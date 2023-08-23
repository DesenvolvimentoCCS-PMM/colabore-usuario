"use client";

import { z } from "zod";
import { Button } from "@/components/buttons/DefaultButton";
import { ChatCenteredText, Info } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { notifyError, notifySuccess } from "@/components/Toast";
import { useRouter } from "next/navigation";

const scheduleFormSchema = z.object({
  servico: z.string(),
  data: z
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
  horario: z
    .string()
    .nonempty("*Selecione um horário para continuar!")
    .regex(
      /^(0?[9]|1[0-7]):[0-5][0-9]$/,
      "O horário inserido deve estar entre 9h e 17h"
    ),
  horarioTotal: z.string().nonempty("*Campo obrigatório"),
  temCoffeBreak: z.string().nonempty("*Campo obrigatório"),
  motivo: z
    .string()
    .nonempty("*Campo obrigatório")
    .toLowerCase()
    .max(240, "*Máximo de caracteres excedido"),
  obs: z
    .string()
    .nonempty("*Campo obrigatório")
    .toLowerCase()
    .max(240, "*Máximo de caracteres excedido"),
});

type scheduleFormSchemaType = z.infer<typeof scheduleFormSchema>;

export function ScheduleForm() {
  const [isFetching, setIsFetching] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const user = auth.currentUser;

  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<scheduleFormSchemaType>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      horarioTotal: "",
      temCoffeBreak: "",
    },
    mode: "onBlur",
  });

  const submit: SubmitHandler<scheduleFormSchemaType> = async (data) => {
    setIsFetching(true);

    try {
      await addDoc(collection(db, "agendamento"), {
        ...data,
        criadoPor: user?.uid,
      });
      notifySuccess("Agendamento realizado com sucesso!");
      setIsFetching(false);
      push("/agendamentos");
    } catch (error) {
      notifyError(
        "Não foi possível realizar seu agendamento, tente mais tarde!"
      );
      setIsFetching(false);
      throw new Error();
    }
  };

  return (
    <form
      className="pl-2 space-y-6 mt-10 sm:pl-8"
      onSubmit={handleSubmit(submit)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        {/* Serviço */}
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="servico"
            className={`font-semibold text-purpleCol ${
              errors.servico && "text-red-500"
            } sm:text-lg`}
          >
            Serviço
          </label>
          <select
            id="servico"
            {...register("servico")}
            className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-xs indent-5"
          >
            <option>Reunião {"(8 pessoas)"}</option>
            <option>Coworking {"(6 pessoas)"}</option>
            <option>Treinamento {"(20 pessoas)"}</option>
          </select>
          {errors.servico && (
            <small className="text-red-500 pt-2 text-xs max-w-[150px]">
              {errors.servico.message}
            </small>
          )}

          <Info
            size={20}
            color="white"
            className="absolute top-12 left-3 sm:top-[3.2rem]"
          />
        </div>

        {/* Data */}
        <div className="flex gap-4 flex-wrap sm:gap-8">
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="date"
              className={`font-semibold text-purpleCol ${
                errors.data && "text-red-500"
              } sm:text-lg`}
            >
              Data
            </label>
            <input
              type="date"
              id="data"
              {...register("data")}
              className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-max"
            />
            {errors.data && (
              <small className="text-red-500 pt-2 text-xs max-w-[150px]">
                {errors.data.message}
              </small>
            )}
          </div>
          {/* Horario */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="time"
              className={`font-semibold text-purpleCol ${
                errors.horario && "text-red-500"
              } sm:text-lg`}
            >
              Horário
            </label>
            <input
              type="time"
              id="horario"
              {...register("horario")}
              className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-xs"
            />
            {errors.horario && (
              <small className="text-red-500 pt-2 text-xs max-w-[150px]">
                {errors.horario.message}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Hora e Coffe Break */}
      <div className="flex flex-col flex-wrap gap-6 sm:flex-row-reverse sm:justify-end">
        <div className="space-y-6 max-w-sm relative md:ml-14">
          <div className="flex flex-col gap-2">
            <span
              className={`font-semibold text-purpleCol text-sm ${
                errors.horarioTotal && "text-red-500"
              }`}
            >
              De quanto tempo você precisa?
            </span>

            <div className="space-x-2">
              <input
                type="radio"
                id="oneHour"
                value={"1 hora"}
                {...register("horarioTotal")}
                className="cursor-pointer"
              />
              <label
                htmlFor="oneHour"
                className="text-purpleCol text-sm cursor-pointer"
              >
                1 hora
              </label>
              <input
                type="radio"
                id="twoHour"
                value={"2 horas"}
                {...register("horarioTotal")}
                className="cursor-pointer"
              />
              <label
                htmlFor="twoHour"
                className="text-purpleCol text-sm cursor-pointer"
              >
                2 horas
              </label>
            </div>

            {errors.horarioTotal && (
              <small className="text-red-500 pt-2 text-xs max-w-[150px]">
                {errors.horarioTotal.message}
              </small>
            )}

            <span
              className={`font-semibold text-purpleCol text-sm ${
                errors.temCoffeBreak && "text-red-500"
              }`}
            >
              Vai ter coffe break?
            </span>

            <div className="space-x-2">
              <input
                type="radio"
                id="hasCB"
                {...register("temCoffeBreak")}
                className="cursor-pointer"
                onClick={() => setShowAlert(true)}
                value={"sim"}
              />
              <label
                htmlFor="hasCB"
                className="text-purpleCol text-sm cursor-pointer"
              >
                Sim
              </label>
              <input
                type="radio"
                id="hasNotCB"
                {...register("temCoffeBreak")}
                className="cursor-pointer"
                onClick={() => setShowAlert(false)}
                value={"nao"}
              />
              <label
                htmlFor="hasNotCB"
                className="text-purpleCol text-sm cursor-pointer"
              >
                Não
              </label>
            </div>

            {errors.temCoffeBreak && (
              <small className="text-red-500 pt-2 text-xs max-w-[150px]">
                {errors.temCoffeBreak.message}
              </small>
            )}

            {showAlert && (
              <div className="p-3 bg-yellowCol relative rounded-3xl sm:w-[320px] lg:absolute lg:top-32">
                <h2 className="text-white font-bold flex gap-x-2 items-center uppercase">
                  Atenção! <Info size={20} color="white" />
                </h2>

                <p className="text-white text-sm">
                  O coffee break deve acontecer dentro do período agendado. Os
                  comes e bebes, bem como a conservação do espaço,{" "}
                  <b>é de total responsabilidade do usuário.</b>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivo */}
        <div className="flex flex-col gap-2 w-full max-w-sm relative">
          <div className="flex justify-between items-center">
            <label
              htmlFor="motivo"
              className={`text-purpleCol font-semibold ${
                errors.motivo && "text-red-500"
              } sm:text-lg`}
            >
              Motivo
            </label>
            <small className=" text-purpleCol">Até 240 caracteres</small>
          </div>

          <input
            type="text"
            id="motivo"
            {...register("motivo")}
            maxLength={240}
            placeholder="Descreva aqui o motivo do seu agendamento"
            className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full indent-6"
          />
          {errors.motivo && (
            <small className="text-red-500 pt-2 text-xs max-w-[150px]">
              {errors.motivo.message}
            </small>
          )}
          <ChatCenteredText
            size={20}
            color="white"
            className="absolute left-3 top-12 sm:top-[3.2rem]"
          />
        </div>
      </div>

      {/* Observações */}
      <div className="flex flex-col gap-2 relative max-w-sm ">
        <div className="flex items-center justify-between">
          <label
            htmlFor="obs"
            className={`text-purpleCol font-semibold ${
              errors.obs && "text-red-500"
            } sm:text-lg`}
          >
            Observações
          </label>
          <small className=" text-purpleCol">Até 240 caracteres</small>
        </div>

        <textarea
          id="obs"
          {...register("obs")}
          cols={30}
          rows={10}
          placeholder="Descreva aqui observações que você considere relevantes (ex: número de pessoas que irão participar da reunião)"
          className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full indent-6"
        />
        {errors.obs && (
          <small className="text-red-500 pt-2 text-xs max-w-[150px]">
            {errors.obs.message}
          </small>
        )}
        <ChatCenteredText
          size={20}
          color="white"
          className="absolute left-3 top-12 sm:top-[3.2rem]"
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button isLink={false} type="submit" disabled={isFetching}>
          {isFetching ? "Agendando..." : "Agendar >"}
        </Button>
      </div>
    </form>
  );
}
