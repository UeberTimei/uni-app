"use client";

import { ReactNode, useState } from "react";
import { useActionState } from "react";
import DestinationEditForm from "../destinations/DestinationEditForm";
import { deleteDestination } from "../destinations/actions";
import { renderToStaticMarkup } from "react-dom/server";
import { useRole } from "../context";

type DestinationsProps = {
  DestinationID: number;
  CountryName: ReactNode;
  CityName: ReactNode;
  Description: ReactNode;
  AverageTemperature: number;
  Currency: string;
  onDelete: (DestinationID: number) => void;
};

export default function DestinationsCard({
  DestinationID,
  CountryName,
  CityName,
  Description,
  AverageTemperature,
  Currency,
  onDelete,
}: DestinationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, deleteDestinationAction] = useActionState(
    deleteDestination,
    undefined
  );
  const { role } = useRole();

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить это направление?")) {
      const formData = new FormData();
      formData.append("DestinationID", DestinationID.toString());
      deleteDestinationAction(formData);

      if (error) {
        alert("Ошибка при удалении направления");
      }
      onDelete(DestinationID);
    }
  };

  if (isEditing) {
    const newCountryName = renderToStaticMarkup(CountryName).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newCityName = renderToStaticMarkup(CityName).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newDescription = renderToStaticMarkup(Description).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );

    return (
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6">
        <DestinationEditForm
          DestinationID={DestinationID}
          initialCountryName={newCountryName}
          initialCityName={newCityName}
          initialDescription={newDescription}
          initialAverageTemperature={AverageTemperature}
          initialCurrency={Currency}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {CityName}, {CountryName}
        </div>
        <p className="text-gray-700 text-base mb-4">{Description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div>
            <strong>Средняя температура:</strong>{" "}
            {AverageTemperature ? AverageTemperature + "°C" : "неизвестно"}
          </div>
          <div>
            <strong>Валюта:</strong> {Currency ?? "неизвестно"}
          </div>
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
