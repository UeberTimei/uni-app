"use client";

import { useActionState, useEffect } from "react";
import { updateBooking } from "./actions";

type BookingEditFormProps = {
  BookingID: number;
  initialFlightID: number;
  initialHotelID: number;
  initialTotalCost: number;
  onCancel: () => void;
};

export default function BookingEditForm({
  BookingID,
  initialFlightID,
  initialHotelID,
  initialTotalCost,
  onCancel,
}: BookingEditFormProps) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateBooking, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="BookingID" value={BookingID} />

      <div>
        <label
          htmlFor="FlightID"
          className="block text-sm font-medium text-gray-700"
        >
          ID рейса
        </label>
        <input
          type="number"
          id="FlightID"
          name="FlightID"
          defaultValue={initialFlightID}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.FlightID && (
          <p className="mt-1 text-sm text-red-600">{state.errors.FlightID}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="HotelID"
          className="block text-sm font-medium text-gray-700"
        >
          ID отеля
        </label>
        <input
          type="number"
          id="HotelID"
          name="HotelID"
          defaultValue={initialHotelID}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.HotelID && (
          <p className="mt-1 text-sm text-red-600">{state.errors.HotelID}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="TotalCost"
          className="block text-sm font-medium text-gray-700"
        >
          Конечная цена
        </label>
        <input
          type="number"
          step="0.01"
          id="TotalCost"
          name="TotalCost"
          defaultValue={initialTotalCost}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.TotalCost && (
          <p className="mt-1 text-sm text-red-600">{state.errors.TotalCost}</p>
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
          Сохранить
        </button>
      </div>
    </form>
  );
}
