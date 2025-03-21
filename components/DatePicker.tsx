"use client";

import { useState, useEffect } from "react";
import { addWeeks, addMonths, addYears, format } from "date-fns"; // Helps with date calculations

type DatePickerProps = {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  minDate: string;
  maxDate: string;
  dateRangeLoading: boolean;
  fetchRankings: () => void;
};

export default function DatePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  minDate,
  maxDate,
  dateRangeLoading,
  fetchRankings,
}: DatePickerProps) {
  const [rangeType, setRangeType] = useState<"Week" | "Month" >(
    "Week"
  );

  // Function to update endDate based on range selection
  const updateEndDate = (newStartDate: string, selectedRange: string) => {
    let newEndDate = newStartDate;

    switch (selectedRange) {
      case "Week":
        newEndDate = format(addWeeks(new Date(newStartDate), 1), "yyyy-MM-dd");
        
        newEndDate = format(
          new Date(new Date(newEndDate).getTime() - 1 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        ); // Subtract 1 day
        break;
      case "Month":
        newEndDate = format(addMonths(new Date(newStartDate), 1), "yyyy-MM-dd");
        break;
      default:
        newEndDate = newStartDate;
    }

    setEndDate(newEndDate);
  };

  useEffect(() => {
    if (startDate) {
      updateEndDate(startDate, rangeType); // Update endDate first
    }
  }, [startDate, rangeType]); // Runs when startDate or rangeType changes

  useEffect(() => {
    if (endDate) {
      fetchRankings(); // Now fetch happens AFTER endDate is updated
    }
  }, [endDate]); // Runs when endDate updates

  return (
    <div className="flex gap-4 mb-4">
      {/* Start Date Input */}
      <input
        type="date"
        value={startDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded text-white"
      />

      {/* Dropdown for selecting range */}
      <select
        value={rangeType}
        onChange={(e) =>
          setRangeType(e.target.value as "Week" | "Month")
        }
        className="border p-2 rounded text-white"
      >
        <option value="Week">Week</option>
        <option value="Month">Month</option>
      </select>
    </div>
  );
}
