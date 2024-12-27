import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateUser } from "./actions";

type EditUserFormProps = {
  id: string;
  initialEmail: string;
  initialName: string;
  onCancel: () => void;
  isAdminPage?: boolean;
};

export default function EditUserForm({
  id,
  initialEmail,
  initialName,
  onCancel,
  isAdminPage = false,
}: EditUserFormProps) {
  const [state, editUser] = useActionState(updateUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      if (isAdminPage) {
        onCancel();
        router.refresh();
        window.location.reload();
      } else {
        router.push("/");
      }
    }
  }, [state?.success, router, isAdminPage, onCancel]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [firstName, lastName] = (initialName as string).split(" ").concat([""]);

  return (
    <form action={editUser} className="space-y-4">
      <input type="hidden" name="id" value={id} />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Имя</label>
        <input
          name="firstName"
          defaultValue={firstName}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state?.errors?.firstName && (
          <p className="text-red-500 text-sm">{state.errors.firstName}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Фамилия
        </label>
        <input
          name="lastName"
          defaultValue={lastName}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state?.errors?.lastName && (
          <p className="text-red-500 text-sm">{state.errors.lastName}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Электронная почта
        </label>
        <input
          name="email"
          type="email"
          defaultValue={initialEmail}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Новый пароль
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Оставьте пустым, чтобы не менять"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        {state?.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Отмена
        </button>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
    >
      {pending ? "Сохранение..." : "Сохранить"}
    </button>
  );
}
