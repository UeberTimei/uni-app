"use client";

import { useState } from "react";
import UsersCard from "../components/UsersCard";
import HighlightedText from "../components/HighlightedText";
import SortButton from "../components/SortButton";

type SortField = "none" | "name" | "email" | "role" | "createdAt";
type SortOrder = "asc" | "desc";

type User = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: "CLIENT" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

export function UsersList({ initialUsers }: { initialUsers: User[] }) {
  const [originalUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [displayedUsers, setDisplayedUsers] = useState(initialUsers);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const filterUsers = (users: User[], query: string) => {
    if (!query.trim()) return users;

    return users.filter(
      (user) =>
        (user.name?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase())
    );
  };

  const sortUsers = (users: User[], field: SortField, order: SortOrder) => {
    if (field === "none") return users;

    return [...users].sort((a, b) => {
      let compareA: string | Date = "";
      let compareB: string | Date = "";

      if (field === "createdAt") {
        compareA = new Date(a[field]);
        compareB = new Date(b[field]);
      } else if (field === "name") {
        compareA = a[field] ?? "";
        compareB = b[field] ?? "";
      } else {
        compareA = a[field];
        compareB = b[field];
      }

      if (order === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = filterUsers(originalUsers, query);
    setFilteredUsers(filtered);
    const sorted = sortUsers(filtered, sortField, sortOrder);
    setDisplayedUsers(sorted);
  };

  const handleSort = (field: SortField) => {
    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortOrder(newSortOrder);

    const sorted = sortUsers(filteredUsers, field, newSortOrder);
    setDisplayedUsers(sorted);
  };

  return (
    <>
      <div className="w-full max-w-4xl mb-6">
        <input
          type="text"
          placeholder="Поиск пользователей..."
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
          field="name"
          label="По имени"
          active={sortField === "name"}
          ascending={sortField === "name" && sortOrder === "asc"}
          onClick={() => handleSort("name")}
        />
        <SortButton
          field="email"
          label="По email"
          active={sortField === "email"}
          ascending={sortField === "email" && sortOrder === "asc"}
          onClick={() => handleSort("email")}
        />
        <SortButton
          field="role"
          label="По роли"
          active={sortField === "role"}
          ascending={sortField === "role" && sortOrder === "asc"}
          onClick={() => handleSort("role")}
        />
        <SortButton
          field="createdAt"
          label="По дате регистрации"
          active={sortField === "createdAt"}
          ascending={sortField === "createdAt" && sortOrder === "asc"}
          onClick={() => handleSort("createdAt")}
        />
      </div>

      <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
        {displayedUsers.length > 0 ? (
          displayedUsers.map((user) => (
            <UsersCard
              key={user.id}
              id={user.id}
              email={
                <HighlightedText text={user.email} highlight={searchQuery} />
              }
              name={
                <HighlightedText
                  text={user.name ?? "CLIENT"}
                  highlight={searchQuery}
                />
              }
              password={user.password}
              role={
                <HighlightedText text={user.role} highlight={searchQuery} />
              }
              createdAt={user.createdAt}
              updatedAt={user.updatedAt}
              isAdminPage={true}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            Пользователи не найдены.
          </div>
        )}
      </div>
    </>
  );
}
