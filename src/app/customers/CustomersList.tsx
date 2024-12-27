"use client";

import { useState } from "react";
import CustomersCard from "../components/CustomersCard";
import HighlightedText from "../components/HighlightedText";
import SortButton from "../components/SortButton";

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

export function CustomersList({
  initialCustomers,
}: {
  initialCustomers: Customer[];
}) {
  const [originalCustomers] = useState(initialCustomers);
  const [customers, setCustomers] = useState(initialCustomers);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const sortCustomers = (
    customers: Customer[],
    field: SortField,
    order: SortOrder
  ) => {
    if (field === "none") return [...customers];

    return [...customers].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (!compareA) compareA = "";
      if (!compareB) compareB = "";

      if (order === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  const filterCustomers = (customers: Customer[], query: string) => {
    if (!query.trim()) return customers;

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

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      const sorted = sortCustomers(
        filterCustomers(originalCustomers, searchQuery),
        field,
        newOrder
      );
      setCustomers(sorted);
    } else {
      setSortField(field);
      setSortOrder("asc");
      const sorted = sortCustomers(
        filterCustomers(originalCustomers, searchQuery),
        field,
        "asc"
      );
      setCustomers(sorted);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = filterCustomers(originalCustomers, query);
    const sorted = sortCustomers(filtered, sortField, sortOrder);
    setCustomers(sorted);
  };

  const handleCustomerDelete = (deletedCustomerId: number) => {
    const updatedOriginal = originalCustomers.filter(
      (customer) => customer.CustomerID !== deletedCustomerId
    );
    const updatedFiltered = filterCustomers(updatedOriginal, searchQuery);
    const sorted = sortCustomers(updatedFiltered, sortField, sortOrder);

    setCustomers(sorted);
  };

  return (
    <>
      <div className="w-full max-w-4xl mb-6">
        <input
          type="text"
          placeholder="Search customers..."
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
          label="Сортировка по имени"
          active={sortField === "FirstName"}
          ascending={sortField === "FirstName" && sortOrder === "asc"}
          onClick={() => handleSort("FirstName")}
        />
        <SortButton
          field="LastName"
          label="Сортировка по фамилии"
          active={sortField === "LastName"}
          ascending={sortField === "LastName" && sortOrder === "asc"}
          onClick={() => handleSort("LastName")}
        />
        <SortButton
          field="Email"
          label="Сортировка по электронной почте"
          active={sortField === "Email"}
          ascending={sortField === "Email" && sortOrder === "asc"}
          onClick={() => handleSort("Email")}
        />
        <SortButton
          field="City"
          label="Сортировка по городу"
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
                  text={customer.PhoneNumber ?? "Unknown"}
                  highlight={searchQuery}
                />
              }
              Address={
                <HighlightedText
                  text={customer.Address ?? "Unknown"}
                  highlight={searchQuery}
                />
              }
              City={
                <HighlightedText
                  text={customer.City ?? "Unknown"}
                  highlight={searchQuery}
                />
              }
              onDelete={handleCustomerDelete}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            Клиенты не найдены
          </div>
        )}
      </div>
    </>
  );
}
