"use client";

import { useActionState, useEffect } from "react";
import { updateActivity } from "./actions";

type ActivityEditFormProps = {
  ActivityID: number;
  initialActivityName: string;
  initialDescription: string;
  initialDuration: number;
  initialCost: number;
  onCancel: () => void;
};

export default function ActivityEditForm({
  ActivityID,
  initialActivityName,
  initialDescription,
  initialDuration,
  initialCost,
  onCancel,
}: ActivityEditFormProps) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateActivity, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="ActivityID" value={ActivityID} />

      <div>
        <label
          htmlFor="ActivityName"
          className="block text-sm font-medium text-gray-700"
        >
          Название активности
        </label>
        <input
          id="ActivityName"
          name="ActivityName"
          defaultValue={initialActivityName}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.ActivityName && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.ActivityName}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="Description"
          className="block text-sm font-medium text-gray-700"
        >
          Описание
        </label>
        <textarea
          id="Description"
          name="Description"
          defaultValue={initialDescription}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.Description && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.Description}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="Duration"
          className="block text-sm font-medium text-gray-700"
        >
          Длительность (часы)
        </label>
        <input
          type="number"
          id="Duration"
          name="Duration"
          defaultValue={initialDuration}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.Duration && (
          <p className="mt-1 text-sm text-red-600">{state.errors.Duration}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="Cost"
          className="block text-sm font-medium text-gray-700"
        >
          Стоимость
        </label>
        <input
          type="number"
          id="Cost"
          name="Cost"
          defaultValue={initialCost}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {state?.errors?.Cost && (
          <p className="mt-1 text-sm text-red-600">{state.errors.Cost}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}
