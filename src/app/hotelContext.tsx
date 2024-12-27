"use client";

import React, { createContext, useContext } from "react";

type Rating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";
interface HotelContextProps {
  hotels: {
    HotelID: number;
    HotelName: string;
    StarRating: Rating | null;
    PricePerNight: number;
    Description: string | null;
    DestinationID: number;
  }[];
}

const HotelContext = createContext<HotelContextProps | undefined>(undefined);

export const HotelProvider: React.FC<
  React.PropsWithChildren<HotelContextProps>
> = ({ children, hotels }) => {
  return (
    <HotelContext.Provider value={{ hotels }}>{children}</HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};
