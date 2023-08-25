export interface ScheduleDataType {
  infoUsuario: {
    nome: string;
    email: string;
  };
  criadoPor: string;
  concluidoEm: string;
  excluidoEm: string;
  data: string;
  horario: string;
  horarioTotal: string;
  motivo: string;
  obs: string;
  servico: string;
  status: number;
  temCoffeBreak: string;
}
