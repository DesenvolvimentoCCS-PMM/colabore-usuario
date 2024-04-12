import { VoucherSchema } from "@/components/Voucher";
import { dateToDDMMAA } from "@/utils/dateFunctions";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Note } from "phosphor-react";

interface VoucherDownloadProps {
  name: string;
  scheduleCode: string;
  date: string;
  startHour: string;
  service: string;
}

export function VoucherDownload({
  date,
  name,
  scheduleCode,
  service,
  startHour,
}: VoucherDownloadProps) {
  return (
    <PDFDownloadLink
      className="px-3 py-3 rounded-3xl text-sm flex items-center justify-center gap-x-1 max-w-xs transition-all group bg-yellow-600 hover:scale-95 hover:brightness-95 sm:w-max "
      document={
        <VoucherSchema
          date={dateToDDMMAA(date)}
          name={name}
          scheduleCode={scheduleCode}
          service={service}
          time={startHour}
        />
      }
    >
      <Note size={26} className="text-white" />
      <span className="w-0 m-[-2px] overflow-hidden text-white transition-all duration-300 group-hover:w-28 group-hover:m-auto">
        Comprovante
      </span>
    </PDFDownloadLink>
  );
}
