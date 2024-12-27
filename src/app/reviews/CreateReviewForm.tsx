"use client";

import { useActionState, useEffect, useState } from "react";
import { useRole } from "../context";
import { useBooking } from "../bookingContext";
import { createReview } from "./actions";

export default function CreateReviewForm() {
  const { role, CustomerID } = useRole();
  const [isCreating, setIsCreating] = useState(false);

  const { bookings } = useBooking();
  const [selectedBooking, setSelectedBooking] = useState("");

  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(createReview, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  if (!bookings || bookings.length === 0) {
    return null;
  }

  return (
    <>
      {role === "CLIENT" && (
        <div className="w-full max-w-4xl mb-6">
          <div className="flex justify-center items-center my-4">
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Оставить отзыв
              </button>
            )}
          </div>

          {isCreating && (
            <form action={dispatch} className="space-y-4 w-full max-w-4xl">
              <input
                type="hidden"
                name="CustomerID"
                value={CustomerID ? CustomerID : -1}
              />

              <div>
                <label
                  htmlFor="BookingID"
                  className="block text-sm font-medium text-gray-700"
                >
                  Выберите бронирование
                </label>
                <select
                  id="BookingID"
                  name="BookingID"
                  value={selectedBooking}
                  onChange={(e) => setSelectedBooking(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите бронирование</option>
                  {bookings.map((booking) => (
                    <option key={booking.BookingID} value={booking.BookingID}>
                      {booking?.Hotel.HotelName} -{" "}
                      {new Date(booking.CheckInDate).toLocaleDateString(
                        "ru-RU"
                      )}
                    </option>
                  ))}
                </select>
                {state?.errors?.BookingID && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.BookingID}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="Rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Оценка
                </label>
                <select
                  id="Rating"
                  name="Rating"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите оценку</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
                {state?.errors?.Rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.Rating}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="Comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Комментарий
                </label>
                <textarea
                  id="Comment"
                  name="Comment"
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
                {state?.errors?.Comment && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors.Comment}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отправить отзыв
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
