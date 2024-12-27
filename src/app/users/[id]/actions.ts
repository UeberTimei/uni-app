"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateUserSchema = z
  .object({
    id: z.string(),
    firstName: z.string().min(1, { message: "Имя обязательно" }),
    lastName: z.string(),
    email: z.string().email({ message: "Неверный формат email" }).trim(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password !== undefined && data.password !== "") {
        return data.password.length >= 8;
      }
      return true;
    },
    {
      message: "Пароль должен быть не менее 8 символов",
      path: ["password"],
    }
  );

export async function updateUser(prevState: any, formData: FormData) {
  const result = updateUserSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { id, firstName, lastName, email, password } = result.data;

  try {
    const updateData: any = {
      name: `${firstName} ${lastName}`.trim(),
      email,
    };

    if (password) {
      updateData.password = password;
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error.code === "P2002") {
      return {
        success: false,
        errors: {
          email: ["Этот email уже используется"],
        },
      };
    }

    return {
      success: false,
      errors: {
        email: ["Произошла ошибка при обновлении пользователя"],
      },
    };
  }
}

export async function deleteUser(prevState: any, formData: FormData) {
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return {
      success: false,
      error: "Invalid user ID",
    };
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return `Failed to delete user: ${error || "Unknown error"}`;
  }
}
