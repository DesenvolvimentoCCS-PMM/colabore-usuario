"use client";

import { notifyError, notifySuccess } from "@/components/Toast";
import { useScheduleContext } from "@/context/schedulesContext";
import { useUserContext } from "@/context/userContext";
import { auth, db } from "@/services/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ChatCenteredText, Info } from "phosphor-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";

import { ScheduleDataType } from "@/types/Schedule";
import { currentDate } from "@/utils/dateFunctions";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { sendMail } from "@/utils/send-email";

//Configurando para pt-br
dayjs.extend(localizedFormat);
dayjs.locale(ptBr);

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
      const currentDate = new Date();
      currentDate.setUTCHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      inputDate.setUTCHours(0, 0, 0, 0);

      return currentDate <= inputDate;
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
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];
const hoursWith2hUsage = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

type scheduleFormSchemaType = z.infer<typeof scheduleFormSchema>;

export function ScheduleForm() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
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
  const [isVerified, setIsVerified] = useState<null | boolean>(null);
  const [showAlertTime, setShowAlertTime] = useState(false);

  //Altera o input de horario de acordo com o tempo de uso.
  useEffect(() => {
    if (inputTotTime === "2") {
      setShowAlertTime(true);
    } else {
      setShowAlertTime(false);
    }
  }, [inputTotTime]);

  //Contextos
  const { user } = useUserContext();
  const { scheduleData, updateScheduleView } = useScheduleContext();
  const { push } = useRouter();
  const userAuth = auth.currentUser;

  //Lida com toda logica de agendamento
  const handleVerifyDisponibility = async () => {
    const inputDate = watch("date");
    const inputService = watch("service");

    const validationResult = await trigger([
      "date",
      "service",
      "startHour",
      "totTime",
    ]);

    if (validationResult) {
      const isAvaiable = await checkIfSchedullingAlreadyExists(
        inputService,
        inputDate
      );

      const isNotAvaiableToday = checkIfTimeIsAvaiableToday()
      
      if (isAvaiable && !isNotAvaiableToday) {
        notifySuccess("Horário disponível, prossiga!");
        setIsVerified(true)
      }else {
        notifyError("Horário indisponível!");
      }
    }
  };

  //Verifica se a disponibilidade do agendamento no dia atual (função auxiliar)
  const checkIfTimeIsAvaiableToday = () => {
    const datesIsEquals =
      currentDate() === dayjs(inputDate).format("DD-MM-YYYY");

    const inputHour = Number(inputTime.split(":")[0]);
    const currentHours = dayjs().hour();

    return datesIsEquals && inputHour <= currentHours;
  };

  //Verifica a disponibilidade do agendamento 
  const checkIfSchedullingAlreadyExists = async (
    service: string,
    date: string
  ) => {
    if (service === "Coworking") {
      const q = query(
        collection(db, "schedules"),
        where("service", "==", "Coworking"),
        where("date", "==", date),
        where("status", "==", 0)
      );

      const totCoworkings = (await getDocs(q)).size;

      if (totCoworkings >= 6) {
        return false;
      }

      return true;
    } else {
      const q = query(
        collection(db, "schedules"),
        where("service", "==", service),
        where("date", "==", date),
        where("status", "==", 0)
      );

      const schedulingData: any = [];
      const userReservedHours = calculateReservedHours();
      const schedullingResponse = await getDocs(q);
      const schedullings = schedullingResponse.forEach((doc) => {
        schedulingData.push({
          ...doc.data(),
          uid: doc.id,
        });
      });

      const resevedTimes = schedulingData.map(
        (scheduling: any) => scheduling.reservedTimes
      );
      const isReserved = resevedTimes.some((item: string[]) =>
        item.some((time: string) => userReservedHours.includes(time))
      );
      
      if(isReserved){
        return false
      }

      return true
    }
  };

  //Cria o array de horarios reservados (função auxiliar)
  const calculateReservedHours = () => {
    const startHour = Number(inputTime.split(":")[0]);
    const endHour = startHour + Number(inputTotTime);

    return Array.from({ length: endHour - startHour + 1 }, (_, index) => {
      const newTime = `${startHour + index}:00`;
      return newTime;
    });
  };

  //Pede a verificação de disponibilidade após interagir com algum campo do formulario
  const requestFormVerifiy = () => {
    setIsVerified(false);
  };

  const IsAvailableSchedulling = async (
    date: string,
    service: string,
    reservedTimes: string[]
  ) => {
    if (service === "Coworking") {
      const q = query(
        collection(db, "schedules"),
        where("service", "==", "Coworking"),
        where("date", "==", inputDate),
        where("status", "==", 0)
      );

      const totCoworkings = (await getDocs(q)).size;

      if (totCoworkings >= 6) {
        return false;
      }

      return true;
    } else {
      const q = query(
        collection(db, "schedules"),
        where("service", "==", service),
        where("date", "==", inputDate),
        where("reservedTimes", "array-contains-any", reservedTimes),
        where("status", "==", 0)
      );
      const isAvailable = (await getDocs(q)).empty;

      if (isAvailable) return true;

      return false;
    }
  };

  const submit: SubmitHandler<scheduleFormSchemaType> = async (data) => {
    const reservedTimes = calculateReservedHours();
    const id = v4().slice(0, 6);
    const isAvailable = await IsAvailableSchedulling(
      data.date,
      data.service,
      reservedTimes
    );

    const phone = user.whatsapp.replace(/\D/g, "");
    const cpf = user.cpf.replace(/\D/g, "");
    const cep = user.cep.replace(/\D/g, "");

    if (!isAvailable) {
      notifyError(
        "Esse horário não está mais disponível, tente novamente com outro horário/dia."
      );
      return;
    }

    try {
      await addDoc(collection(db, "schedules"), {
        userInfo: {
          name: user.fullName,
          email: user.email,
          cpf: user.cpf,
          whatsapp: user.whatsapp,
        },
        created_by: userAuth?.uid,
        created_at: new Date(),
        status: 0,
        reservedTimes,
        scheduleCode: id,
        ...data,
      });

      // await axios.post(
      //   "https://prod2-14.brazilsouth.logic.azure.com/workflows/9c2421ba975149e4b714e40a7ed19cef/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=eKowTk1T0gwHbTXhp4pyVka-P_GAxA1yqiDGV9mx5Mg",
      //   {
      //     token:
      //       "YfmU4dJoD3Vtw5vECgCszh11HslIXT0T3OCRCq7ZZm0grphIhuakemGJXSiHE7lT",
      //     nome: user.fullName,
      //     cpf: cpf,
      //     data_agendamento: new Date().toLocaleDateString(),
      //     email: user.email,
      //     codigo: id,
      //     pdf: "documento.pdf",
      //     genero: user.gender,
      //     data_nascimento: user.birthDate,
      //     rua: user.street,
      //     numero: user.number,
      //     complemento: "",
      //     bairro: user.neighborhood,
      //     cidade: user.city,
      //     estado: user.state,
      //     cep,
      //     celular: phone,
      //   }
      // );

      
      sendMail(user.email, user.fullName, inputDate, reservedTimes[0]);
      notifySuccess("Agendamento realizado com sucesso!");
      updateScheduleView();
      push("/agendamentos");
    } catch (error) {
      console.log(error);
      notifyError(
        "Não foi possível realizar seu agendamento, tente mais tarde!"
      );
      throw new Error();
    } finally {
      setIsFetching(false);
    }
  };

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
            onChange={requestFormVerifiy}
            className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-xs indent-5"
          >
            <option>Reunião {"(máximo 6 pessoas)"}</option>
            <option>Coworking</option>
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
              onClick={requestFormVerifiy}
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
              onClick={requestFormVerifiy}
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
              onClick={requestFormVerifiy}
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
              onClick={requestFormVerifiy}
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
              às 15h.
            </small>
          )}
        </div>
        {!isVerified && (
          <div className="flex justify-end">
            <button
              onClick={handleVerifyDisponibility}
              className="bg-yellowCol text-white p-3 rounded-3xl w-max hover:opacity-80 transition-all"
              type="button"
            >
              Verificar disponibilidade
            </button>
          </div>
        )}
      </div>

      {/* Hora e Coffe Break */}
      {isVerified && (
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
            <button
              className="flex items-center gap-x-2 rounded-3xl bg-[#CC9935] px-10 py-2 max-w-max text-white font-medium text-sm uppercase disabled:opacity-50 disabled:pointer-events-none sm:text-base "
              type="submit"
              disabled={isFetching}
            >
              {isFetching ? "Agendando..." : "Agendar >"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
