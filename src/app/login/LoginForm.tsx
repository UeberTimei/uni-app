"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";

export default function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form action={loginAction} className="flex flex-col space-y-4">
      <input
        id="email"
        name="email"
        placeholder="example@mail.com"
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {state?.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Пароль"
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="p-3 bg-blue-500 text-white rounded-md"
      disabled={pending}
      type="submit"
    >
      Войти
    </button>
  );
}
