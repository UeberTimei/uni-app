"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateBookingSchema = z.object({
  BookingID: z.number(),
  FlightID: z
    .number()
    .positive({ message: "ID рейса должен быть положительным числом" }),
  HotelID: z
    .number()
    .positive({ message: "ID отеля должен быть положительным числом" }),
  TotalCost: z.number().positive({ message: "Цена должна быть положительной" }),
});

export async function updateBooking(prevState: any, formData: FormData) {
  const BookingID = Number(formData.get("BookingID"));
  const FlightID = Number(formData.get("FlightID"));
  const HotelID = Number(formData.get("HotelID"));
  const TotalCost = Number(formData.get("TotalCost"));

  const result = updateBookingSchema.safeParse({
    BookingID,
    FlightID,
    HotelID,
    TotalCost,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const flight = await prisma.flight.findUnique({
      where: { FlightID: result.data.FlightID },
    });

    if (!flight) {
      return {
        success: false,
        errors: {
          FlightID: ["Рейс с таким ID не существует"],
        },
      };
    }

    const hotel = await prisma.hotel.findUnique({
      where: { HotelID: result.data.HotelID },
    });

    if (!hotel) {
      return {
        success: false,
        errors: {
          HotelID: ["Отель с таким ID не существует"],
        },
      };
    }

    await prisma.booking.update({
      where: { BookingID },
      data: {
        FlightID: result.data.FlightID,
        HotelID: result.data.HotelID,
        TotalCost: result.data.TotalCost,
      },
    });

    revalidatePath("/bookings");
    revalidatePath(`/bookings/${BookingID}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        form: ["Произошла ошибка при обновлении бронирования " + error],
        HotelID: ["Не существует такого отеля"],
        FlightID: ["Не существует такого рейса"],
        TotalCost: ["Цена должна быть положительной"],
      },
    };
  }
}

export async function deleteBooking(prevState: any, formData: FormData) {
  const BookingID = Number(formData.get("BookingID"));

  if (!BookingID || isNaN(BookingID)) {
    return {
      success: false,
      error: "Invalid booking ID",
    };
  }

  try {
    await prisma.booking.delete({
      where: { BookingID },
    });
    revalidatePath("/bookings");
    return { success: true };
  } catch (error) {
    console.error("Delete booking error:", error);
    return {
      success: false,
      error: `Failed to delete booking: ${error || "Unknown error"}`,
    };
  }
}

const createBookingSchema = z.object({
  CustomerID: z
    .number()
    .positive({ message: "ID клиента должен быть положительным числом" }),
  FlightID: z
    .number()
    .positive({ message: "ID рейса должен быть положительным числом" }),
  HotelID: z
    .number()
    .positive({ message: "ID отеля должен быть положительным числом" }),
  TotalCost: z.number().positive({ message: "Цена должна быть положительной" }),
  BookingDate: z
    .string()
    .refine((str) => str === "" || !isNaN(Date.parse(str)), {
      message: "Дата должна быть в формате ISO",
    })
    .transform((str) => (str ? new Date(str) : null)),
  CheckInDate: z
    .string()
    .refine((str) => str === "" || !isNaN(Date.parse(str)), {
      message: "Дата должна быть в формате ISO",
    })
    .transform((str) => (str ? new Date(str) : null)),
  CheckOutDate: z
    .string()
    .refine((str) => str === "" || !isNaN(Date.parse(str)), {
      message: "Дата должна быть в формате ISO",
    })
    .transform((str) => (str ? new Date(str) : null)),
});

export async function createBooking(prevState: any, formData: FormData) {
  if (
    !formData.get("CustomerID") ||
    Number(formData.get("CustomerID")) === -1
  ) {
    return {
      success: false,
      errors: {
        CheckOutDate: ["ID клиента обязательно"],
      },
    };
  }
  const flights = await prisma.flight.findMany({
    select: { FlightID: true },
  });

  let flightId: number | null = null;

  if (flights.length > 0) {
    const randomIndex = Math.floor(Math.random() * flights.length);
    flightId = flights[randomIndex].FlightID;
  } else {
    flightId = 1;
  }

  const result = createBookingSchema.safeParse({
    CustomerID: Number(formData.get("CustomerID")),
    FlightID: Number(flightId === null ? 1 : flightId),
    HotelID: Number(formData.get("HotelID")),
    TotalCost: Number(formData.get("TotalCost")),
    BookingDate: formData.get("BookingDate"),
    CheckInDate: formData.get("CheckInDate"),
    CheckOutDate: formData.get("CheckOutDate"),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const hotel = await prisma.hotel.findUnique({
      where: { HotelID: result.data.HotelID },
    });

    if (!hotel) {
      return {
        success: false,
        errors: {
          HotelID: ["Отель с таким ID не существует"],
        },
      };
    }

    await prisma.booking.create({
      data: {
        CustomerID: result.data.CustomerID,
        FlightID: result.data.FlightID,
        HotelID: result.data.HotelID,
        TotalCost: result.data.TotalCost,
        BookingDate: new Date(String(result.data.BookingDate)),
        CheckInDate: new Date(String(result.data.CheckInDate)),
        CheckOutDate: new Date(String(result.data.CheckOutDate)),
      },
    });

    revalidatePath("/bookings");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        form: ["Произошла ошибка при создании бронирования: " + error],
      },
    };
  }
}
