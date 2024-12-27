"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateDestinationSchema = z.object({
  DestinationID: z.number(),
  CountryName: z.string().min(1, { message: "Страна обязательна" }),
  CityName: z.string().min(1, { message: "Город обязателен" }),
  Description: z.string().nullable(),
  AverageTemperature: z.number().nullable(),
  Currency: z.string().nullable(),
});

export async function updateDestination(prevState: any, formData: FormData) {
  const DestinationID = Number(formData.get("DestinationID"));
  const AverageTemperature = formData.get("AverageTemperature")
    ? Number(formData.get("AverageTemperature"))
    : null;

  const result = updateDestinationSchema.safeParse({
    DestinationID,
    CountryName: formData.get("CountryName"),
    CityName: formData.get("CityName"),
    Description: formData.get("Description") || null,
    AverageTemperature,
    Currency: formData.get("Currency") || null,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.destination.update({
      where: { DestinationID },
      data: {
        CountryName: result.data.CountryName,
        CityName: result.data.CityName,
        Description: result.data.Description,
        AverageTemperature: result.data.AverageTemperature,
        Currency: result.data.Currency,
      },
    });

    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        CountryName: ["Произошла ошибка при обновлении направления"],
      },
    };
  }
}

export async function deleteDestination(prevState: any, formData: FormData) {
  const DestinationID = Number(formData.get("DestinationID"));

  if (!DestinationID || isNaN(DestinationID)) {
    return {
      success: false,
      error: "Invalid destination ID",
    };
  }

  try {
    await prisma.destination.delete({
      where: { DestinationID },
    });
    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    console.error("Delete destination error:", error);
    return `Failed to delete destination: ${error || "Unknown error"}`;
  }
}

const destinationSchema = z.object({
  CountryName: z.string().min(1, { message: "Страна обязательна" }),
  CityName: z.string().min(1, { message: "Город обязателен" }),
  Description: z.string().nullable(),
  AverageTemperature: z.number().nullable(),
  Currency: z.string().nullable(),
});

export async function createDestination(prevState: any, formData: FormData) {
  const result = destinationSchema.safeParse({
    CountryName: formData.get("CountryName"),
    CityName: formData.get("CityName"),
    Description: formData.get("Description") || null,
    AverageTemperature: formData.get("AverageTemperature")
      ? Number(formData.get("AverageTemperature"))
      : null,
    Currency: formData.get("Currency") || null,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.destination.create({
      data: result.data,
    });

    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        CountryName: ["Произошла ошибка при создании направления"],
      },
    };
  }
}
