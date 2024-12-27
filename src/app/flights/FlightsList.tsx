"use client";

import { useState } from "react";
import FlightsCard from "../components/FlightsCard";
import CreateFlightForm from "./CreateFlightForm";
import { useRole } from "../context";

type SortField =
  | "none"
  | "FlightNumber"
  | "DepartureDate"
  | "FlightDuration"
  | "AirlineCode";
type SortOrder = "asc" | "desc";

type Flight = {
  FlightID: number;
  DepartureAirport: string;
  ArrivalAirport: string;
  DepartureDate: Date;
  ArrivalDate: Date;
  FlightDuration: number;
  FlightNumber: string;
  AirlineCode: string;
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

export function FlightsList({ initialFlights }: { initialFlights: Flight[] }) {
  const { role } = useRole();

  const [originalFlights, setOriginalFlights] = useState(initialFlights);
  const [flights, setFlights] = useState(initialFlights);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSort = (field: SortField) => {
    if (field === "none") {
      setFlights(filterFlights(originalFlights, searchQuery));
      setSortField("none");
      return;
    }

    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";

    const sortedFlights = [...flights].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (field === "DepartureDate") {
        compareA = new Date(a.DepartureDate).getTime();
        compareB = new Date(b.DepartureDate).getTime();
      }

      if (field === "FlightDuration") {
        compareA = Number(a.FlightDuration);
        compareB = Number(b.FlightDuration);
      }

      if (!compareA) compareA = 0;
      if (!compareB) compareB = 0;

      if (newSortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setFlights(sortedFlights);
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const filterFlights = (flights: Flight[], query: string) => {
    if (!query.trim()) return sortField === "none" ? originalFlights : flights;

    return flights.filter(
      (flight) =>
        flight.FlightNumber.toLowerCase().includes(query.toLowerCase()) ||
        flight.DepartureAirport.toLowerCase().includes(query.toLowerCase()) ||
        flight.ArrivalAirport.toLowerCase().includes(query.toLowerCase()) ||
        flight.AirlineCode.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredFlights = filterFlights(
      sortField === "none" ? originalFlights : flights,
      query
    );
    setFlights(filteredFlights);
  };

  const handleFlightDelete = (deletedFlightId: number) => {
    setFlights((prevFlights) =>
      prevFlights.filter((flight) => flight.FlightID !== deletedFlightId)
    );
    setOriginalFlights((prevFlights) =>
      prevFlights.filter((flight) => flight.FlightID !== deletedFlightId)
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
              Создать рейс
            </button>
          )}
        </div>
        {isCreating ? (
          <div className="mb-6">
            <CreateFlightForm onCancel={() => setIsCreating(false)} />
          </div>
        ) : (
          <input
            type="text"
            placeholder="Поиск рейсов..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {!isCreating && (
        <>
          <div className="flex gap-4 mb-6 flex-wrap">
            <SortButton
              field="none"
              label="Без сортировки"
              active={sortField === "none"}
              ascending={true}
              onClick={() => handleSort("none")}
            />
            <SortButton
              field="FlightNumber"
              label="По номеру рейса"
              active={sortField === "FlightNumber"}
              ascending={sortField === "FlightNumber" && sortOrder === "asc"}
              onClick={() => handleSort("FlightNumber")}
            />
            <SortButton
              field="DepartureDate"
              label="По дате вылета"
              active={sortField === "DepartureDate"}
              ascending={sortField === "DepartureDate" && sortOrder === "asc"}
              onClick={() => handleSort("DepartureDate")}
            />
            <SortButton
              field="FlightDuration"
              label="По длительности"
              active={sortField === "FlightDuration"}
              ascending={sortField === "FlightDuration" && sortOrder === "asc"}
              onClick={() => handleSort("FlightDuration")}
            />
            <SortButton
              field="AirlineCode"
              label="По авиакомпании"
              active={sortField === "AirlineCode"}
              ascending={sortField === "AirlineCode" && sortOrder === "asc"}
              onClick={() => handleSort("AirlineCode")}
            />
          </div>

          <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
            {flights.length > 0 ? (
              flights.map((flight) => (
                <FlightsCard
                  key={flight.FlightID}
                  FlightID={flight.FlightID}
                  DepartureAirport={
                    <HighlightedText
                      text={flight.DepartureAirport}
                      highlight={searchQuery}
                    />
                  }
                  ArrivalAirport={
                    <HighlightedText
                      text={flight.ArrivalAirport}
                      highlight={searchQuery}
                    />
                  }
                  DepartureDate={flight.DepartureDate}
                  ArrivalDate={flight.ArrivalDate}
                  FlightDuration={flight.FlightDuration}
                  FlightNumber={
                    <HighlightedText
                      text={flight.FlightNumber}
                      highlight={searchQuery}
                    />
                  }
                  AirlineCode={
                    <HighlightedText
                      text={flight.AirlineCode}
                      highlight={searchQuery}
                    />
                  }
                  onDelete={handleFlightDelete}
                />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                Рейсы не найдены.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
