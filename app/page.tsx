"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [countries, setCountries] = useState<any[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch countries");
        }

        setCountries(data);
        setFilteredCountries(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    if (query === "") {
      setFilteredCountries(countries);
    } else {
      setFilteredCountries(
        countries.filter((country) => country.country.toLowerCase().includes(query))
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Select a Country</h1>

      {loading && <p className="text-center text-gray-500">Loading countries...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a country..."
            className="border p-2 rounded w-full"
          />
          {showDropdown && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-60 overflow-y-auto shadow-md">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <li
                    key={country.id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setSearch(country.country);
                      setShowDropdown(false);
                    }}
                  >
                    {country.country}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
