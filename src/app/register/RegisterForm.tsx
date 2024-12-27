"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "./actions";

export default function RegisterForm() {
  const [state, registerAction] = useActionState(register, undefined);

  return (
    <form action={registerAction} className="flex flex-col space-y-4 min-w-16">
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

      <input
        id="firstName"
        name="firstName"
        placeholder="Имя"
        className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {state?.errors?.firstName && (
        <p className="text-red-500">{state.errors.firstName}</p>
      )}

      <input
        id="lastName"
        name="lastName"
        placeholder="Фамилия"
        className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {state?.errors?.lastName && (
        <p className="text-red-500">{state.errors.lastName}</p>
      )}

      <input
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        placeholder="Phone Number"
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {state?.errors?.phoneNumber && (
        <p className="text-red-500">{state.errors.phoneNumber}</p>
      )}

      <input
        id="address"
        name="address"
        placeholder="Address"
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {state?.errors?.address && (
        <p className="text-red-500">{state.errors.address}</p>
      )}

      <input
        id="city"
        name="city"
        placeholder="City"
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {state?.errors?.city && (
        <p className="text-red-500">{state.errors.city}</p>
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
      Зарегистироваться
    </button>
  );
}
