"use client";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Вход</h1>
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <LoginForm />
        </div>
        <p className="mt-4">
          Нет аккаунта?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
}
