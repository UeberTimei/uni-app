import prisma from "@/lib/prisma";
import { HotelsList } from "./HotelsList";

export async function getHotels() {
  const hotels = await prisma.hotel.findMany();

  return hotels.map((hotel) => ({
    ...hotel,
    PricePerNight: Number(hotel.PricePerNight),
  }));
}

export default async function Hotels() {
  const hotels = await getHotels();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Отели</h1>
      <HotelsList initialHotels={hotels} />
    </div>
  );
}
