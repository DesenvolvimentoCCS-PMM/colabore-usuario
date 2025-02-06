import axios from "axios";
import dayjs from "dayjs";

export  const sendMail = (
    email: string,
    name: string,
    date: string,
    time: string
  ) => {
    axios.post(
      "https://colabore-email.onrender.com/send-email",
      {
        email,
        name,
        time,
        date: dayjs(date).format("DD/MM/YYYY"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };