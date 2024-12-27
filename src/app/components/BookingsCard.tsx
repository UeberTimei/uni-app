"use client";

import { useState } from "react";
import { useActionState } from "react";
import BookingEditForm from "../bookings/BookingEditForm";
import { deleteBooking } from "../bookings/actions";

type BookingsProps = {
  BookingID: number;
  CustomerID: number;
  FlightID: number;
  HotelID: number;
  TotalCost: number;
  BookingDate: Date;
  CheckInDate: Date;
  CheckOutDate: Date;
  onDelete?: (BookingID: number) => void;
};

export default function BookingsCard({
  BookingID,
  CustomerID,
  FlightID,
  HotelID,
  TotalCost,
  BookingDate,
  CheckInDate,
  CheckOutDate,
  onDelete,
}: BookingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, deleteBookingAction] = useActionState(deleteBooking, undefined);

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить это бронирование?")) {
      const formData = new FormData();
      formData.append("BookingID", BookingID.toString());
      deleteBookingAction(formData);

      if (error) {
        alert("Ошибка при удалении бронирования");
      }
      if (onDelete) {
        onDelete(BookingID);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6">
        <BookingEditForm
          BookingID={BookingID}
          initialFlightID={FlightID}
          initialHotelID={HotelID}
          initialTotalCost={TotalCost}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold mb-4">Детали брони</h2>
        <div className="text-gray-700 space-y-2">
          <div>
            <strong>Booking ID:</strong> {BookingID}
          </div>
          <div>
            <strong>Customer ID:</strong> {CustomerID}
          </div>
          <div>
            <strong>Flight ID:</strong> {FlightID}
          </div>
          <div>
            <strong>Hotel ID:</strong> {HotelID}
          </div>
          <div>
            <strong>Конечная цена:</strong> ${TotalCost.toFixed(2)}
          </div>
          <div>
            <strong>Дата бронирования:</strong>{" "}
            {BookingDate.toLocaleDateString("ru")}
          </div>
          <div>
            <strong>Дата въезда:</strong> {CheckInDate.toLocaleDateString("ru")}
          </div>
          <div>
            <strong>Дата выезда:</strong>{" "}
            {CheckOutDate.toLocaleDateString("ru")}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 flex justify-between items-center">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => setIsEditing(true)}
        >
          Изменить
        </button>
        <button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
          onClick={handleDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
