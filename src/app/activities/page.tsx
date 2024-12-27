import prisma from "@/lib/prisma";
import { ActivitiesList } from "./ActivitiesList";

async function getActivities() {
  const activities = await prisma.activity.findMany();

  return activities.map((activity) => ({
    ...activity,
    Cost: Number(activity.Cost),
  }));
}

export default async function Activities() {
  const activities = await getActivities();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Активности</h1>
      <ActivitiesList initialActivities={activities} />
    </div>
  );
}
