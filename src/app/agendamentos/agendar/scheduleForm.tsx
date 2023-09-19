"use client";

import { array, z } from "zod";
import { Button } from "@/components/buttons/DefaultButton";
import { ChatCenteredText, Info } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { notifyError, notifySuccess } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { useUserDataContext } from "@/context/userContext";
import { useScheduleContext } from "@/context/schedulesContext";
import emailjs from '@emailjs/browser';

import {
  currentDate,
  dateToDDMMAA,
  dateToDefaultDb,
} from "@/utils/dateFunctions";
import { v4 } from "uuid";

const scheduleFormSchema = z.object({
  service: z.string(),
  date: z
    .string()
    .nonempty("*Selecione uma data para continuar!")
    .refine(
      (date) => {
        const currentDate = new Date();
        const inputDate = new Date(date);
        inputDate.setDate(inputDate.getDate() + 1);

        function isWeekday(date: Date): boolean {
          return date.getDay() >= 1 && date.getDay() <= 5;
        }

        const daysAllowed = 7;
        let daysChecked = 0;

        while (daysChecked < daysAllowed) {
          if (isWeekday(currentDate)) {
            daysChecked++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return inputDate <= currentDate;
      },
      {
        message:
          "Data indisponível! A data deve estar entre 1 e 7 dias úteis a partir de hoje.",
      }
    )
    .refine(
      (date) => {
        const inputDate = new Date(date);
        inputDate.setDate(inputDate.getDate() + 1);

        return inputDate.getDay() != 0 && inputDate.getDay() != 6;
      },
      { message: "Data indisponível! Não funcionamos no fim de semana." }
    )
    .refine((date) => {
      const currentDate = new Date().toLocaleDateString();
      const inputDate = new Date(date);
      inputDate.setDate(inputDate.getDate() + 1);
      const localeInputDate = inputDate.toLocaleDateString();

      return currentDate <= localeInputDate;
    }, "Essa data já passou!"),
  startHour: z.string().nonempty("*Selecione um horário para continuar!"),
  totTime: z.string().nonempty("*Campo obrigatório"),
  hasCoffeBreak: z.string().nonempty("*Campo obrigatório"),
  motive: z
    .string()
    .nonempty("*Campo obrigatório")
    .toLowerCase()
    .max(240, "*Máximo de caracteres excedido"),
  obs: z
    .string()
    .nonempty("*Campo obrigatório")
    .toLowerCase()
    .max(240, "*Máximo de caracteres excedido"),
  lgpd: z.literal(true, {
    errorMap: () => ({
      message: "É necessário concordar com nossos termos para prosseguir!",
    }),
  }),
});

const hoursWith1hUsage = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
const hoursWith2hUsage = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

type scheduleFormSchemaType = z.infer<typeof scheduleFormSchema>;

export function ScheduleForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<scheduleFormSchemaType>({
    resolver: zodResolver(scheduleFormSchema),

    defaultValues: {
      totTime: "",
      hasCoffeBreak: "",
    },
    mode: "onBlur",
  });

  const inputDate = watch("date");
  const inputTime = watch("startHour");
  const inputService = watch("service");
  const inputTotTime = watch("totTime");

  const [isFetching, setIsFetching] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [timeIsValid, setTimeIsValid] = useState<null | boolean>(null);
  const [showAlertTime, setShowAlertTime] = useState(false);

  useEffect(() => {
    if (inputTotTime === "2") {
      setShowAlertTime(true);
    } else {
      setShowAlertTime(false);
    }
  }, [inputTotTime]);

  //Contexts
  const { userData } = useUserDataContext();
  const { scheduleData } = useScheduleContext();
  const { push } = useRouter();
  const user = auth.currentUser;

  const handleTime = () => {
    const fieldsEmpty = !inputDate || !inputTime || !inputTotTime;

    if (fieldsEmpty) {
      return notifyError("Preencha todos os campos para continuar!");
    } else {
      //Pegar os horarios reservados do bd
      const timeIsReserved = getReservedTimes(inputTime);

      const timeNotAvaiableForCurrentDay = checkIfTimeIsAvaiableToday(
        inputDate,
        inputTime
      );

      const scheduleAlreadyExists = scheduleData.some((data) => {
        return (
          //Deve acontecer:
          timeIsReserved &&
          data.date === inputDate &&
          inputService === data.service
        );
      });

      if (scheduleAlreadyExists) {
        return notifyError("Esse agendamento já foi realizado.");
      } else if (timeNotAvaiableForCurrentDay) {
        return notifyError("Este horário não está mais disponivel para hoje.");
      } else {
        notifySuccess("Horário disponível, prossiga!");
        return setTimeIsValid(true);
      }
    }
  };

  const generateScheduleId = () => {
    const id = v4();
    return id.slice(0, 6);
  };

  const checkIfTimeIsAvaiableToday = (date: string, inputTime: string) => {
    const currentDate = new Date();
    const inputDate = new Date(date);
    inputDate.setDate(inputDate.getDate() + 1);

    const datesIsEquals =
      currentDate.toLocaleDateString() === inputDate.toLocaleDateString();

    const inputHours = Number(inputTime.split(":")[0]);
    const currentHours = currentDate.getHours();

    return datesIsEquals && inputHours <= currentHours;
  };

  const setReservedTimes = (inputTime: string, usageTime: string) => {
    //Exemplo => inputTime: '12:00' / usageTime: '2'
    const reservedTimes: string[] = [];

    const splitedFullStartHour = inputTime.split(":"); //['12', '00']
    const startHour = splitedFullStartHour[0]; //'12'
    const endHour = eval(`${startHour} + ${usageTime}`); //'14'

    for (let i = Number(startHour); i <= Number(endHour); i++) {
      const newTime = `${String(i)}:00`;
      reservedTimes.push(newTime);
    }

    return reservedTimes;
  };

  const getReservedTimes = (inputTime: string) => {
    return scheduleData.some((data) => {
      return data.reservedTimes.includes(inputTime);
    });
  };

  const submit: SubmitHandler<scheduleFormSchemaType> = async (data) => {
    setIsFetching(true);

    const reservedTimes = setReservedTimes(inputTime, inputTotTime);

    try {
      const dataToDb = await addDoc(collection(db, "schedules"), {
        userInfo: {
          name: userData.fullName,
          email: user?.email,
          cpf: userData.cpf,
          whatsapp: userData.whatsapp,
        },
        ...data,
        created_by: user?.uid,
        status: 0,
        reservedTimes,
        scheduleCode: generateScheduleId(),
        
      });
      notifySuccess("Agendamento realizado com sucesso!");
      setIsFetching(false);
      sendEmail(data);
      push("/agendamentos");
    } catch (error) {
      notifyError(
        "Não foi possível realizar seu agendamento, tente mais tarde!"
      );
      setIsFetching(false);
      throw new Error();
    }
  };

  function sendEmail() {

    const templateParams = {
      date: inputDate,
      time: inputTime,
      service: inputService,
      name: userData.fullName,
      email: user?.email,
      cpf: userData.cpf,
      whatsapp: userData.whatsapp,
      motive: inputService,
      obs: inputService,
      to_email: user?.email
    };

    emailjs.send('service_mr1wja3', 'template_3llwjbz', templateParams, 'O2Li5jhZOOyYODvgB')
      .then((res) => {
        console.log('success email!', res.status, res.text);
      })
      .catch((error) => {
        console.error('error sending email:', error);
      });
  }
  
  

  return (
    <form
      className="pl-2 space-y-6 mt-10 sm:pl-8"
      onSubmit={handleSubmit(submit)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-8">
        {/* Serviço */}
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="service"
            className={`font-semibold text-purpleCol ${
              errors.service && "text-red-500"
            } sm:text-lg`}
          >
            Serviço
          </label>
          <select
            id="service"
            {...register("service")}
            className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-xs indent-5"
          >
            <option>Reunião {"(máximo 6 pessoas)"}</option>
            <option>Coworking {"(máximo 6 pessoas)"}</option>
            <option>Palestras {"(máximo 20 pessoas)"}</option>
          </select>
          {errors.service && (
            <small className="text-red-500 pt-2 text-xs max-w-[150px]">
              {errors.service.message}
            </small>
          )}

          <Info
            size={20}
            color="white"
            className="absolute top-12 left-3 sm:top-[3.2rem]"
          />
        </div>

        {/* Data */}
        <div className="flex gap-4 sm:gap-8">
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="date"
              className={`font-semibold text-purpleCol ${
                errors.date && "text-red-500"
              } sm:text-lg`}
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              {...register("date")}
              onClick={() => setTimeIsValid(false)}
              className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-max"
            />
            {errors.date && (
              <small className="text-red-500 pt-2 text-xs max-w-[150px]">
                {errors.date.message}
              </small>
            )}
          </div>
          {/* Horario */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="time"
              className={`font-semibold text-purpleCol ${
                errors.startHour && "text-red-500"
              } sm:text-lg`}
            >
              Horário
            </label>

            <select
              className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-max"
              {...register("startHour")}
            >
              {inputTotTime === "2"
                ? hoursWith2hUsage.map((hour, index) => {
                    return (
                      <option value={hour} key={index}>
                        {hour}
                      </option>
                    );
                  })
                : hoursWith1hUsage.map((hour, index) => {
                    return (
                      <option value={hour} key={index}>
                        {hour}
                      </option>
                    );
                  })}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <span
            className={`font-semibold text-purpleCol text-sm ${
              errors.totTime && "text-red-500"
            }`}
          >
            De quanto tempo você precisa?
          </span>

          <div className="space-x-2">
            <input
              type="radio"
              id="oneHour"
              value={1}
              {...register("totTime")}
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
              value={2}
              {...register("totTime")}
              className="cursor-pointer"
            />
            <label
              htmlFor="twoHour"
              className="text-purpleCol text-sm cursor-pointer"
            >
              2 horas
            </label>
          </div>

          {errors.totTime && (
            <small className="text-red-500 pt-2 text-xs max-w-[150px]">
              {errors.totTime.message}
            </small>
          )}
          {showAlertTime && (
            <small className="text-yellow-500 bg-yellow-100  font-semibold p-2 text-xs max-w-xs">
              {"[AVISO]"} Agendamentos com 2h de uso só podem ser agendados até
              às 17h.
            </small>
          )}
        </div>
        {!timeIsValid && (
          <div className="flex justify-end">
            <button
              onClick={handleTime}
              className="bg-yellowCol text-white p-3 rounded-3xl w-max hover:opacity-80 transition-all"
              type="button"
            >
              Verificar disponibilidade
            </button>
          </div>
        )}
      </div>

      {/* Hora e Coffe Break */}
      {timeIsValid && (
        <>
          <div
            className={`flex flex-col flex-wrap gap-6 sm:flex-row-reverse sm:justify-end`}
          >
            <div className="space-y-6 max-w-sm relative md:ml-14">
              <div className="flex flex-col gap-2">
                <span
                  className={`font-semibold text-purpleCol text-sm ${
                    errors.hasCoffeBreak && "text-red-500"
                  }`}
                >
                  Vai ter coffe break?
                </span>

                <div className="space-x-2">
                  <input
                    type="radio"
                    id="hasCB"
                    {...register("hasCoffeBreak")}
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
                    {...register("hasCoffeBreak")}
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

                {errors.hasCoffeBreak && (
                  <small className="text-red-500 pt-2 text-xs max-w-[150px]">
                    {errors.hasCoffeBreak.message}
                  </small>
                )}

                {showAlert && (
                  <div className="p-3 bg-yellowCol relative rounded-3xl sm:w-[320px] md:absolute md:top-32">
                    <h2 className="text-white font-bold flex gap-x-2 items-center uppercase">
                      Atenção! <Info size={20} color="white" />
                    </h2>

                    <p className="text-white text-sm">
                      O coffee break deve acontecer dentro do período agendado.
                      Os comes e bebes, bem como a conservação do espaço,{" "}
                      <b>é de total responsabilidade do usuário.</b>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* motive */}
            <div className="flex flex-col gap-2 w-full max-w-sm relative">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="motivo"
                  className={`text-purpleCol font-semibold ${
                    errors.motive && "text-red-500"
                  } sm:text-lg`}
                >
                  Motivo
                </label>
                <small className=" text-purpleCol">Até 240 caracteres</small>
              </div>

              <input
                type="text"
                id="motivo"
                {...register("motive")}
                maxLength={240}
                placeholder="Descreva aqui o motive do seu agendamento"
                className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full indent-6"
              />
              {errors.motive && (
                <small className="text-red-500 pt-2 text-xs max-w-[150px]">
                  {errors.motive.message}
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

          <div className="flex items-start gap-x-2 max-w-lg">
            <input type="checkbox" {...register("lgpd")} id="lgpd" />
            <label htmlFor="lgpd" className="text-xs">
              Confirmo o envio de meus dados, autorizando a utilização dos
              mesmos, seguindo as normas da LGPD (Lei Geral de Proteção de Dados
              Pessoais - Nº13.709 de 14 de Agosto de 2018)
              <a
                href="https://lgpd.mesquita.rj.gov.br/?page_id=43"
                target="_blank"
                className="text-purpleCol font-medium"
              >
                (http://lgpd.mesquita.rj.gov.br/?page_id=43)
              </a>
            </label>
          </div>
          {errors.lgpd && (
            <small className="text-red-500 pt-2 pl-2 text-xs max-w-[150px] sm:pl-4">
              {errors.lgpd.message}
            </small>
          )}

          <div className="flex justify-end pt-6">
            <Button islink={false} type="submit" disabled={isFetching}>
              {isFetching ? "Agendando..." : "Agendar >"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
