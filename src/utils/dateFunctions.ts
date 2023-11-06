import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";

//Configurando para pt-br
dayjs.extend(localizedFormat);
dayjs.locale(ptBr);

export function dateToText(date: string) {
  const inputDate = dayjs(date);
  return inputDate.format("DD MMM");
}

export function dateToDDMMAA(date: string) {
  return dayjs(date).format("DD/MM/YYYY");
}

export function currentDate() {
  return dayjs().format("DD-MM-YYYY");
}
