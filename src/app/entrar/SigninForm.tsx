"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Logo from "@/assets/logoColabore.svg";
import EyeIcon from "@/assets/icons/eyeIcon.svg";
import CloseEyeIcon from "@/assets/icons/closeEyeIcon.svg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ForgetPassword } from "@/app/entrar/ForgetPassword";
import { notifyError } from "@/components/Toast";
import { Button } from "@/components/buttons/DefaultButton";

const signinSchema = z.object({
  email: z
    .string()
    .email("Digite um e-mail válido")
    .nonempty("O e-mail é obrigatório")
    .refine((email) => {
      return !email.endsWith("@mesquita.rj.gov.br");
    }, "E-mail inválido!"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .nonempty("A senha é obrigatória"),
});

type signinSchemaType = z.infer<typeof signinSchema>;

export function SigninForm() {
  const [isLogging, setIsLogging] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinSchemaType>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const signin: SubmitHandler<signinSchemaType> = (data) => {
    setIsLogging(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        router.push("/agendamentos");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            notifyError("Não encontramos um usuário com esse E-mail");
            break;
          case "auth/wrong-password":
            notifyError("A senha digitada está incorreta!");
            break;

          case "auth/too-many-requests":
            notifyError(
              "Acesso bloqueado devido a muitas tentativas de acesso, tente novamente mais tarde!"
            );
            break;

          default:
            notifyError(
              "Erro ao se conectar no Espaço Colabore, tente novamente mais tarde!"
            );
            break;
        }
      })
      .finally(() => setIsLogging(false));
  };

  return (
    <div>
      <Image
        src={Logo}
        alt="Espaço Colabore Mesquita"
        className="object-cover w-11/12 max-w-lg m-auto"
      />

      <form onSubmit={handleSubmit(signin)} className="space-y-6 mt-4 ">
        {/* Campo de email */}
        <div className="flex flex-col items-start gap-y-1">
          <label
            htmlFor="email"
            className={`font-semibold text-purpleCol text-base ${
              errors.email && "text-red-600"
            }`}
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
              errors.email && "border border-red-600"
            } sm:text-base`}
            placeholder="Digite seu e-mail"
            {...register("email")}
          />
          {errors.email && (
            <small className="text-red-500 text-xs ml-2">
              {errors.email.message}
            </small>
          )}
        </div>

        {/* Campo de senha */}
        <div className="flex flex-col items-start gap-y-1 relative">
          <label
            htmlFor="password"
            className={`font-semibold text-purpleCol text-base ${
              errors.password && "text-red-500"
            }`}
          >
            Senha
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={`w-full bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none ${
              errors.password && "border border-red-600"
            } sm:text-base`}
            placeholder="Digite sua senha"
            {...register("password")}
          />

          {errors.password && (
            <small className="text-red-500 text-xs ml-2">
              {errors.password.message}
            </small>
          )}

          {/* Olho de visualizar senha */}
          <button
            className={`absolute right-4 bottom-4 ${
              errors.password && "bottom-9"
            }`}
            type="button"
            onClick={() => setShowPassword((state) => !state)}
          >
            {showPassword ? (
              <Image src={EyeIcon} alt="Olho aberto" color="black" />
            ) : (
              <Image src={CloseEyeIcon} alt="Olho aberto" color="black" />
            )}
          </button>
        </div>

        <div className="flex flex-col justify-center items-center gap-y-6 pt-6">
          <Button islink={false} type="submit" disabled={isLogging}>
            {isLogging ? "Entrando..." : "Entrar >"}
          </Button>

          <ForgetPassword />
        </div>
      </form>
    </div>
  );
}
