"use client";

import { useActionState, useEffect } from "react";
import { updateDestination } from "./actions";

type DestinationEditFormProps = {
  DestinationID: number;
  initialCountryName: string;
  initialCityName: string;
  initialDescription: string | null;
  initialAverageTemperature: number | null;
  initialCurrency: string | null;
  onCancel: () => void;
};

export default function DestinationEditForm({
  DestinationID,
  initialCountryName,
  initialCityName,
  initialDescription,
  initialAverageTemperature,
  initialCurrency,
  onCancel,
}: DestinationEditFormProps) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateDestination, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="DestinationID" value={DestinationID} />

      <div>
        <label
          htmlFor="CountryName"
          className="block text-sm font-medium text-gray-700"
        >
          Страна
        </label>
        <input
          id="CountryName"
          name="CountryName"
          defaultValue={initialCountryName}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="CityName"
          className="block text-sm font-medium text-gray-700"
        >
          Город
        </label>
        <input
          id="CityName"
          name="CityName"
          defaultValue={initialCityName}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="AverageTemperature"
          className="block text-sm font-medium text-gray-700"
        >
          Средняя температура
        </label>
        <input
          type="number"
          step="0.1"
          id="AverageTemperature"
          name="AverageTemperature"
          defaultValue={initialAverageTemperature || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="Currency"
          className="block text-sm font-medium text-gray-700"
        >
          Валюта
        </label>
        <input
          id="Currency"
          name="Currency"
          defaultValue={initialCurrency || ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="Description"
          className="block text-sm font-medium text-gray-700"
        >
          Описание
        </label>
        <textarea
          id="Description"
          name="Description"
          defaultValue={initialDescription || ""}
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
