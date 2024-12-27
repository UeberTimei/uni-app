"use client";

import { useState } from "react";
import DestinationsCard from "../components/DestinationsCard";
import CreateDestinationForm from "./CreateDestinationForm";
import { useRole } from "../context";
import HighlightedText from "../components/HighlightedText";
import SortButton from "../components/SortButton";

type SortField =
  | "none"
  | "CountryName"
  | "CityName"
  | "AverageTemperature"
  | "Currency";
type SortOrder = "asc" | "desc";

type Destination = {
  DestinationID: number;
  CountryName: string;
  CityName: string;
  Description: string | null;
  AverageTemperature: number | null;
  Currency: string | null;
};

export function DestinationsList({
  initialDestinations,
}: {
  initialDestinations: Destination[];
}) {
  const { role } = useRole();

  const [originalDestinations] = useState(initialDestinations);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const sortDestinations = (
    destinations: Destination[],
    field: SortField,
    order: SortOrder
  ) => {
    if (field === "none") return [...destinations];

    return [...destinations].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (field === "AverageTemperature") {
        compareA = Number(compareA) || -Infinity;
        compareB = Number(compareB) || -Infinity;
      }

      if (!compareA) compareA = 0;
      if (!compareB) compareB = 0;

      if (order === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  const filterDestinations = (destinations: Destination[], query: string) => {
    if (!query.trim()) return destinations;

    return destinations.filter(
      (destination) =>
        destination.CountryName.toLowerCase().includes(query.toLowerCase()) ||
        destination.CityName.toLowerCase().includes(query.toLowerCase()) ||
        (destination.Description?.toLowerCase().includes(query.toLowerCase()) ??
          false)
    );
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      const sorted = sortDestinations(
        filterDestinations(originalDestinations, searchQuery),
        field,
        newOrder
      );
      setDestinations(sorted);
    } else {
      setSortField(field);
      setSortOrder("asc");
      const sorted = sortDestinations(
        filterDestinations(originalDestinations, searchQuery),
        field,
        "asc"
      );
      setDestinations(sorted);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = filterDestinations(originalDestinations, query);
    const sorted = sortDestinations(filtered, sortField, sortOrder);
    setDestinations(sorted);
  };

  const handleDestinationDelete = (deletedDestinationId: number) => {
    const updatedOriginal = originalDestinations.filter(
      (destination) => destination.DestinationID !== deletedDestinationId
    );
    const updatedFiltered = filterDestinations(updatedOriginal, searchQuery);
    const sorted = sortDestinations(updatedFiltered, sortField, sortOrder);

    setDestinations(sorted);
  };

  return (
    <>
      <div className="flex justify-center items-center mb-4">
        {role === "ADMIN" && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Создать направление
          </button>
        )}
      </div>
      {isCreating ? (
        <div className="mb-6">
          <CreateDestinationForm onCancel={() => setIsCreating(false)} />
        </div>
      ) : (
        <div className="w-full max-w-4xl mb-6">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

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
              field="CountryName"
              label="Сортировка по стране"
              active={sortField === "CountryName"}
              ascending={sortField === "CountryName" && sortOrder === "asc"}
              onClick={() => handleSort("CountryName")}
            />
            <SortButton
              field="CityName"
              label="Сортировка по городу"
              active={sortField === "CityName"}
              ascending={sortField === "CityName" && sortOrder === "asc"}
              onClick={() => handleSort("CityName")}
            />
            <SortButton
              field="AverageTemperature"
              label="Сортировка по температуре"
              active={sortField === "AverageTemperature"}
              ascending={
                sortField === "AverageTemperature" && sortOrder === "asc"
              }
              onClick={() => handleSort("AverageTemperature")}
            />
            <SortButton
              field="Currency"
              label="Сортировка по валюте"
              active={sortField === "Currency"}
              ascending={sortField === "Currency" && sortOrder === "asc"}
              onClick={() => handleSort("Currency")}
            />
          </div>

          <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
            {destinations.length > 0 ? (
              destinations.map((destination) => (
                <DestinationsCard
                  key={destination.DestinationID}
                  DestinationID={destination.DestinationID}
                  CountryName={
                    <HighlightedText
                      text={destination.CountryName}
                      highlight={searchQuery}
                    />
                  }
                  CityName={
                    <HighlightedText
                      text={destination.CityName}
                      highlight={searchQuery}
                    />
                  }
                  Description={
                    <HighlightedText
                      text={destination.Description ?? ""}
                      highlight={searchQuery}
                    />
                  }
                  AverageTemperature={+(destination.AverageTemperature ?? 0)}
                  Currency={destination.Currency ?? ""}
                  onDelete={handleDestinationDelete}
                />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                Не найдено направлений.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
