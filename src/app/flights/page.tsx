import prisma from "@/lib/prisma";
import { FlightsList } from "./FlightsList";

async function getFlights() {
  const flights = await prisma.flight.findMany();

  return flights.map((flight) => ({
    ...flight,
    DepartureDate: new Date(flight.DepartureDate),
    ArrivalDate: new Date(flight.ArrivalDate),
  }));
}

export default async function Flights() {
  const flights = await getFlights();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Рейсы</h1>
      <FlightsList initialFlights={flights} />
    </div>
  );
}
