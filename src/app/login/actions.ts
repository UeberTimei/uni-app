"use server";

import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(user.id, user.role);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
