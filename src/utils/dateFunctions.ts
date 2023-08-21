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
  const day = newDate.getDate();
  const month = newDate.getMonth();

  return `${day < 10 ? "0" + day : day} ${months[month]}`;
}

export function dateToDDMMAA(date: string) {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();

  return `${day < 10 ? "0" + day : day}/${
    month < 10 ? "0" + month : month
  }/${year}`;
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
