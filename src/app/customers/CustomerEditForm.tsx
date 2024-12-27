"use client";

import { useActionState, useEffect } from "react";
import { updateCustomer } from "./actions";

type CustomerEditFormProps = {
  CustomerID: number;
  initialFirstName: string;
  initialLastName: string;
  initialEmail: string;
  initialPhoneNumber: string | null;
  initialAddress: string | null;
  initialCity: string | null;
  onCancel: () => void;
};

export default function CustomerEditForm({
  CustomerID,
  initialFirstName,
  initialLastName,
  initialEmail,
  initialPhoneNumber,
  initialAddress,
  initialCity,
  onCancel,
}: CustomerEditFormProps) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateCustomer, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="CustomerID" value={CustomerID} />

      <div>
        <label
          htmlFor="FirstName"
          className="block text-sm font-medium text-gray-700"
        >
          Имя
        </label>
        <input
          id="FirstName"
          name="FirstName"
          defaultValue={initialFirstName as string}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.FirstName && (
          <p className="mt-1 text-sm text-red-600">{state.errors.FirstName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="LastName"
          className="block text-sm font-medium text-gray-700"
        >
          Фамилия
        </label>
        <input
          id="LastName"
          name="LastName"
          defaultValue={initialLastName}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.LastName && (
          <p className="mt-1 text-sm text-red-600">{state.errors.LastName}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="Email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="Email"
          name="Email"
          defaultValue={initialEmail}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.Email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.Email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="PhoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Номер телефона
        </label>
        <input
          type="tel"
          id="PhoneNumber"
          name="PhoneNumber"
          defaultValue={initialPhoneNumber || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="Address"
          className="block text-sm font-medium text-gray-700"
        >
          Адрес
        </label>
        <input
          type="text"
          id="Address"
          name="Address"
          defaultValue={initialAddress || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="City"
          className="block text-sm font-medium text-gray-700"
        >
          Город
        </label>
        <input
          type="text"
          id="City"
          name="City"
          defaultValue={initialCity || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}
