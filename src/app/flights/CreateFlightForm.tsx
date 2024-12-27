"use client";

import { useActionState, useEffect } from "react";
import { createFlight } from "./actions";

export default function CreateFlightForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(createFlight, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4 w-full max-w-4xl">
      <div>
        <label
          htmlFor="DepartureAirport"
          className="block text-sm font-medium text-gray-700"
        >
          Аэропорт вылета
        </label>
        <input
          id="DepartureAirport"
          name="DepartureAirport"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.DepartureAirport && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.DepartureAirport}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="ArrivalAirport"
          className="block text-sm font-medium text-gray-700"
        >
          Аэропорт прибытия
        </label>
        <input
          id="ArrivalAirport"
          name="ArrivalAirport"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.ArrivalAirport && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.ArrivalAirport}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="DepartureDate"
          className="block text-sm font-medium text-gray-700"
        >
          Дата вылета
        </label>
        <input
          type="datetime-local"
          id="DepartureDate"
          name="DepartureDate"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.DepartureDate && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.DepartureDate}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="ArrivalDate"
          className="block text-sm font-medium text-gray-700"
        >
          Дата прибытия
        </label>
        <input
          type="datetime-local"
          id="ArrivalDate"
          name="ArrivalDate"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.ArrivalDate && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.ArrivalDate}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="FlightDuration"
          className="block text-sm font-medium text-gray-700"
        >
          Длительность полета (в часах)
        </label>
        <input
          type="number"
          step="0.1"
          id="FlightDuration"
          name="FlightDuration"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.FlightDuration && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.FlightDuration}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="FlightNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Номер рейса
        </label>
        <input
          id="FlightNumber"
          name="FlightNumber"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.FlightNumber && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.FlightNumber}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="AirlineCode"
          className="block text-sm font-medium text-gray-700"
        >
          Код авиакомпании
        </label>
        <input
          id="AirlineCode"
          name="AirlineCode"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.AirlineCode && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.AirlineCode}
          </p>
        )}
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
          Создать
        </button>
      </div>
    </form>
  );
}
