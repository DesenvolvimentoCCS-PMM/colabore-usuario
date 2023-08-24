"use client"

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Logo from "@/assets/logoColabore.svg";
import EyeIcon from "@/assets/icons/eyeIcon.svg";
import CloseEyeIcon from "@/assets/icons/closeEyeIcon.svg";
import { auth, db } from "../../services/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifyError } from "@/components/Toast";
import { Button } from "@/components/buttons/DefaultButton";
import { ToastContainer, toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import InputMask from "react-input-mask";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const signupSchema = z
.object({
    fullName: z
    .string()
    .nonempty("*O nome completo é obrigatório")
    .toLowerCase()
    .transform((fullname) => {
      return fullname
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
    email: z
        .string()
        .email("Digite um e-mail válido")
        .nonempty("O e-mail é obrigatório")
        .toLowerCase(),
    gender: z.string().nonempty("*O gênero é obrigatório"),
    whatsapp: z
        .string()
        .nonempty("*O número de whatsapp é obrigatório")
        .min(13, "*O número de whatsapp deve ter 11 dígitos")
        .max(15, "*O número de whatsapp deve ter 11 dígitos"),
    cpf: z
        .string()
        .nonempty("*O CPF é obrigatório")
        .min(12, "*O CPF deve ter 11 dígitos")
        .max(14, "*O CPF deve ter 11 dígitos"),
    birthDate: z.string().nonempty("*A data de nascimento é obrigatória"),
    otherPhone: z
    .string()
    .nonempty("*O número de whatsapp é obrigatório")
    .min(13, "*O número de contato deve ter 11 dígitos")
    .max(15, "*O número de contato deve ter 11 dígitos"), 
    profession: z.string().nonempty('*A profissão é obrigatória!'),
    password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .nonempty("A senha é obrigatória"),
    passwordConfirmation: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .nonempty("A senha é obrigatória"),
  cep: z
    .string()
    .nonempty('*O CEP é obrigatório!')
    .min(8, 'O CEP precisa ter 8 dígitos'),
  neighborhood: z.string().nonempty('*O bairro é obrigatório!'),
  city: z.string().nonempty('*A cidade é obrigatória!'), 
  street: z.string().nonempty('*A rua é obrigatória!'),
  state: z.string().nonempty('*O estado é obrigatório!'),
  number: z.string().nonempty('*O número é obrigatório!'),
  terms: z.literal(true, {
    errorMap: () => ({
      message: "É necessário concordar com nossos termos para prosseguir!",
    }),
  }),
  lgpd: z.literal(true, {
    errorMap: () => ({
      message: "É necessário concordar com nossos termos para prosseguir!",
    }),
  }),
})
.refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser iguais!",
    path: ["passwordConfirmation"],
});

export type signupSchemaType = z.infer<typeof signupSchema>;

export function SignupForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [imageFile, setImageFile] = useState<File>();

    const notifyError = (text: string) => {
        toast.error(text, {
          autoClose: 3000,
          pauseOnHover: false,
        });
      };
    
      const notifySuccess = (text: string) => {
        toast.success(text, {
          autoClose: 2000,
          pauseOnHover: false,
        });
      };

      const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<signupSchemaType>({
        resolver: zodResolver(signupSchema),
    });

    const signupUser = (data: signupSchemaType) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(({ user }) => {
                const uid = user?.uid;
                registerUser(data, uid);
                sendEmailVerification(user);
            })
            .catch((error) => {
                console.log(error);
                if(error.code === 'auth/email-already-in-use') {
                    notifyError('Esse e-mail já está em uso!');
                } else {
                    notifyError('Ops! Algo deu errado. Tente novamente mais tarde.');
                }
            })

        }
    const registerUser = async (
        allData: signupSchemaType,
        id: string
      ) => {
        const { passwordConfirmation, password, ...data } = allData;
        await setDoc(doc(db, "users", id), data);
        notifySuccess("Usuário criado com sucesso!");
        router.push("/agendamentos");
      };
    
      const onSubmit: SubmitHandler<signupSchemaType> = (data) => {
        signupUser(data);
      };

      const handleSelectedFile = (files: FileList | null) => {
        if (files) {
          const maxSize = 5000000;
          const selectedFile = files[0];
    
          if (selectedFile && selectedFile.size <= maxSize) {
            setImageFile(selectedFile);
            console.log(selectedFile);
          } else if (selectedFile && selectedFile.size > maxSize) {
            toast.error("Ops! O arquivo deve ser menor que 5MB", {
              autoClose: 3000,
              pauseOnHover: false,
            });
          } else {
            setImageFile(undefined);
          }
        }
      }; 


    return (

<div className="w-full">
 <ToastContainer />

    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1">
    <h2 className="mt-5 relative left-0 text-white w-full px-5 flex font-medium bg-amber-500">Dados pessoais</h2>
    <div className="flex mt-10 flex-col sm:flex-row w-full gap-y-6 gap-x-16">
        {/* NAME */}
        <div className="flex flex-col w-full sm:w-1/2 gap-y-2">
        <label htmlFor="name" className={`text-sm font-medium ${errors.fullName ? 'text-red-500' : ''} dark:text-gray-800`}>
            Nome completo
        </label>
        <input
            type="text"
            {...register('fullName')}
            id="name"
            placeholder="Ex: Antonácio Souza Lima Pereira"
            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                errors.email && "border border-red-600"
              } sm:text-base`}
        />
        {errors.fullName && <small className="text-red-500 text-[10px] ml-2">{errors.fullName.message}</small>}
        </div>
                
        {/* WHATSAPP */}
        <div className="flex flex-col w-full sm:w-1/3 gap-y-2">
        <label htmlFor="whatsapp" className={`text-sm font-medium ${errors.whatsapp ? 'text-red-500' : ''} dark:text-gray-800`}>
            WhatsApp
        </label>
        <InputMask
                placeholder="(21)99999-9999"
                className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                    errors.email && "border border-red-600"
                  } sm:text-base`}
                mask="(99)99999-9999"
                {...register("whatsapp")}
                inputRef={(inputProps: any) => (
                    <input
                    {...inputProps}
                    type="tel"
                    className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                        errors.email && "border border-red-600"
                      } sm:text-base`}
                    />
                )}
                />
        {errors.whatsapp && <small className="text-red-500 text-[10px] ml-2">{errors.whatsapp.message}</small>}
        </div>

    </div>

        <div className="flex sm:flex-row flex-col w-full mt-5 gap-y-6 gap-x-3">
        {/* BIRTH */}
        <div className="flex flex-col w-full sm:w-1/5 gap-y-2">
            <label htmlFor="birthDate" className={`text-sm font-medium ${errors.birthDate ? 'text-red-500' : ''} dark:text-gray-800`}>
                Data de nascimento
            </label>
            <input
                type="date"
                {...register('birthDate')}
                id="birthDate"
                placeholder="Ex: 01/01/2000"
                className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                    errors.email && "border border-red-600"
                  } sm:text-base`}
            />
            {errors.birthDate && <small className="text-red-500 text-[10px] ml-2">{errors.birthDate.message}</small>}
        </div>
        
        {/* CPF */}
        <div className="flex flex-col w-full sm:w-1/3 gap-y-2">
            <label htmlFor="cpf" className={`text-sm font-medium ${errors.cpf ? 'text-red-500' : ''} dark:text-gray-800`}>
                CPF
            </label>
            <InputMask
                    placeholder="999.999.999-99"
                    className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                        errors.email && "border border-red-600"
                      } sm:text-base`}
                    mask="999.999.999-99"
                    {...register("cpf")}
                    inputRef={(inputProps: any) => (
                        <input
                        {...inputProps}
                        type="tel"
                        />
                    )}
                />
            {errors.cpf && <small className="text-red-500 text-[10px] ml-2">{errors.cpf.message}</small>}
        </div>
        
        {/* OTHER NUMBER */}
            <div className="flex flex-col w-full sm:w-1/3 gap-y-2">
                <label htmlFor="otherPhone" className={`text-sm font-medium ${errors.otherPhone ? 'text-red-500' : ''} dark:text-gray-800`}>
                    Outro telefone
                </label>
                <InputMask
                    placeholder="(21)99999-9999"
                    className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                        errors.email && "border border-red-600"
                      } sm:text-base`}
                    mask="(99)99999-9999"
                    {...register("otherPhone")}
                    inputRef={(inputProps: any) => (
                        <input
                        {...inputProps}
                        type="tel"
                        />
                    )}
                />
                {errors.otherPhone && <small className="text-red-500 text-[10px] ml-2">{errors.otherPhone.message}</small>}
            </div>

        </div>

        <div className="flex flex-row w-full mt-5  gap-y-6 gap-x-10">
                {/* PROFESSION */}
                <div className="flex flex-col w-full sm:w-1/3 gap-y-2">
                    <label htmlFor="profession" className={`text-sm font-medium ${errors.profession ? 'text-red-500' : ''} dark:text-gray-800`}>
                        Profissão
                    </label>
                    <input
                        type="text"
                        {...register('profession')}
                        id="profession"
                        placeholder="Ex: Enfermeiro"
                        className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                            errors.email && "border border-red-600"
                          } sm:text-base`}
                    />
                    {errors.profession && <small className="text-red-500 text-[10px] ml-2">{errors.profession.message}</small>}
                </div>

                {/* PHOTO  */}
                <div className="flex flex-col w-1/3 gap-y-2">
                    <label htmlFor="photo" className={`text-sm font-medium dark:text-gray-800`}>
                        Foto
                    </label>
                    <input
                            type="file"
                            id="userPhoto"
                            className="sr-only"
                            onChange={(files) =>
                            handleSelectedFile(files.target.files)
                            }
                        />
                            <label
                                htmlFor="userPhoto"
                                className={`flex items-center justify-center w-full h-12 rounded-2xl  bg-white border-2 `}
                            >
                                <span className="text-sm font-medium">
                                    {imageFile ? imageFile.name : "Selecione um arquivo"}
                                </span>
                            </label>
                          

                </div> 
                
        </div>
                            
                            
        <h2 className="mt-5 relative left-0 text-white w-full px-5 flex font-medium bg-amber-500">Endereço</h2>

        <div className="flex flex-col sm:flex-row w-full mt-5 gap-y-6 gap-x-6">
                {/* CEP */}
                <div className="flex flex-col w-full sm:w-1/4 gap-y-2">
                    <label htmlFor="cep" className={`text-sm font-medium ${errors.cep ? 'text-red-500' : ''} dark:text-gray-800`}>
                        CEP
                    </label>
                    <InputMask
                    placeholder="99999-999"
                    className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                        errors.email && "border border-red-600"
                      } sm:text-base`}
                    mask="99999-999"
                    {...register("cep")}
                    inputRef={(inputProps: any) => (
                        <input
                        {...inputProps}
                        type="tel"
                        
                        />

                    )}
                />
                {errors.cep && <small className="text-red-500 text-[10px] ml-2">{errors.cep.message}</small>}
                </div>
                {/* RUA */}
                <div className="flex flex-col w-full sm:w-1/3 gap-y-2">
                        <label htmlFor="street" className={`text-sm font-medium ${errors.street ? 'text-red-500' : ''} dark:text-gray-800`}>
                            Rua
                        </label>
                        <input
                            type="text"
                            {...register('street')}
                            id="street"
                            placeholder="Ex: Rua das Flores"
                            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                                errors.email && "border border-red-600"
                              } sm:text-base`}
                        />
                        {errors.street && <small className="text-red-500 text-[10px] ml-2">{errors.street.message}</small>}
                </div>
                {/* NUMERO */}
                <div className="flex flex-col w-full sm:w-1/4 gap-y-2">
                        <label htmlFor="number" className={`text-sm font-medium ${errors.number ? 'text-red-500' : ''} dark:text-gray-800`}>
                            Número
                        </label>
                        <input
                            type="text"
                            {...register('number')}
                            id="number"
                            placeholder="Ex: 123"
                            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                                errors.email && "border border-red-600"
                              } sm:text-base`}
                        />
                </div>
        </div>

        <div className="flex sm:flex-row flex-col w-full mt-5  gap-y-6 gap-x-6">
                {/* BAIRRO */}
                <div className="flex flex-col w-full sm:w-1/4 gap-y-2">
                    <label htmlFor="neighborhood" className={`text-sm font-medium ${errors.neighborhood ? 'text-red-500' : ''} dark:text-gray-800`}>
                        Bairro
                    </label>
                    <input
                        type="text"
                        {...register('neighborhood')}
                        id="neighborhood"
                        placeholder="Ex: Vila Emil"
                        className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                            errors.email && "border border-red-600"
                          } sm:text-base`}
                    />
                    {errors.neighborhood && <small className="text-red-500 text-[10px] ml-2">{errors.neighborhood.message}</small>}
                </div>
                {/* CIDADE */}
                <div className="flex flex-col w-full sm:w-1/3 gap-y-2">
                        <label htmlFor="city" className={`text-sm font-medium ${errors.city ? 'text-red-500' : ''} dark:text-gray-800`}>
                            Cidade
                        </label>
                        <input
                            type="text"
                            {...register('city')}
                            id="city"
                            placeholder="Ex: Mesquita"
                            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                                errors.email && "border border-red-600"
                              } sm:text-base`}
                        />
                        {errors.city && <small className="text-red-500 text-[10px] ml-2">{errors.city.message}</small>}
                </div>
                {/* ESTADO */}
                <div className="flex flex-col w-full sm:w-1/4 gap-y-2">
                        <label htmlFor="state" className={`text-sm font-medium ${errors.state ? 'text-red-500' : ''} dark:text-gray-800`}>
                            Estado
                        </label>
                        <select 
                            {...register('state')}
                            id="state"
                            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                                errors.email && "border border-red-600"
                              } sm:text-base`}
                        >
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AM">AM</option>
                            <option value="AP">AP</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MG">MG</option>
                            <option value="MS">MS</option>
                            <option value="MT">MT</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="PR">PR</option>
                            <option value="RJ" selected>RJ</option>
                            <option value="RN">RN</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="RS">RS</option>
                            <option value="SC">SC</option>
                            <option value="SE">SE</option>
                            <option value="SP">SP</option>
                            <option value="TO">TO</option>
                        </select>
                </div> 
        </div>

        <h2 className="mt-5 relative left-0 text-white w-full px-5 flex font-medium bg-amber-500">Dados de login</h2>
        <div className="flex sm:flex-row flex-col w-full mt-5  gap-y-6 gap-x-6">
                {/* EMAIL */}
                <div className="flex flex-col w-full sm:w-1/2 gap-y-2">
                    <label htmlFor="email" className={`text-sm font-medium ${errors.email ? 'text-red-500' : ''} dark:text-gray-800`}>
                        E-mail
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        id="email"
                        placeholder="Insira seu melhor e-mail aqui"
                        className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                            errors.email && "border border-red-600"
                          } sm:text-base`}
                    />
                    {errors.email && <small className="text-red-500 text-[10px] ml-2">{errors.email.message}</small>}
                </div>
                
        </div>

        <div className="flex sm:flex-row flex-col w-full mt-5 gap-y-6 gap-x-2">
            {/* PASS */}
            <div className="flex flex-col w-full sm:w-1/4 gap-y-2">
                    <label htmlFor="password" className={`text-sm font-medium ${errors.password ? 'text-red-500' : ''} dark:text-gray-800`}>
                        Senha
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register('password')}
                            id="password"
                            placeholder="Insira sua senha aqui"
                            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                                errors.email && "border border-red-600"
                              } sm:text-base`}
                        />
                        <button
                            type="button"
                            className="absolute right-4 bottom-4"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <Image src={CloseEyeIcon} alt="Fechar olho" />
                            ) : (
                                <Image src={EyeIcon} alt="Abrir olho" />
                            )}
                        </button>
                    </div>
                {errors.password && <small className="text-red-500 text-[10px] ml-2">{errors.password.message}</small>}
            </div>

            {/* CONFIRM PASS */}
            <div className="flex flex-col w-full sm:w-1/4 gap-y-2">
                    <label htmlFor="passwordConfirmation" className={`text-sm font-medium ${errors.passwordConfirmation ? 'text-red-500' : ''} dark:text-gray-800`}>
                        Confirme sua senha
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showPasswordConfirmation ? "text" : "password"}
                            {...register('passwordConfirmation')}
                            id="passwordConfirmation"
                            placeholder="Insira sua senha aqui"
                            className={`bg-blueCol text-white p-4 rounded-[20px] text-sm outline-none w-full ${
                                errors.email && "border border-red-600"
                              } sm:text-base`}
                        />
                        <button
                            type="button"
                            className="absolute right-4 bottom-4"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        >
                            {showPasswordConfirmation ? (
                                <Image src={CloseEyeIcon} alt="Fechar olho" />
                            ) : (
                                <Image src={EyeIcon} alt="Abrir olho" />
                            )}
                        </button>
                    </div>
                {errors.passwordConfirmation && <small className="text-red-500 text-[10px] ml-2">{errors.passwordConfirmation.message}</small>}
            </div>
            
        </div>

        <div className="flex flex-row w-full mt-5 gap-y-6 gap-x-2">
            {/* TERMS */}
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('terms')}
                        id="terms"
                        className={`${errors.terms ? 'border-red-500' : ''} p-3 rounded-2xl outline-[#420EAD] outline-1 bg-white border text-sm font-base transition-all dark:text-gray-800`}
                    />
                    <label htmlFor="terms" className={`text-sm font-medium ${errors.terms ? 'text-red-500' : ''} dark:text-gray-800 ml-2`}>
                    Confirmo o envio de meus dados, autorizando a utilização dos mesmos, seguindo as normas da LGPD (Lei Geral de Proteção de Dados Pessoais - Nº13.709 de 14 de Agosto de 2018) <a href="http://lgpd.mesquita.rj.gov.br/?page_id=43">http://lgpd.mesquita.rj.gov.br</a> 
                    </label>
                </div>
            </div>
        </div>

        <div className="flex sm:flex-row flex-col w-full mt-5 gap-y-6 gap-x-10 sm:gap-x-40">
            {/* LGPD */}
            <div className="flex flex-col w-1/2 gap-y-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('lgpd')}
                        id="lgpd"
                        className={`${errors.lgpd ? 'border-red-500' : ''} p-3 rounded-2xl outline-[#420EAD] outline-1 bg-white border text-sm font-base transition-all dark:text-gray-800`}
                    />
                    <label htmlFor="lgpd" className={`text-sm font-medium ${errors.lgpd ? 'text-red-500' : ''} dark:text-gray-800 ml-2`}>
                    Aceito receber informações sobre o Espaço Colabore e a Prefeitura Municipal de Mesquita
                    </label>
                </div>
            </div>
            {/* SUBMIT */}
            <div className="flex flex-col w-full sm:w-1/2 gap-y-2">
                <Button isLink={true} href="/agendamentos" >
                    Cadastrar
                </Button>
            </div>

                                
        </div>


        
    </form>
</div>

    )
}