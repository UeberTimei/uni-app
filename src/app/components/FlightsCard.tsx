import { ReactNode, useState } from "react";
import { useActionState } from "react";
import FlightEditForm from "../flights/FlightEditForm";
import { deleteFlight } from "../flights/actions";
import { renderToStaticMarkup } from "react-dom/server";

type FlightsProps = {
  FlightID: number;
  DepartureAirport: ReactNode;
  ArrivalAirport: ReactNode;
  DepartureDate: Date;
  ArrivalDate: Date;
  FlightDuration: number;
  FlightNumber: ReactNode;
  AirlineCode: ReactNode;
  onDelete: (FlightID: number) => void;
};

export default function FlightsCard({
  FlightID,
  DepartureAirport,
  ArrivalAirport,
  DepartureDate,
  ArrivalDate,
  FlightDuration,
  FlightNumber,
  AirlineCode,
  onDelete,
}: FlightsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, deleteFlightAction] = useActionState(deleteFlight, undefined);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString("ru-RU", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот рейс?")) {
      const formData = new FormData();
      formData.append("FlightID", FlightID.toString());
      deleteFlightAction(formData);

      if (error) {
        alert("Ошибка при удалении рейса");
      }
      onDelete(FlightID);
    }
  };

  if (isEditing) {
    const newDepartureAirport = renderToStaticMarkup(DepartureAirport).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newArrivalAirport = renderToStaticMarkup(ArrivalAirport).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newFlightNumber = renderToStaticMarkup(FlightNumber).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newAirlineCode = renderToStaticMarkup(AirlineCode).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    return (
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6">
        <FlightEditForm
          FlightID={FlightID}
          initialDepartureAirport={newDepartureAirport}
          initialArrivalAirport={newArrivalAirport}
          initialDepartureDate={DepartureDate}
          initialArrivalDate={ArrivalDate}
          initialFlightDuration={FlightDuration}
          initialFlightNumber={newFlightNumber}
          initialAirlineCode={newAirlineCode}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          Рейс {FlightNumber} ({AirlineCode})
        </div>
        <div className="text-gray-700 text-sm">
          <p>
            <strong>Flight ID:</strong> {FlightID}
          </p>
          <p>
            <strong>Из:</strong> {DepartureAirport}
          </p>
          <p>
            <strong>В:</strong> {ArrivalAirport}
          </p>
          <p>
            <strong>Вылет:</strong> {formatDate(DepartureDate)}
          </p>
          <p>
            <strong>Прибытие:</strong> {formatDate(ArrivalDate)}
          </p>
          <p>
            <strong>Длительность:</strong> {formatDuration(FlightDuration)}
          </p>
        </div>
      </div>
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
    </div>
  );
}
