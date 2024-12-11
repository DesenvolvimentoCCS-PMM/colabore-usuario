import { Container } from "@/components/Container";
import { SignupForm } from "@/app/cadastro/SignupForm";
import { PageNavigationBar } from "@/components/PageNavigationBar";

export default function Cadastro() {
  return (
    <Container>
      <div>
        <PageNavigationBar
          currentPage="cadastrar"
          target="/"
          targetName="Ínicio"
        />
        <div className="text-left py-3">
          <h1 className="text-yellow-500 text-4xl font-medium">
            Espaço colabore
          </h1>
          <p className="text-gray-700 font-poppins text-lg mt-2">
            Preencha as informações abaixo para realizar o seu cadastro
          </p>
        </div>
        <SignupForm />
      </div>
    </Container>
  );
}
