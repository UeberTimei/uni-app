import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import { decrypt, getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { RoleProvider } from "./context";
import { HotelProvider } from "./hotelContext";
import { getHotels } from "./hotels/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Сайт туристического оператора",
  description: "Сайт туристического оператора для базы данных PostgresQL",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const sessionInfo = session ? await decrypt(session) : null;

  let UserId: string | null = null;
  let CustomerID: number | null = null;

  if (sessionInfo?.userId) {
    const customer = await prisma.customer.findUnique({
      where: {
        UserId: sessionInfo.userId as string,
      },
      select: {
        UserId: true,
        CustomerID: true,
      },
    });
    UserId = customer?.UserId ?? null;
    CustomerID = customer?.CustomerID ?? null;
  }
  const role =
    sessionInfo?.role === "CLIENT" || sessionInfo?.role === "ADMIN"
      ? sessionInfo.role
      : "NONE";

  const hotels = await getHotels();
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar initialSession={!!session} role={role} id={UserId || ""} />
        <RoleProvider role={role} userId={UserId || ""} CustomerID={CustomerID}>
          <HotelProvider hotels={hotels}>{children}</HotelProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
