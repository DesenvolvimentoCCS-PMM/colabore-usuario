const date = new Date();

export function dateToText(date: string) {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const newDate = new Date(date);
  const day = newDate.getDate() + 1;
  const month = newDate.getMonth();

  const splitedDay = date.split("-")[2];

  return `${splitedDay} ${months[month]}`;
}

export function dateToDDMMAA(date: string, isCurrentDay: boolean) {
  const splitDate = date.split("-");
  const day = splitDate[2];
  const month = splitDate[1];
  const year = splitDate[0];

  return `${day}/${month}/${year}`;
}

export function currentDate() {
  const newDate = new Date();
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();

  return `${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }-${year}`;
}

export function dateToDefaultDb(date: string) {
  const splitedDate = date.split("-");

  const day = splitedDate[2];
  const month = splitedDate[1];
  const year = splitedDate[0];

  console.log(splitedDate);

  return `${month}-${day}-${year}`;
}
