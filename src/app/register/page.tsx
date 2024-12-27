"use client";

import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <RegisterForm />
        </div>
        <p className="mt-4">
          Есть аккаунт?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}
