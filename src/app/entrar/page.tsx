import Image from "next/image";
import Ilustration from "@/assets/ilustration.jpg";
import { SigninForm } from "@/app/entrar/SigninForm";
import { Container } from "@/components/Container";

export default function Entrar() {
  return (
    <Container center>
      <main className="flex items-center flex-wrap justify-center gap-10  m-auto xl:gap-40">
        <Image
          src={Ilustration}
          alt="Ilustração de pessoas vendo um calendário"
          className="w-11/12 max-w-lg 2xl:max-w-sm"
        />
        <SigninForm />
      </main>
    </Container>
  );
}
