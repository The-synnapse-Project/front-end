import React from "react";
import { formatDate, formatDateDisplay } from "@/lib/date-utils";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  label?: string;
  className?: string;
  showToday?: boolean;
  allowClear?: boolean;
  placeholder?: string;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  label = "Fecha",
  className = "",
  showToday = true,
  allowClear = false,
  placeholder = "Seleccionar fecha",
}: DatePickerProps) {
  const today = formatDate(new Date());

  // Generate array of dates for the last week
  const getRecentDates = () => {
    const dates: { value: string; label: string }[] = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const formattedDate = formatDate(date);

      let label = "";
      if (i === 0 && showToday) {
        label = "Hoy";
      } else if (i === 1) {
        label = "Ayer";
      } else {
        label = formatDateDisplay(date);
      }

      dates.push({
        value: formattedDate,
        label,
      });
    }

    return dates;
  };

  const recentDates = getRecentDates();

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor="date-picker"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id="date-picker"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {allowClear && <option value="">{placeholder}</option>}
          {recentDates.map((date) => (
            <option key={date.value} value={date.value}>
              {date.label}
            </option>
          ))}
          <option value="custom">Personalizado</option>
        </select>

        {allowClear && selectedDate && (
          <button
            type="button"
            onClick={() => onDateChange("")}
            className="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {selectedDate === "custom" && (
        <div className="mt-2">
          <input
            type="date"
            onChange={(e) => onDateChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      )}
    </div>
  );
}
