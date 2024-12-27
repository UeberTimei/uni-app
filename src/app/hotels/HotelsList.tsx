"use client";

import { useState } from "react";
import HotelsCard from "../components/HotelsCard";
import CreateHotelForm from "./CreateHotelForm";
import { useRole } from "../context";

type SortField = "none" | "HotelName" | "StarRating" | "PricePerNight";
type SortOrder = "asc" | "desc";

type Rating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";

type Hotel = {
  HotelID: number;
  HotelName: string;
  StarRating: Rating | null;
  PricePerNight: number;
  Description: string | null;
  DestinationID: number;
};

type HotelWithMappedRating = Omit<Hotel, "StarRating"> & {
  StarRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";
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

export function HotelsList({ initialHotels }: { initialHotels: Hotel[] }) {
  const mappedInitialHotels: HotelWithMappedRating[] = initialHotels.map(
    (hotel) => ({
      ...hotel,
      StarRating: hotel.StarRating || "NULL",
    })
  );

  const { role } = useRole();

  const [originalHotels] = useState(mappedInitialHotels);
  const [hotels, setHotels] = useState(mappedInitialHotels);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const convertRatingToNumber = (textRating: string) => {
    const ratingMap = {
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
      NULL: 0,
    };

    return ratingMap[textRating as keyof typeof ratingMap] || 0;
  };

  const handleSort = (field: SortField) => {
    if (field === "none") {
      setHotels(filterHotels(originalHotels, searchQuery));
      setSortField("none");
      return;
    }

    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";

    const sortedHotels = [...hotels].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (field === "StarRating") {
        compareA = convertRatingToNumber(a.StarRating);
        compareB = convertRatingToNumber(b.StarRating);
      }

      if (field === "PricePerNight") {
        compareA = Number(compareA) || 0;
        compareB = Number(compareB) || 0;
      }

      if (!compareA) compareA = 0;
      if (!compareB) compareB = 0;

      if (newSortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setHotels(sortedHotels);
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const filterHotels = (hotels: HotelWithMappedRating[], query: string) => {
    if (!query.trim()) return sortField === "none" ? originalHotels : hotels;

    return hotels.filter(
      (hotel) =>
        hotel.HotelName.toLowerCase().includes(query.toLowerCase()) ||
        (hotel.Description?.toLowerCase().includes(query.toLowerCase()) ??
          false)
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredHotels = filterHotels(
      sortField === "none" ? originalHotels : hotels,
      query
    );
    setHotels(filteredHotels);
  };

  const handleHotelDelete = (deletedHotelId: number) => {
    setHotels((prevHotels) =>
      prevHotels.filter((hotel) => hotel.HotelID !== deletedHotelId)
    );
  };

  return (
    <>
      <div className="w-full max-w-4xl mb-6">
        <div className="flex justify-center items-center mb-4">
          {role === "ADMIN" && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Создать отель
            </button>
          )}
        </div>
        {isCreating ? (
          <div className="mb-6">
            <CreateHotelForm onCancel={() => setIsCreating(false)} />
          </div>
        ) : (
          <input
            type="text"
            placeholder="Поиск отелей..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {!isCreating && (
        <>
          <div className="flex gap-4 mb-6">
            <SortButton
              field="none"
              label="Без сортировки"
              active={sortField === "none"}
              ascending={true}
              onClick={() => handleSort("none")}
            />
            <SortButton
              field="HotelName"
              label="Сортировка по названию"
              active={sortField === "HotelName"}
              ascending={sortField === "HotelName" && sortOrder === "asc"}
              onClick={() => handleSort("HotelName")}
            />
            <SortButton
              field="StarRating"
              label="Сортировка по рейтингу"
              active={sortField === "StarRating"}
              ascending={sortField === "StarRating" && sortOrder === "asc"}
              onClick={() => handleSort("StarRating")}
            />
            <SortButton
              field="PricePerNight"
              label="Сортировка по цене"
              active={sortField === "PricePerNight"}
              ascending={sortField === "PricePerNight" && sortOrder === "asc"}
              onClick={() => handleSort("PricePerNight")}
            />
          </div>

          <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <HotelsCard
                  key={hotel.HotelID}
                  HotelID={hotel.HotelID}
                  HotelName={
                    <HighlightedText
                      text={hotel.HotelName}
                      highlight={searchQuery}
                    />
                  }
                  StarRating={hotel.StarRating || "NULL"}
                  PricePerNight={hotel.PricePerNight}
                  Description={
                    <HighlightedText
                      text={hotel.Description ?? ""}
                      highlight={searchQuery}
                    />
                  }
                  onDelete={handleHotelDelete}
                />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                Отели не найдены.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
