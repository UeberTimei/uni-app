"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateFlightSchema = z.object({
  FlightID: z.number(),
  DepartureAirport: z
    .string()
    .min(1, { message: "Аэропорт вылета обязателен" }),
  ArrivalAirport: z
    .string()
    .min(1, { message: "Аэропорт прибытия обязателен" }),
  DepartureDate: z.string().transform((str) => new Date(str)),
  ArrivalDate: z.string().transform((str) => new Date(str)),
  FlightDuration: z.number().min(0),
  FlightNumber: z.string().min(1, { message: "Номер рейса обязателен" }),
  AirlineCode: z.string().min(1, { message: "Код авиакомпании обязателен" }),
});

export async function updateFlight(prevState: any, formData: FormData) {
  const FlightID = Number(formData.get("FlightID"));

  const result = updateFlightSchema.safeParse({
    FlightID,
    DepartureAirport: formData.get("DepartureAirport"),
    ArrivalAirport: formData.get("ArrivalAirport"),
    DepartureDate: formData.get("DepartureDate"),
    ArrivalDate: formData.get("ArrivalDate"),
    FlightDuration: Number(formData.get("FlightDuration")),
    FlightNumber: formData.get("FlightNumber"),
    AirlineCode: formData.get("AirlineCode"),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.flight.update({
      where: { FlightID },
      data: {
        DepartureAirport: result.data.DepartureAirport,
        ArrivalAirport: result.data.ArrivalAirport,
        DepartureDate: result.data.DepartureDate,
        ArrivalDate: result.data.ArrivalDate,
        FlightDuration: result.data.FlightDuration,
        FlightNumber: result.data.FlightNumber,
        AirlineCode: result.data.AirlineCode,
      },
    });

    revalidatePath("/flights");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        FlightNumber: ["Произошла ошибка при обновлении рейса"],
      },
    };
  }
}

export async function deleteFlight(prevState: any, formData: FormData) {
  const FlightID = Number(formData.get("FlightID"));

  if (!FlightID || isNaN(FlightID)) {
    return {
      success: false,
      error: "Invalid flight ID",
    };
  }

  try {
    await prisma.flight.delete({
      where: { FlightID },
    });
    revalidatePath("/flights");
    return { success: true };
  } catch (error) {
    console.error("Delete flight error:", error);
    return `Failed to delete flight: ${error || "Unknown error"}`;
  }
}

const flightSchema = z.object({
  DepartureAirport: z
    .string()
    .min(1, { message: "Аэропорт вылета обязателен" }),
  ArrivalAirport: z
    .string()
    .min(1, { message: "Аэропорт прибытия обязателен" }),
  DepartureDate: z.string().transform((str) => new Date(str)),
  ArrivalDate: z.string().transform((str) => new Date(str)),
  FlightDuration: z.number().min(0),
  FlightNumber: z.string().min(1, { message: "Номер рейса обязателен" }),
  AirlineCode: z.string().min(1, { message: "Код авиакомпании обязателен" }),
});

export async function createFlight(prevState: any, formData: FormData) {
  const result = flightSchema.safeParse({
    DepartureAirport: formData.get("DepartureAirport"),
    ArrivalAirport: formData.get("ArrivalAirport"),
    DepartureDate: formData.get("DepartureDate"),
    ArrivalDate: formData.get("ArrivalDate"),
    FlightDuration: Number(formData.get("FlightDuration")),
    FlightNumber: formData.get("FlightNumber"),
    AirlineCode: formData.get("AirlineCode"),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    console.log("trying to create");
    await prisma.flight.create({
      data: {
        AirlineCode: result.data.AirlineCode,
        ArrivalAirport: result.data.ArrivalAirport,
        ArrivalDate: result.data.ArrivalDate,
        DepartureAirport: result.data.DepartureAirport,
        DepartureDate: result.data.DepartureDate,
        FlightDuration: result.data.FlightDuration,
        FlightNumber: result.data.FlightNumber,
      },
    });

    revalidatePath("/flights");
    return { success: true };
  } catch (error) {
    console.log("catched an error");
    console.log(error);
    return {
      success: false,
      errors: {
        FlightNumber: ["Произошла ошибка при создании рейса"],
      },
      error,
    };
  }
}
