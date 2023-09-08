import { Header } from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { UserContextProvider } from "@/context/userContext";
import { ScheduleViewProvider } from "@/context/schedulesViewContext";
import { SchedulesContextProvider } from "@/context/schedulesContext";
import { UserLoggedProvider } from "@/context/userLogged";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Espaço Colabore",
  description: "Sistema de agendamento o Espaço Colabore de Mesquita",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans min-h-screen`}>
        <ScheduleViewProvider>
          <SchedulesContextProvider>
            <UserLoggedProvider>
              <UserContextProvider>
                <Toast />
                <Header />
                {children}
                <Footer />
              </UserContextProvider>
            </UserLoggedProvider>
          </SchedulesContextProvider>
        </ScheduleViewProvider>
      </body>
    </html>
  );
}
