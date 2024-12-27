import prisma from "@/lib/prisma";
import UsersCard from "../../components/UsersCard";
import { decrypt, getSession } from "@/lib/session";

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}

export default async function User({ params }: { params: { id: string } }) {
  const userIdFromUrl = (await params).id as string;

  const cookie = await getSession();
  const session = await decrypt(cookie);

  if (typeof session?.userId !== "string") {
    return (
      <div className="flex justify-center items-center flex-col p-20">
        <h1 className="text-4xl font-bold mb-6">Ошибка</h1>
        <p>Неверный идентификатор пользователя</p>
      </div>
    );
  }

  if (session.role !== "ADMIN" && session.userId !== userIdFromUrl) {
    return (
      <div className="flex justify-center items-center flex-col p-20">
        <h1 className="text-4xl font-bold mb-6">Доступ запрещен</h1>
        <p>Вы не можете просматривать информацию о других пользователях</p>
      </div>
    );
  }

  const user = await getUser(userIdFromUrl);

  if (!user) {
    return (
      <div className="flex justify-center items-center flex-col p-20">
        <h1 className="text-4xl font-bold mb-6">Ошибка</h1>
        <p>Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col p-20">
      <h1 className="text-4xl font-bold mb-6">Пользователь</h1>
      <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
        <UsersCard
          key={user?.id}
          id={user?.id}
          email={user?.email}
          name={user?.name ?? "CLIENT"}
          role={user?.role}
          password={user?.password}
          createdAt={user?.createdAt}
          updatedAt={user?.updatedAt}
        />
      </div>
    </div>
  );
}
