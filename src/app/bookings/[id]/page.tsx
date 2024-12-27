import prisma from "@/lib/prisma";
import { BookingsList } from "../BookingsList";

async function getBookings(id: string) {
  const customer = await prisma.customer.findUnique({
    where: {
      UserId: id,
    },
  });
  const bookings = await prisma.booking.findMany({
    where: {
      CustomerID: customer?.CustomerID,
    },
  });

  return bookings.map((booking) => ({
    ...booking,
    BookingDate: new Date(booking.BookingDate),
    CheckInDate: new Date(booking.CheckInDate),
    CheckOutDate: new Date(booking.CheckOutDate),
    TotalCost: Number(booking.TotalCost),
  }));
}

export default async function CustomerBookings({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id as string;
  const bookings = await getBookings(id);

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Бронирования</h1>
      <BookingsList initialBookings={bookings} isCustomerSpecific={true} />
    </div>
  );
}
