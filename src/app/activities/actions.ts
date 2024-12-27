"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateActivitySchema = z.object({
  ActivityID: z.number(),
  ActivityName: z.string().min(1, { message: "Название обязательно" }),
  Description: z.string(),
  Duration: z
    .number()
    .min(0.5, { message: "Минимальная длительность 0.5 часа" }),
  Cost: z.number().min(0, { message: "Стоимость не может быть отрицательной" }),
});

export async function updateActivity(prevState: any, formData: FormData) {
  const ActivityID = Number(formData.get("ActivityID"));
  const Duration = Number(formData.get("Duration"));
  const Cost = Number(formData.get("Cost"));

  const result = updateActivitySchema.safeParse({
    ActivityID,
    ActivityName: formData.get("ActivityName"),
    Description: formData.get("Description"),
    Duration,
    Cost,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.activity.update({
      where: { ActivityID },
      data: {
        ActivityName: result.data.ActivityName,
        Description: result.data.Description,
        Duration: result.data.Duration,
        Cost: result.data.Cost,
      },
    });

    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        ActivityName: ["Произошла ошибка при обновлении активности"],
      },
    };
  }
}

export async function deleteActivity(prevState: any, formData: FormData) {
  const ActivityID = Number(formData.get("ActivityID"));

  if (!ActivityID || isNaN(ActivityID)) {
    return {
      success: false,
      error: "Invalid activity ID",
    };
  }

  try {
    await prisma.activity.delete({
      where: { ActivityID },
    });
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    console.error("Delete activity error:", error);
    return `Failed to delete activity: ${error || "Unknown error"}`;
  }
}

const activitySchema = z.object({
  DestinationID: z
    .number()
    .min(1, { message: "ID места назначения обязателен" }),
  ActivityName: z.string().min(1, { message: "Название обязательно" }),
  Description: z.string(),
  Duration: z
    .number()
    .min(0.5, { message: "Минимальная длительность 0.5 часа" }),
  Cost: z.number().min(0, { message: "Стоимость не может быть отрицательной" }),
});

export async function createActivity(prevState: any, formData: FormData) {
  const result = activitySchema.safeParse({
    DestinationID: Number(formData.get("DestinationID")),
    ActivityName: formData.get("ActivityName"),
    Description: formData.get("Description"),
    Duration: Number(formData.get("Duration")),
    Cost: Number(formData.get("Cost")),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.activity.create({
      data: {
        DestinationID: result.data.DestinationID,
        ActivityName: result.data.ActivityName,
        Description: result.data.Description,
        Duration: result.data.Duration,
        Cost: result.data.Cost,
      },
    });

    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    console.error("Create activity error:", error);
    return {
      success: false,
      errors: {
        ActivityName: ["Произошла ошибка при создании активности"],
      },
    };
  }
}
