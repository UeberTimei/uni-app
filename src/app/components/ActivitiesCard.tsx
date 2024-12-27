"use client";

import { ReactNode, useState } from "react";
import { useActionState } from "react";
import ActivityEditForm from "../activities/ActivitieEditForm";
import { deleteActivity } from "../activities/actions";
import { renderToStaticMarkup } from "react-dom/server";
import { useRole } from "../context";

type ActivitiesProps = {
  ActivityID: number;
  ActivityName: ReactNode;
  Description: ReactNode;
  Duration: number;
  Cost: number;
  onDelete: (ActivityID: number) => void;
};

export default function ActivitiesCard({
  ActivityID,
  ActivityName,
  Description,
  Duration,
  Cost,
  onDelete,
}: ActivitiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, deleteActivityAction] = useActionState(
    deleteActivity,
    undefined
  );
  const { role } = useRole();

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту активность?")) {
      const formData = new FormData();
      formData.append("ActivityID", ActivityID.toString());
      deleteActivityAction(formData);

      if (error) {
        alert("Ошибка при удалении активности");
      }
      onDelete(ActivityID);
    }
  };

  if (isEditing) {
    const newActivityName = renderToStaticMarkup(ActivityName).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newDescription = renderToStaticMarkup(Description).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );

    return (
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6">
        <ActivityEditForm
          ActivityID={ActivityID}
          initialActivityName={newActivityName}
          initialDescription={newDescription}
          initialDuration={Duration}
          initialCost={Cost}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl text-gray-900 mb-2">
          {ActivityName}
        </div>
        <p className="text-gray-700 text-base mb-4">{Description}</p>
        <div className="flex items-center justify-between text-gray-600 text-sm">
          <span>
            {Duration} час{Duration > 5 ? "ов" : Duration > 1 ? "а" : ""}
          </span>
          <span className="font-semibold">${Cost}</span>
        </div>
      </div>
      {role === "ADMIN" && (
        <div className="px-6 py-4 flex justify-between items-center">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Изменить
          </button>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
