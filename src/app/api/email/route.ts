import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "kinghost.smtpkl.com.br",
  port: 465,
  secure: true,
  auth: {
    user: "4d90b6c22554db6b9aaee213d3cedcde",
    pass: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0ZDkwYjZjMjI1NTRkYjZiOWFhZWUyMTNkM2NlZGNkZSIsImF1ZCI6ImNsaWVudGVraW5nMzk4NDAyIiwiaWF0IjoxNjk0NTQzNDMwLjI5MzY2OTUsImp0aSI6IjI0ZGJhMWI5MDY1NTliNmQwZjQ1M2E0NTI1YTQwOGNiIn0.HtL70Ar2_hZYHc8itmR5eO8MTqTVOyeRnugXnjT7Ei8",
  },
});

export async function POST(req: NextRequest, res: NextResponse) {
  const bodySchema = z.object({
    to: z.string(),
    msg: z.string(),
    subject: z.string(),
  });

  const { msg, subject, to } = bodySchema.parse(req.body);

  const emailOptions = {
    from: "Espaço Colabore Mesquita <no-reply@colabore.kinglala>",
    to,
    subject,
    msg,
  };

  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      return NextResponse.json({ message: "Erro ao enviar e-mail:" });
    }

    return NextResponse.json({ message: "E-mail enviado com sucesso!" });
  });
}
