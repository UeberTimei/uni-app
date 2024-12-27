"use client";

import { useEffect, useState } from "react";
import CustomersCard from "../components/CustomersCard";
import { useRouter } from "next/navigation";

type SortField = "none" | "FirstName" | "LastName" | "Email" | "City";
type SortOrder = "asc" | "desc";

type Customer = {
  UserId: string;
  CustomerID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string | null;
  Address: string | null;
  City: string | null;
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

export function CustomersList({
  initialCustomers,
}: {
  initialCustomers: Customer[];
}) {
  const router = useRouter();

  const [originalCustomers, setOriginalCustomers] = useState(initialCustomers);
  const [customers, setCustomers] = useState(initialCustomers);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (field: SortField) => {
    if (field === "none") {
      setCustomers(filterCustomers(originalCustomers, searchQuery));
      setSortField("none");
      return;
    }

    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";

    const sortedCustomers = [...customers].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (!compareA) compareA = "";
      if (!compareB) compareB = "";

      if (newSortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setCustomers(sortedCustomers);
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const filterCustomers = (customers: Customer[], query: string) => {
    if (!query.trim())
      return sortField === "none" ? originalCustomers : customers;

    return customers.filter(
      (customer) =>
        customer.FirstName.toLowerCase().includes(query.toLowerCase()) ||
        customer.LastName.toLowerCase().includes(query.toLowerCase()) ||
        customer.Email.toLowerCase().includes(query.toLowerCase()) ||
        (customer.City?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (customer.Address?.toLowerCase().includes(query.toLowerCase()) ??
          false) ||
        (customer.PhoneNumber?.toLowerCase().includes(query.toLowerCase()) ??
          false)
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredCustomers = filterCustomers(
      sortField === "none" ? originalCustomers : customers,
      query
    );
    setCustomers(filteredCustomers);
  };

  useEffect(() => {
    router.refresh();
  }, [customers, router]);

  const handleCustomerDelete = (deletedCustomerId: number) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter(
        (customer) => customer.CustomerID !== deletedCustomerId
      )
    );
    setOriginalCustomers((prevCustomers) =>
      prevCustomers.filter(
        (customer) => customer.CustomerID !== deletedCustomerId
      )
    );
  };

  return (
    <>
      <div className="w-full max-w-4xl mb-6">
        <input
          type="text"
          placeholder="Поиск клиентов..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          field="FirstName"
          label="По имени"
          active={sortField === "FirstName"}
          ascending={sortField === "FirstName" && sortOrder === "asc"}
          onClick={() => handleSort("FirstName")}
        />
        <SortButton
          field="LastName"
          label="По фамилии"
          active={sortField === "LastName"}
          ascending={sortField === "LastName" && sortOrder === "asc"}
          onClick={() => handleSort("LastName")}
        />
        <SortButton
          field="Email"
          label="По email"
          active={sortField === "Email"}
          ascending={sortField === "Email" && sortOrder === "asc"}
          onClick={() => handleSort("Email")}
        />
        <SortButton
          field="City"
          label="По городу"
          active={sortField === "City"}
          ascending={sortField === "City" && sortOrder === "asc"}
          onClick={() => handleSort("City")}
        />
      </div>

      <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <CustomersCard
              key={customer.CustomerID}
              UserId={customer.UserId}
              CustomerID={customer.CustomerID}
              FirstName={
                <HighlightedText
                  text={customer.FirstName}
                  highlight={searchQuery}
                />
              }
              LastName={
                <HighlightedText
                  text={customer.LastName}
                  highlight={searchQuery}
                />
              }
              Email={
                <HighlightedText
                  text={customer.Email}
                  highlight={searchQuery}
                />
              }
              PhoneNumber={
                <HighlightedText
                  text={customer.PhoneNumber ?? "Не известно"}
                  highlight={searchQuery}
                />
              }
              Address={
                <HighlightedText
                  text={customer.Address ?? "Не известно"}
                  highlight={searchQuery}
                />
              }
              City={
                <HighlightedText
                  text={customer.City ?? "Не известно"}
                  highlight={searchQuery}
                />
              }
              onDelete={handleCustomerDelete}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            Клиенты не найдены.
          </div>
        )}
      </div>
    </>
  );
}
