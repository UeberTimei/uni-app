"use client";

import { ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useActionState } from "react";
import EditUserForm from "../users/[id]/UserEditForm";
import { deleteUser } from "../users/[id]/actions";
import { useRouter } from "next/navigation";

type UsersProps = {
  id: string;
  email: ReactNode;
  name: ReactNode;
  password: string;
  role: ReactNode;
  createdAt: Date;
  updatedAt: Date;
  isAdminPage?: boolean;
  onDelete?: () => void;
};

export default function UsersCard({
  id,
  email,
  name,
  password,
  role,
  createdAt,
  updatedAt,
  isAdminPage = false,
}: UsersProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, deleteUserAction] = useActionState(deleteUser, undefined);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const displayPassword = showPassword
    ? password
    : "•".repeat(Math.min(12, password.length));

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const formatTime = (date: Date) => {
    return new Date(date).toISOString().split("T")[1].substring(0, 5);
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      const formData = new FormData();
      formData.append("id", id);
      deleteUserAction(formData);
      window.location.reload();

      if (error) {
        alert("Ошибка при удалении пользователя");
      }
    }
  };

  if (isEditing) {
    return (
      <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6">
        <EditUserForm
          id={id}
          initialEmail={email as string}
          initialName={name as string}
          onCancel={() => setIsEditing(false)}
          isAdminPage={isAdminPage}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className="text-gray-700">
          <strong>Электронная почта:</strong> {email}
        </p>
        <div className="text-gray-700 flex items-center gap-2">
          <strong>Пароль:</strong>
          <span className="font-mono">{displayPassword}</span>
          <button
            onClick={togglePassword}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        <p className="text-gray-700">
          <strong>Роль:</strong> {role}
        </p>
        <p className="text-gray-700">
          <strong>Создано:</strong> {formatDate(createdAt)}{" "}
          {formatTime(createdAt)}
        </p>
        <p className="text-gray-700">
          <strong>Обновлено:</strong> {formatDate(updatedAt)}{" "}
          {formatTime(updatedAt)}
        </p>
      </div>
      <div className="px-6 py-4 flex justify-between items-center">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => setIsEditing(true)}
        >
          Изменить
        </button>
        {isAdminPage && (
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}
