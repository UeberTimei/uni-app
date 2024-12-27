import prisma from "@/lib/prisma";
import { DestinationsList } from "./DestinationsList";

async function getDestinations() {
  const destinations = await prisma.destination.findMany();

  return destinations.map((destination) => ({
    ...destination,
    AverageTemperature: destination.AverageTemperature
      ? Number(destination.AverageTemperature)
      : null,
  }));
}

export default async function Destinations() {
  const destinations = await getDestinations();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Направления</h1>
      <DestinationsList initialDestinations={destinations} />
    </div>
  );
}
