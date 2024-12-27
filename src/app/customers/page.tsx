import prisma from "@/lib/prisma";
import { CustomersList } from "./CustomersList";

async function getCustomers() {
  const customers = await prisma.customer.findMany();
  return customers;
}

export default async function Customers() {
  const customers = await getCustomers();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Клиенты</h1>
      <CustomersList initialCustomers={customers} />
    </div>
  );
}
