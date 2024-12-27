"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateHotelSchema = z.object({
  HotelID: z.number(),
  HotelName: z.string().min(1, { message: "Название отеля обязательно" }),
  StarRating: z.enum(["ONE", "TWO", "THREE", "FOUR", "FIVE", "NULL"]),
  PricePerNight: z.number().min(0),
  Description: z.string().nullable(),
});

export async function updateHotel(prevState: any, formData: FormData) {
  const HotelID = Number(formData.get("HotelID"));
  const PricePerNight = Number(formData.get("PricePerNight"));

  const result = updateHotelSchema.safeParse({
    HotelID,
    HotelName: formData.get("HotelName"),
    StarRating: formData.get("StarRating"),
    PricePerNight,
    Description: formData.get("Description") || null,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.hotel.update({
      where: { HotelID },
      data: {
        HotelName: result.data.HotelName,
        StarRating:
          result.data.StarRating === "NULL" ? null : result.data.StarRating,
        PricePerNight: result.data.PricePerNight,
        Description: result.data.Description,
      },
    });

    revalidatePath("/hotels");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        HotelName: ["Произошла ошибка при обновлении отеля"],
      },
      error,
    };
  }
}

export async function deleteHotel(prevState: any, formData: FormData) {
  const HotelID = Number(formData.get("HotelID"));

  if (!HotelID || isNaN(HotelID)) {
    return {
      success: false,
      error: "Invalid hotel ID",
    };
  }

  try {
    await prisma.hotel.delete({
      where: { HotelID },
    });
    return { success: true };
  } catch (error) {
    console.error("Delete hotel error:", error);
    return `Failed to delete hotel: ${error || "Unknown error"}`;
  }
}

const RatingEnum = z.enum(["ONE", "TWO", "THREE", "FOUR", "FIVE"]);

const hotelSchema = z.object({
  HotelName: z
    .string()
    .min(1, "Название отеля обязательно")
    .max(150, "Имя отеля должно быть не более 150 символов"),
  StarRating: RatingEnum,
  PricePerNight: z
    .number()
    .positive("Цена за ночь должна быть положительным числом"),
  Description: z.string().nullable(),
  DestinationID: z
    .number()
    .int()
    .positive("Destination ID должно быть положительным числом"),
});

export async function createHotel(prevState: any, formData: FormData) {
  const result = hotelSchema.safeParse({
    HotelName: formData.get("HotelName"),
    StarRating: formData.get("StarRating"),
    PricePerNight: Number(formData.get("PricePerNight")),
    Description: formData.get("Description") || null,
    DestinationID: Number(formData.get("DestinationID")),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.hotel.create({
      data: {
        HotelName: result.data.HotelName,
        StarRating: result.data.StarRating,
        PricePerNight: result.data.PricePerNight,
        Description: result.data.Description,
        DestinationID: Number(formData.get("DestinationID")),
      },
    });

    revalidatePath("/hotels");
    return { success: true };
  } catch (error) {
    console.error("Create hotel error:", error);
    return {
      success: false,
      errors: {
        HotelName: ["Произошла ошибка при создании отеля"],
      },
      error,
    };
  }
}
