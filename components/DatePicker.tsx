"use client";

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
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="date"
        value={startDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded"
        disabled={dateRangeLoading}
      />
      <input
        type="date"
        value={endDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 rounded"
        disabled={dateRangeLoading}
      />
      <button
        onClick={fetchRankings}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={dateRangeLoading}
      >
        Fetch Rankings
      </button>
    </div>
  );
}
