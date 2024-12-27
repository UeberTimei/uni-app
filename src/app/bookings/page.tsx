import prisma from "@/lib/prisma";
import { BookingsList } from "./BookingsList";

async function getBookings() {
  const bookings = await prisma.booking.findMany();

  return bookings.map((booking) => ({
    ...booking,
    BookingDate: new Date(booking.BookingDate),
    CheckInDate: new Date(booking.CheckInDate),
    CheckOutDate: new Date(booking.CheckOutDate),
    TotalCost: Number(booking.TotalCost),
  }));
}

export default async function Bookings() {
  const bookings = await getBookings();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Бронирования</h1>
      <BookingsList initialBookings={bookings} />
    </div>
  );
}