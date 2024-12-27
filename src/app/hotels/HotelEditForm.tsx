"use client";

import { useActionState, useEffect } from "react";
import { updateHotel } from "./actions";

type HotelEditFormProps = {
  HotelID: number;
  initialHotelName: string;
  initialStarRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";
  initialPricePerNight: number;
  initialDescription: string | null;
  onCancel: () => void;
};

export default function HotelEditForm({
  HotelID,
  initialHotelName,
  initialStarRating,
  initialPricePerNight,
  initialDescription,
  onCancel,
}: HotelEditFormProps) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateHotel, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="HotelID" value={HotelID} />

      <div>
        <label
          htmlFor="HotelName"
          className="block text-sm font-medium text-gray-700"
        >
          Название отеля
        </label>
        <input
          id="HotelName"
          name="HotelName"
          defaultValue={initialHotelName}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.HotelName && (
          <p className="mt-1 text-sm text-red-600">{state.errors.HotelName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="StarRating"
          className="block text-sm font-medium text-gray-700"
        >
          Рейтинг
        </label>
        <select
          id="StarRating"
          name="StarRating"
          defaultValue={initialStarRating}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="ONE">1 звезда</option>
          <option value="TWO">2 звезды</option>
          <option value="THREE">3 звезды</option>
          <option value="FOUR">4 звезды</option>
          <option value="FIVE">5 звезд</option>
          <option value="NULL">Без рейтинга</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="PricePerNight"
          className="block text-sm font-medium text-gray-700"
        >
          Цена за ночь
        </label>
        <input
          type="number"
          id="PricePerNight"
          name="PricePerNight"
          defaultValue={initialPricePerNight}
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
