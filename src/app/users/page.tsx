import prisma from "@/lib/prisma";
import { UsersList } from "./UsersList";

async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export default async function Users() {
  const users = await getUsers();

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Пользователи</h1>
      <UsersList initialUsers={users} />
    </div>
  );
}
