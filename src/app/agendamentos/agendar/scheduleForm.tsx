import { Button } from "@/components/buttons/DefaultButton";

export function ScheduleForm() {
  return (
    <form className="pl-2 space-y-6 mt-10 sm:pl-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="service"
            className="font-semibold text-purpleCol sm:text-lg"
          >
            Serviço
          </label>
          <select
            id="service"
            className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-xs"
          >
            <option>Reunião {"(8 pessoas)"}</option>
            <option>Coworking {"(6 pessoas)"}</option>
            <option>Treinamento {"(20 pessoas)"}</option>
          </select>
        </div>

        <div className="flex gap-4 flex-wrap sm:gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="date"
              className="font-semibold text-purpleCol sm:text-lg"
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-max"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="hour"
              className="font-semibold text-purpleCol sm:text-lg"
            >
              Horário
            </label>
            <input
              type="time"
              id="hour"
              className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full max-w-max"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-wrap gap-6 sm:flex-row-reverse sm:justify-end">
        <div className="space-y-6 max-w-sm md:ml-14">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-purpleCol text-sm">
              De quanto tempo você precisa?
            </span>

            <div className="space-x-2">
              <input type="radio" name="totHour" id="oneHour" />
              <label htmlFor="oneHour" className="text-purpleCol text-sm">
                1 hora
              </label>
              <input type="radio" name="totHour" id="twoHour" />
              <label htmlFor="twoHour" className="text-purpleCol text-sm">
                2 horas
              </label>
            </div>

            <span className="font-semibold text-purpleCol text-sm">
              Vai ter coffe break?
            </span>

            <div className="space-x-2">
              <input type="radio" name="cb" id="hasCB" />
              <label htmlFor="hasCB" className="text-purpleCol text-sm">
                Sim
              </label>
              <input type="radio" name="cb" id="hasNotCB" />
              <label htmlFor="hasNotCB" className="text-purpleCol text-sm">
                Não
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <div className="flex justify-between">
            <label
              htmlFor="motive"
              className="text-purpleCol font-semibold sm:text-lg"
            >
              Motivo
            </label>
            <small className=" text-purpleCol">Até 240 caracteres</small>
          </div>

          <input
            type="text"
            id="motive"
            maxLength={240}
            placeholder="Descreva aqui o motivo do seu agendamento"
            className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 relative max-w-sm">
        <label
          htmlFor="obs"
          className="text-purpleCol font-semibold sm:text-lg"
        >
          Observações
        </label>
        <small className="absolute right-0 text-purpleCol">
          Até 240 caracteres
        </small>

        <textarea
          id="obs"
          cols={30}
          rows={10}
          maxLength={240}
          placeholder="Descreva aqui observações que você considere relevantes (ex: número de pessoas que irão participar da reunião)"
          className="bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full"
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button isLink={false}>Enviar {">"}</Button>
      </div>
    </form>
  );
}
