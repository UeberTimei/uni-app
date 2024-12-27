"use client";

import { ReactNode, useState } from "react";
import { useActionState } from "react";
import CustomerEditForm from "../customers/CustomerEditForm";
import { deleteCustomer } from "../customers/actions";
import { renderToStaticMarkup } from "react-dom/server";

type CustomersProps = {
  UserId: string;
  CustomerID: number;
  FirstName: ReactNode;
  LastName: ReactNode;
  Email: ReactNode;
  PhoneNumber: ReactNode;
  Address: ReactNode;
  City: ReactNode;
  onDelete: (CustomerID: number) => void;
};

export default function CustomersCard({
  UserId,
  CustomerID,
  FirstName,
  LastName,
  Email,
  PhoneNumber,
  Address,
  City,
  onDelete,
}: CustomersProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, deleteCustomerAction] = useActionState(
    deleteCustomer,
    undefined
  );

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этого клиента?")) {
      const formData = new FormData();
      formData.append("CustomerID", CustomerID.toString());
      deleteCustomerAction(formData);

      if (error) {
        alert("Ошибка при удалении клиента");
      }
      onDelete(CustomerID);
    }
  };

  if (isEditing) {
    const newFirstName = renderToStaticMarkup(FirstName).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newLastName = renderToStaticMarkup(LastName).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newEmail = renderToStaticMarkup(Email).replace(/<\/?[^>]+(>|$)/g, "");
    const newPhoneNumber = renderToStaticMarkup(PhoneNumber).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newAddress = renderToStaticMarkup(Address).replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );
    const newCity = renderToStaticMarkup(City).replace(/<\/?[^>]+(>|$)/g, "");
    return (
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6">
        <CustomerEditForm
          CustomerID={CustomerID}
          initialFirstName={newFirstName}
          initialLastName={newLastName}
          initialEmail={newEmail}
          initialPhoneNumber={newPhoneNumber}
          initialAddress={newAddress}
          initialCity={newCity}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {FirstName} {LastName}
        </h2>
        <p className="text-gray-600">
          <strong>Customer ID:</strong> {CustomerID}
        </p>
        <p className="text-gray-600">
          <strong>User ID:</strong> {UserId}
        </p>
        <p className="text-gray-600">
          <strong>Электронная почта:</strong> {Email}
        </p>
        <p className="text-gray-600">
          <strong>Номер телефона:</strong> {PhoneNumber}
        </p>
        <p className="text-gray-600">
          <strong>Адрес:</strong> {Address}
        </p>
        <p className="text-gray-600">
          <strong>Город:</strong> {City}
        </p>
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
