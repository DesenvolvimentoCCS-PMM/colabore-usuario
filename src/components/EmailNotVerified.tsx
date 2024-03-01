import { User, sendEmailVerification } from "firebase/auth";
import { notifySuccess } from "./Toast";

export function EmailNotVerified({ user }: { user: User }) {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="text-red-500 mb-4">
      <p>
        Você precisa confirmar seu email para ter acesso a essa página. Caso não
        tenha recebido o email de confirmação,{" "}
        <button
          className="text-blue-500"
          onClick={() => {
            sendEmailVerification(user);
            notifySuccess(
              "E-mail enviado, verifique a sua caixa de mensagens!"
            );
          }}
        >
          clique aqui.
        </button>
      </p>

      <div className="mt-4">
        <button
          onClick={reloadPage}
          className="px-4 py-2 bg-blueCol text-white rounded-2xl"
        >
          Já verifiquei
        </button>
      </div>
    </div>
  );
}
