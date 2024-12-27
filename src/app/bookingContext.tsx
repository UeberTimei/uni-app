"use client";

import React, { createContext, useContext } from "react";

type Rating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";

interface BookingContextProps {
  bookings: {
    BookingID: number;
    CustomerID: number;
    FlightID: number;
    HotelID: number;
    TotalCost: number;
    BookingDate: Date;
    CheckInDate: Date;
    CheckOutDate: Date;
    Hotel: {
      HotelID: number;
      HotelName: string;
      StarRating: Rating | null;
      PricePerNight: number;
      Description: string | null;
      DestinationID: number;
    };
  }[];
}

const BookingContext = createContext<BookingContextProps | undefined>(
  undefined
);

export const BookingProvider: React.FC<
  React.PropsWithChildren<BookingContextProps>
> = ({ children, bookings }) => {
  return (
    <BookingContext.Provider value={{ bookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
