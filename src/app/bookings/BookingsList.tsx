"use client";

import { useState } from "react";
import BookingsCard from "../components/BookingsCard";
import CreateBookingForm from "./CreateBookingForm";

type SortField =
  | "none"
  | "BookingDate"
  | "CheckInDate"
  | "CheckOutDate"
  | "TotalCost";
type SortOrder = "asc" | "desc";

export type Rating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | null;

type Booking = {
  BookingID: number;
  CustomerID: number;
  FlightID: number;
  HotelID: number;
  TotalCost: number;
  BookingDate: Date;
  CheckInDate: Date;
  CheckOutDate: Date;
};

export type Flight = {
  FlightID: number;
  DepartureAirport: string;
  ArrivalAirport: string;
  DepartureDate: Date;
  ArrivalDate: Date;
  FlightDuration: number;
  FlightNumber: string;
  AirlineCode: string;
};
export type Hotel = {
  HotelID: number;
  HotelName: string;
  StarRating: Rating;
  PricePerNight: number;
  Description: string | null;
  DestinationID: number;
};

function HighlightedText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

function SortButton({
  field,
  label,
  active,
  ascending,
  onClick,
}: {
  field: SortField;
  label: string;
  active: boolean;
  ascending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
        ${
          active
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
    >
      {label}
      {active && field !== "none" && (
        <span className="text-sm">{ascending ? "↑" : "↓"}</span>
      )}
    </button>
  );
}

export function BookingsList({
  initialBookings,
  isCustomerSpecific = false,
}: {
  initialBookings: Booking[];
  isCustomerSpecific?: boolean;
}) {
  const [originalBookings] = useState(initialBookings);
  const [bookings, setBookings] = useState(initialBookings);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSort = (field: SortField) => {
    if (field === "none") {
      setBookings(filterBookings(originalBookings, searchQuery));
      setSortField("none");
      return;
    }

    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";

    const sortedBookings = [...bookings].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (field.includes("Date")) {
        compareA = new Date(a[field]).getTime();
        compareB = new Date(b[field]).getTime();
      }

      if (field === "TotalCost") {
        compareA = Number(a.TotalCost);
        compareB = Number(b.TotalCost);
      }

      if (!compareA) compareA = 0;
      if (!compareB) compareB = 0;

      if (newSortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setBookings(sortedBookings);
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const filterBookings = (bookings: Booking[], query: string) => {
    if (!query.trim())
      return sortField === "none" ? originalBookings : bookings;

    return bookings.filter((booking) => {
      const searchFields = [
        booking.BookingID.toString(),
        booking.CustomerID.toString(),
        booking.FlightID.toString(),
        booking.HotelID.toString(),
        booking.TotalCost.toString(),
      ];

      return searchFields.some((field) =>
        field.toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredBookings = filterBookings(
      sortField === "none" ? originalBookings : bookings,
      query
    );
    setBookings(filteredBookings);
  };

  const handleBookingDelete = (deletedBookingId: number) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.BookingID !== deletedBookingId)
    );
  };

  return (
    <>
      {bookings.length === 1 && (
        <>
          <div className="flex justify-center items-center mb-4">
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Создать бронирование
            </button>
          </div>
          {isCreating && (
            <div className="mb-10">
              <CreateBookingForm onCancel={() => setIsCreating(false)} />
            </div>
          )}
        </>
      )}

      {bookings.length > 1 && (
        <>
          <div className="w-full max-w-4xl mb-6">
            <div className="flex justify-center items-center mb-4">
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Создать бронирование
              </button>
            </div>
            {isCreating ? (
              <div className="mb-6">
                <CreateBookingForm onCancel={() => setIsCreating(false)} />
              </div>
            ) : (
              <div className="w-full max-w-4xl mb-6">
                <input
                  type="text"
                  placeholder="Поиск бронирований..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <SortButton
              field="none"
              label="Без сортировки"
              active={sortField === "none"}
              ascending={true}
              onClick={() => handleSort("none")}
            />
            <SortButton
              field="BookingDate"
              label="По дате бронирования"
              active={sortField === "BookingDate"}
              ascending={sortField === "BookingDate" && sortOrder === "asc"}
              onClick={() => handleSort("BookingDate")}
            />
            <SortButton
              field="CheckInDate"
              label="По дате въезда"
              active={sortField === "CheckInDate"}
              ascending={sortField === "CheckInDate" && sortOrder === "asc"}
              onClick={() => handleSort("CheckInDate")}
            />
            <SortButton
              field="CheckOutDate"
              label="По дате выезда"
              active={sortField === "CheckOutDate"}
              ascending={sortField === "CheckOutDate" && sortOrder === "asc"}
              onClick={() => handleSort("CheckOutDate")}
            />
            <SortButton
              field="TotalCost"
              label="По стоимости"
              active={sortField === "TotalCost"}
              ascending={sortField === "TotalCost" && sortOrder === "asc"}
              onClick={() => handleSort("TotalCost")}
            />
          </div>
        </>
      )}

      <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingsCard
              key={booking.BookingID}
              BookingID={booking.BookingID}
              CustomerID={booking.CustomerID}
              FlightID={booking.FlightID}
              HotelID={booking.HotelID}
              TotalCost={booking.TotalCost}
              BookingDate={booking.BookingDate}
              CheckInDate={booking.CheckInDate}
              CheckOutDate={booking.CheckOutDate}
              onDelete={handleBookingDelete}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            {isCustomerSpecific ? (
              <>
                <span>Пока что Вы ничего не забронировали</span>
                <div className="flex justify-center items-center mb-4 mt-4">
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Создать бронирование
                  </button>
                </div>
                {isCreating && (
                  <div className="mb-6">
                    <CreateBookingForm onCancel={() => setIsCreating(false)} />
                  </div>
                )}
              </>
            ) : (
              "Бронирования не найдены"
            )}
          </div>
        )}
      </div>
    </>
  );
}
