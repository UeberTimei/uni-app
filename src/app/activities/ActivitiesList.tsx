"use client";

import { useState } from "react";
import ActivitiesCard from "../components/ActivitiesCard";
import CreateActivityForm from "./CreateActivityForm";
import { useRole } from "../context";

type SortField = "none" | "ActivityName" | "Duration" | "Cost";
type SortOrder = "asc" | "desc";

type Activity = {
  ActivityID: number;
  DestinationID: number;
  ActivityName: string;
  Description: string | null;
  Duration: number;
  Cost: number;
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

export function ActivitiesList({
  initialActivities,
}: {
  initialActivities: Activity[];
}) {
  const { role } = useRole();

  const [originalActivities] = useState(initialActivities);
  const [activities, setActivities] = useState(initialActivities);
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSort = (field: SortField) => {
    if (field === "none") {
      setActivities(filterActivities(originalActivities, searchQuery));
      setSortField("none");
      return;
    }

    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";

    const sortedActivities = [...activities].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (field === "Duration" || field === "Cost") {
        compareA = Number(compareA);
        compareB = Number(compareB);
      }

      if (newSortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setActivities(sortedActivities);
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const filterActivities = (activities: Activity[], query: string) => {
    if (!query.trim())
      return sortField === "none" ? originalActivities : activities;

    return activities.filter(
      (activity) =>
        activity.ActivityName.toLowerCase().includes(query.toLowerCase()) ||
        (activity.Description?.toLowerCase().includes(query.toLowerCase()) ??
          false)
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredActivities = filterActivities(
      sortField === "none" ? originalActivities : activities,
      query
    );
    setActivities(filteredActivities);
  };

  const handleActivityDelete = (deletedActivityId: number) => {
    setActivities((prevActivities) =>
      prevActivities.filter(
        (activity) => activity.ActivityID !== deletedActivityId
      )
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
              Создать активность
            </button>
          )}
        </div>
        {isCreating ? (
          <div className="mb-6">
            <CreateActivityForm onCancel={() => setIsCreating(false)} />
          </div>
        ) : (
          <input
            type="text"
            placeholder="Поиск активностей..."
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
              field="ActivityName"
              label="Сортировка по имени"
              active={sortField === "ActivityName"}
              ascending={sortField === "ActivityName" && sortOrder === "asc"}
              onClick={() => handleSort("ActivityName")}
            />
            <SortButton
              field="Duration"
              label="Сортировка по длительности"
              active={sortField === "Duration"}
              ascending={sortField === "Duration" && sortOrder === "asc"}
              onClick={() => handleSort("Duration")}
            />
            <SortButton
              field="Cost"
              label="Сортировка по стоимости"
              active={sortField === "Cost"}
              ascending={sortField === "Cost" && sortOrder === "asc"}
              onClick={() => handleSort("Cost")}
            />
          </div>

          <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <ActivitiesCard
                  key={activity.ActivityID}
                  ActivityID={activity.ActivityID}
                  ActivityName={
                    <HighlightedText
                      text={activity.ActivityName}
                      highlight={searchQuery}
                    />
                  }
                  Description={
                    <HighlightedText
                      text={activity.Description ?? ""}
                      highlight={searchQuery}
                    />
                  }
                  Duration={activity.Duration}
                  Cost={activity.Cost}
                  onDelete={handleActivityDelete}
                />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                Активности не найдены.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
