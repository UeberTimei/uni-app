"use client";

import { useActionState, useEffect, useState } from "react";
import { createBooking } from "./actions";
import { useRole } from "../context";
import { useHotel } from "../hotelContext";

type Rating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";

export default function CreateBookingForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const { role, CustomerID } = useRole();
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(createBooking, initialState);

  const { hotels } = useHotel();
  const [selectedHotel, setSelectedHotel] = useState<
    | {
        HotelID: number;
        HotelName: string;
        StarRating: Rating | null;
        PricePerNight: number;
        Description: string | null;
        DestinationID: number;
      }
    | null
    | undefined
  >(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  useEffect(() => {
    const calculateTotalCost = () => {
      if (!selectedHotel || !checkIn || !checkOut) return;

      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      const differenceInMs = Math.abs(endDate.getTime() - startDate.getTime());

      const daysDifference = differenceInMs / (1000 * 60 * 60 * 24);

      const nights = Math.round(daysDifference) - 1;

      if (nights > 0) {
        setTotalCost(selectedHotel.PricePerNight * nights);
      }
    };

    calculateTotalCost();
  }, [selectedHotel, checkIn, checkOut, totalCost]);

  return (
    <form action={dispatch} className="space-y-4 w-full max-w-4xl">
      {role === "ADMIN" && (
        <div>
          <label
            htmlFor="CustomerID"
            className="block text-sm font-medium text-gray-700"
          >
            CustomerID
          </label>
          <input
            type="number"
            id="CustomerID"
            name="CustomerID"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {state?.errors?.CustomerID && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.CustomerID}
            </p>
          )}
        </div>
      )}
      {role === "CLIENT" && (
        <div className="hidden">
          <label htmlFor="CustomerID" className="hidden">
            ID клиента
          </label>
          <input
            type="number"
            id="CustomerID"
            name="CustomerID"
            className="hidden"
            value={CustomerID === null ? -1 : +CustomerID}
          />
        </div>
      )}

      <div className="hidden">
        <label htmlFor="FlightID" className="hidden">
          ID рейса
        </label>
        <input
          type="number"
          id="FlightID"
          name="FlightID"
          className="hidden"
          value={1}
        />
      </div>

      <div>
        <label
          htmlFor="HotelID"
          className="block text-sm font-medium text-gray-700"
        >
          Отель
        </label>
        <select
          id="HotelID"
          name="HotelID"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          onChange={(e) => {
            const hotel = hotels.find(
              (h) => h.HotelID === parseInt(e.target.value)
            );
            setSelectedHotel(hotel);
          }}
        >
          <option value="">Выберите отель</option>
          {hotels.map((hotel) => (
            <option key={hotel.HotelID} value={hotel.HotelID}>
              {hotel.HotelName} - ${hotel.PricePerNight} за ночь
            </option>
          ))}
        </select>
      </div>

      <div className="hidden">
        <label htmlFor="BookingDate" className="hidden">
          Дата бронирования
        </label>
        <input
          type="datetime-local"
          id="BookingDate"
          name="BookingDate"
          className="hidden"
          value={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div>
        <label
          htmlFor="CheckInDate"
          className="block text-sm font-medium text-gray-700"
        >
          Дата въезда
        </label>
        <input
          type="datetime-local"
          id="CheckInDate"
          name="CheckInDate"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="CheckOutDate"
          className="block text-sm font-medium text-gray-700"
        >
          Дата выезда
        </label>
        <input
          type="datetime-local"
          id="CheckOutDate"
          name="CheckOutDate"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Итоговая стоимость: ${totalCost}
        </label>
        <input type="hidden" name="TotalCost" value={totalCost} />
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
