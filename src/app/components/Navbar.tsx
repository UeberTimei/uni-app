"use client";

// import { getSession } from "@/lib/session";
import Link from "next/link";
import { logout } from "../login/actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  initialSession: boolean;
  role: "CLIENT" | "ADMIN" | "NONE";
  id: string;
}

const Navbar = ({ initialSession, role, id }: NavbarProps) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(initialSession);

  useEffect(() => {
    setIsLoggedIn(initialSession);
  }, [initialSession]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-green-800 p-4 z-10 absolute w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/">Туристический оператор</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="text-white hover:text-gray-400">
              Главная
            </Link>
          </li>
          {role === "ADMIN" && (
            <>
              <li>
                <Link href="/users" className="text-white hover:text-gray-400">
                  Пользователи
                </Link>
              </li>
              <li>
                <Link
                  href="/customers"
                  className="text-white hover:text-gray-400"
                >
                  Клиенты
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="text-white hover:text-gray-400"
                >
                  Бронирования
                </Link>
              </li>
              <li>
                <Link
                  href="/flights"
                  className="text-white hover:text-gray-400"
                >
                  Рейсы
                </Link>
              </li>
            </>
          )}

          {role === "CLIENT" && (
            <>
              <li>
                <Link
                  href={`/users/${id}`}
                  className="text-white hover:text-gray-400"
                >
                  Пользователь
                </Link>
              </li>
              <li>
                <Link
                  href={`/bookings/${id}`}
                  className="text-white hover:text-gray-400"
                >
                  Бронирования
                </Link>
              </li>
            </>
          )}

          <li>
            <Link href="/reviews" className="text-white hover:text-gray-400">
              Отзывы
            </Link>
          </li>
          <li>
            <Link href="/hotels" className="text-white hover:text-gray-400">
              Отели
            </Link>
          </li>
          <li>
            <Link
              href="/destinations"
              className="text-white hover:text-gray-400"
            >
              Направления
            </Link>
          </li>
          <li>
            <Link href="/activities" className="text-white hover:text-gray-400">
              Активности
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <a
                onClick={handleLogout}
                className="p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                Выйти
              </a>
            ) : (
              <Link
                href="/login"
                className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Войти
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
