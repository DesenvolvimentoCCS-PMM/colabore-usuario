"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { notifyError, notifySuccess } from "../../components/Toast";

export function ForgetPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();

  const redefinePassword = () => {
    if (emailRef.current?.value) {
      const email = emailRef.current.value;
      sendPasswordResetEmail(auth, email)
        .then(() => {
          notifySuccess(
            "E-mail enviado com sucesso, verifique sua caixa de e-mail ou spam!"
          );
          setIsOpen(false);
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            notifyError("O e-mail digitado não se encontra cadastrado!");
          }
        });
    } else {
      notifyError("O e-mail precisa ser preenchido!");
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm text-[#232C69]"
        type="button"
      >
        Esqueceu a senha? <span className="font-medium">clique aqui</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl  overflow-hidden rounded-3xl bg-blueCol/40 p-2 text-left text-white align-middle shadow-xl transition-all">
                  <div className="bg-blueCol px-16 py-20 rounded-3xl">
                    <Dialog.Title
                      as="h1"
                      className="text-2xl font-medium leading-6 text-white"
                    >
                      Esqueceu sua senha?
                    </Dialog.Title>

                    <p className="font-light text-base my-8">
                      Insira seu e-mail no campo abaixo que enviaremos um link
                      de redefinição para você!
                    </p>

                    <div className="flex flex-col">
                      <label
                        htmlFor="forget-email"
                        className="mb-2 font-semibold text-base"
                      >
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="rounded-[20px] h-10 text-black text-base pl-3"
                        placeholder="Insira seu e-mail aqui"
                        ref={emailRef}
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        className="rounded-3xl bg-[#F8CD30] h-10 w-36 text-lg text-[#3B2566] font-semibold transition-all mt-10 uppercase hover:brightness-90 hover:scale-95"
                        type="button"
                        onClick={redefinePassword}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
