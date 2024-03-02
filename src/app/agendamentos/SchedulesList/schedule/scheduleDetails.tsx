import { useUserContext } from "@/context/userContext";
import { ScheduleDataType } from "@/types/Schedule";
import { dateToDDMMAA, dateToText } from "@/utils/dateFunctions";

interface scheduleDetailsProps {
  isOpen: boolean;
  data: ScheduleDataType;
}

export function ScheduleDetails({ data, isOpen }: scheduleDetailsProps) {
  const { user } = useUserContext();

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
    hasAdmin: user.fullName.includes("Admin"),
  };

  const formatations = {
    date: dateToText(data.date),
    whatsapp: "5521969718153",
    resumeService: data.service.split("(")[0],
    endTime: data.reservedTimes[data.reservedTimes.length - 1],
  };

  return (
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
          <div className="inline-flex items-center gap-x-2 my-1 w-full">
            <h3 className="text-sm font-semibold ">Código de agendamento:</h3>
            <p className="text-lg uppercase tracking-widest ">
              {data.scheduleCode}
            </p>
          </div>
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

          {data.cancelMotive && (
            <div className="inline-flex gap-x-2 my-1 items-center">
              <h3 className="text-sm font-semibold">Motivo do cancelamento:</h3>
              <span
                className={`text-sm p-1 rounded-3xl font-semibold ${styleVariants.completedTextColor} ${styleVariants.deletedTextColor} ${styleVariants.scheduledTextColor}`}
              >
                {data.cancelMotive}
              </span>
            </div>
          )}

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
  );
}
