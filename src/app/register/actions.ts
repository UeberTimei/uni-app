"use server";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .trim(),
  phoneNumber: z
    .string()
    .optional()
    .nullable()
    .transform((value) => value ?? undefined)
    .refine((phone) => phone === undefined || /^\+?[\d\s-]{10,}$/.test(phone), {
      message: "Invalid phone number format",
    })
    .refine((phone) => phone === undefined || phone.length <= 20, {
      message: "Phone number must be less than 20 characters",
    }),

  address: z.string().trim().optional().nullable(),

  city: z.string().trim().optional().nullable(),
});

export async function register(prevState: any, formData: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstName, lastName, phoneNumber, address, city } =
    result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return {
      errors: {
        email: ["User already exists"],
      },
    };
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      password,
      name: `${firstName} ${lastName}`,
      customerProfile: {
        create: {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          PhoneNumber: phoneNumber,
          Address: address,
          City: city,
        },
      },
    },
  });

  await createSession(newUser.id, "CLIENT");

  redirect("/");
}
