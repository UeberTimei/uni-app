import { ReactNode, useState } from "react";
import { useActionState } from "react";
import HotelEditForm from "../hotels/HotelEditForm";
import { deleteHotel } from "../hotels/actions";
import { renderToStaticMarkup } from "react-dom/server";
import { useRole } from "../context";

type HotelsProps = {
  HotelID: number;
  HotelName: ReactNode;
  StarRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "NULL";
  PricePerNight: number;
  Description: ReactNode;
  onDelete: (HotelID: number) => void;
};

export default function HotelsCard({
  HotelID,
  HotelName,
  StarRating,
  PricePerNight,
  Description,
  onDelete,
}: HotelsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, deleteHotelAction] = useActionState(deleteHotel, undefined);
  const { role } = useRole();

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот отель?")) {
      const formData = new FormData();
      formData.append("HotelID", HotelID.toString());
      deleteHotelAction(formData);

      if (error) {
        alert("Ошибка при удалении отеля");
      }
      onDelete(HotelID);
    }
  };

  if (isEditing) {
    const newHotelName = renderToStaticMarkup(HotelName).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newDescription = renderToStaticMarkup(Description).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );

    return (
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6">
        <HotelEditForm
          HotelID={HotelID}
          initialHotelName={newHotelName}
          initialStarRating={StarRating}
          initialPricePerNight={PricePerNight}
          initialDescription={newDescription}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

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

  const numericRating = convertRatingToNumber(StarRating);

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800">{HotelName}</h2>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-yellow-400 flex">
            {numericRating != 0 &&
              Array.from({ length: numericRating }).map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.435L24 9.351l-6 5.849 1.416 8.258L12 18.902l-7.416 4.556L6 15.2 0 9.351l8.332-1.329L12 .587z" />
                </svg>
              ))}
          </span>
          <span className="text-gray-500 mt-0.5">{numericRating} / 5</span>
        </div>
        <p className="text-lg text-gray-600 mt-2">{Description}</p>
        <div className="mt-4">
          <span className="text-xl font-bold text-gray-900">
            ${PricePerNight}
          </span>
          <span className="text-sm text-gray-500">/ per night</span>
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
