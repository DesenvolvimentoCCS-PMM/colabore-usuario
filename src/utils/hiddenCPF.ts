export function hiddenCpf(cpf: string) {
  // Remover todos os caracteres não numéricos do CPF
  cpf = cpf.replace(/\D/g, "");

  // Censurar os dígitos do meio do CPF
  const censuredCpf = cpf.substring(0, 3) + "*".repeat(6) + cpf.substring(8);

  return censuredCpf;
}
