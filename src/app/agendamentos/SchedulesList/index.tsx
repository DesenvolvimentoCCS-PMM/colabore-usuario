"use client";

import { notifySuccess } from "@/components/Toast";
import { useScheduleContext } from "@/context/schedulesContext";
import { useUpdateScheduleView } from "@/context/schedulesViewContext";
import { auth } from "@/services/firebase";
import { ScheduleDataType } from "@/types/Schedule";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { SchedulePagination } from "./SchedulePagination";

export function ScheduleList() {
  const { scheduleData } = useScheduleContext();
  const [data, setData] = useState<ScheduleDataType[]>([]);
  const [dataFiltered, setDataFiltered] = useState<ScheduleDataType[]>([]);

  const { updateScheduleView } = useUpdateScheduleView();

  const user = auth.currentUser;

  useEffect(() => {
    getData();
  }, [updateScheduleView]);

  const getData = () => {
    const dataToDisplay = scheduleData.filter((doc) => {
      if (user) {
        return doc.created_by === user?.uid;
      }
    });

    setDataFiltered(dataToDisplay);
    setData(dataToDisplay);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="w-full pt-24">
      {user && !user.emailVerified ? (
        <div className="text-red-500 mb-4">
          <p>
            Você precisa confirmar seu email para ter acesso a essa página. Caso
            não tenha recebido o email de confirmação,{" "}
            <button
              className="text-blue-500"
              onClick={() => {
                sendEmailVerification(user);
                notifySuccess(
                  "E-mail enviado, verifique a sua caixa de mensagens!"
                );
              }}
            >
              clique aqui.
            </button>
          </p>

          <div className="mt-4">
            <button
              onClick={reloadPage}
              className="px-4 py-2 bg-blueCol text-white rounded-2xl"
            >
              Já verifiquei
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div className="flex items-center gap-x-2">
              <div className="h-2 w-2 bg-blueCol"></div>
              <span>Agendado</span>

              <div className="h-2 w-2 bg-green-600"></div>
              <span>Concluídos</span>

              <div className="h-2 w-2 bg-red-500"></div>
              <span>Cancelados</span>
            </div>

            <Filter setFilteredData={setDataFiltered} data={data} />
          </div>

          <SchedulePagination data={dataFiltered} />
        </div>
      )}
    </div>
  );
}
