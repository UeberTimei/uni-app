"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updateCustomerSchema = z.object({
  CustomerID: z.number(),
  FirstName: z.string().min(1, { message: "Имя обязательно" }),
  LastName: z.string(),
  Email: z.string().email({ message: "Неверный формат email" }).trim(),
  PhoneNumber: z.string().nullable(),
  Address: z.string().nullable(),
  City: z.string().nullable(),
});

export async function updateCustomer(prevState: any, formData: FormData) {
  const CustomerID = Number(formData.get("CustomerID"));

  console.log(formData.get("FirstName"));
  const result = updateCustomerSchema.safeParse({
    CustomerID,
    FirstName: formData.get("FirstName"),
    LastName: formData.get("LastName"),
    Email: formData.get("Email"),
    PhoneNumber: formData.get("PhoneNumber") || null,
    Address: formData.get("Address") || null,
    City: formData.get("City") || null,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.customer.update({
      where: { CustomerID },
      data: {
        FirstName: result.data.FirstName,
        LastName: result.data.LastName,
        Email: result.data.Email,
        PhoneNumber: result.data.PhoneNumber,
        Address: result.data.Address,
        City: result.data.City,
        User: {
          update: {
            name: result.data.FirstName + " " + result.data.LastName,
          },
        },
      },
    });

    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    if (error.code === "P2002") {
      return {
        success: false,
        errors: {
          Email: ["Этот email уже используется"],
        },
      };
    }

    return {
      success: false,
      errors: {
        Email: ["Произошла ошибка при обновлении клиента"],
      },
    };
  }
}

export async function deleteCustomer(prevState: any, formData: FormData) {
  const CustomerID = Number(formData.get("CustomerID"));

  if (!CustomerID || isNaN(CustomerID)) {
    return {
      success: false,
      error: "Invalid customer ID",
    };
  }

  try {
    const user = await prisma.customer.findUnique({
      where: { CustomerID },
      select: { UserId: true },
    });
    await prisma.customer.delete({
      where: { CustomerID },
    });
    await prisma.user.delete({
      where: {
        id: user?.UserId,
      },
    });
    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    console.error("Delete customer error:", error);
    return `Failed to delete customer: ${error || "Unknown error"}`;
  }
}
