"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type Rating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";

const reviewSchema = z.object({
  CustomerID: z.number(),
  BookingID: z.number(),
  Rating: z.number().min(1).max(5),
  Comment: z.string().optional(),
  ReviewDate: z
    .string()
    .refine((str) => str === "" || !isNaN(Date.parse(str)), {
      message: "Дата должна быть в формате ISO",
    })
    .transform((str) => (str ? new Date(str) : null)),
});

export async function createReview(prevState: any, formData: FormData) {
  const result = reviewSchema.safeParse({
    CustomerID: Number(formData.get("CustomerID")),
    BookingID: Number(formData.get("BookingID")),
    Rating: Number(formData.get("Rating")),
    Comment: formData.get("Comment"),
    ReviewDate: new Date().toISOString(),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const ratingMap: { [key: number]: Rating } = {
    1: "ONE",
    2: "TWO",
    3: "THREE",
    4: "FOUR",
    5: "FIVE",
  };

  try {
    await prisma.review.create({
      data: {
        CustomerID: result.data.CustomerID,
        BookingID: result.data.BookingID,
        Rating: ratingMap[result.data.Rating],
        Comment: result.data.Comment || "",
        ReviewDate: new Date(String(result.data.ReviewDate)),
      },
    });

    revalidatePath("/reviews");
    return { success: true };
  } catch (error) {
    console.error("Create review error:", error);
    return {
      success: false,
      errors: {
        form: ["Произошла ошибка при создании отзыва"],
      },
    };
  }
}
