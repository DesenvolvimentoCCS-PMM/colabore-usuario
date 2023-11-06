import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";

interface bodyType {
  email: string;
  name: string;
  date: string;
  time: string;
}

export async function POST(req: Request) {
  const res: bodyType = await req.json();

  let transporter = createTransport({
    service: "gmail", // Você pode mudar para outro provedor de e-mail
    auth: {
      user: process.env.MAIL_USER, // Seu endereço de e-mail
      pass: process.env.MAIL_PASSWORD, // Sua senha de e-maild
    },
  });

  // Configuração do e-mail
  let mailOptions = {
    from: "Espaço Colabore Mesquita", // Seu endereço de e-mail
    to: res.email, // Endereço de e-mail do destinatário
    subject: "[Espaço Colabore] Horário agendado!",
    text: `Olá ${res.name}, seu horário no Espaço Colabore foi agendado com sucesso, aguardamos você no dia ${res.date} às ${res.time}, lembre-se de chegar com 15 minutos de antecedência! 
    Qualquer dúvida basta acessar o seu painel de agendamento.
    `, // Conteúdo do e-mail em texto sem formatação
  };
  // Envia o e-mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return NextResponse.json({ error: "E-mail not sent! [ERROR]: " + error });
    } else {
      return NextResponse.json({ log: "Email sent successfully" });
    }
  });
}
