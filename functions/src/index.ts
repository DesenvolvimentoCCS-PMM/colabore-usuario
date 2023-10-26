// import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

import { createTransport } from "nodemailer";
import * as functions from "firebase-functions";
import * as cors from "cors";

const corsHandler = cors({ origin: "http://localhost:3000" });

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

export const sendEmail = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { destinatario, assunto, mensagem } = req.body;

      const mailOptions = {
        from: "luanhenriquemiguelalves@gmail.com",
        to: destinatario,
        subject: assunto,
        text: mensagem,
      };

      const info = await transporter.sendMail(mailOptions);

      console.log("E-mail enviado: " + info.response);
      res.status(200).send("E-mail enviado com sucesso");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao enviar o e-mail");
    }
  });
});
