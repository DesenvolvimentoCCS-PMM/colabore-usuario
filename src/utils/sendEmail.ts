import { createTransport } from "nodemailer";

// Importe o módulo Nodemailer
// Configuração do transportador (SMTP)
let transporter = createTransport({
  service: "gmail", // Você pode mudar para outro provedor de e-mail
  auth: {
    user: "colaboremesquita@gmail.com", // Seu endereço de e-mail
    pass: "uxcieyecoewxuurp", // Sua senha de e-maild
  },
});

// Configuração do e-mail
let mailOptions = {
  from: "colaboremesquita@gmail.com", // Seu endereço de e-mail
  to: "luanhenrique.devweb@gmail.com", // Endereço de e-mail do destinatário
  subject: "Se funcionou tu é genio",
  text: "O HOMEM, UMA MAQUINA!", // Conteúdo do e-mail em texto sem formatação
};

export function SendMail() {
  // Envia o e-mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("E-mail enviado: " + info.response);
    }
  });
}
