import { useUpdateScheduleView } from "@/context/schedulesViewContext";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function useChangeRealtime() {
  const { updateScheduleView } = useUpdateScheduleView();

  const setRealtimeStatus = async () => {
    //Aciona ao logar
    const localStatus = localStorage.getItem("realtime-status");

    if (!localStatus) {
      //Verifica se já existe no localStorage
      //Recupera o status do bd e adiciona no localStorage
      const docRef = doc(db, "change-realtime", "eE7uzTjPix7TlKRIvh1d");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem("realtime-status", data.status);
      }
    }
  };

  const handleRealtimeVerification = async () => {
    //Aciona ao clicar em 'Verificar disponibilidade'

    //Recupera status do BD
    const realtimeStatusRef = doc(
      db,
      "change-realtime",
      "eE7uzTjPix7TlKRIvh1d"
    );

    const docSnap = await getDoc(realtimeStatusRef);

    if (docSnap.exists()) {
      //Salva o status e o status-local na memoria
      const status = docSnap.data().status;
      const localStatus = Number(localStorage.getItem("realtime-status"));

      //Logica de comparação...
      if (status != localStatus) {
        updateScheduleView();
        localStorage.setItem("realtime-status", status);
      } else {
        const docRef = doc(db, "change-realtime", "eE7uzTjPix7TlKRIvh1d");
        await updateDoc(docRef, { status: status + 1 });

        localStorage.setItem(
          "realtime-status",
          JSON.stringify(localStatus + 1)
        );
      }
    }
  };

  return {
    setRealtimeStatus,
    handleRealtimeVerification,
  };
}
