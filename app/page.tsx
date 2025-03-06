"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AboutUs from "@/components/aboutUs"

export default function Home() {
  const [countries, setCountries] = useState<any[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [country, setCountry] = useState("");

  const router = useRouter();

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
        countries.filter((country) =>
          country.country_name?.toLowerCase().includes(query)
        )
      );
    }
  };

  useEffect(() => {
    if (country) {
      localStorage.setItem("country", country);
    }
  }, [country]);

  // Send id and country to next page.
  const chooseCountry = (id: number, country_name: string, country: string) => {
    setCountry(country);
    router.push(`/dashboard?country=${country_name}&countryId=${id}`);
  };

  // Random country selection
  const handleRandomCountry = () => {
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    chooseCountry(randomCountry.id, randomCountry.country_name, randomCountry.country);
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <button className="pb-1" onClick={openPopup}>
        <h1 className="flex items-center justify-center w-10 h-10 bg-green-700 text-white rounded-full font-bold hover:bg-green-900">?</h1>
      </button>
      {/* AboutUsPopup component */}
      <AboutUs isOpen={isPopupOpen} onClose={closePopup} />

      <h1 className="pb-2 text-4xl font-bold mb-4 text-center">Welcome to Spotivis!</h1>

      <div className="flex items-center justify-center mb-4 space-x-4">
        <h1 className="text-2xl font-bold">Select a Country</h1>
        <button className="hover:opacity-80" onClick={handleRandomCountry}>
          <img 
            src="https://static-00.iconduck.com/assets.00/perspective-dice-six-faces-random-icon-1024x1024-20is6x9z.png"
            alt="random country" 
            className="w-8 h-8"
          />
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading countries...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <div className="relative">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search for a country..."
              className="border p-2 rounded w-full text-white"
            />
            <button
              onClick={() => {
                // Find the country that matches the search query
                const selectedCountry = filteredCountries.find(
                  (country) =>
                    country.country_name?.toLowerCase() === search.toLowerCase()
                );

                if (selectedCountry) {
                  chooseCountry(selectedCountry.id, selectedCountry.country_name, selectedCountry.country);
                }
              }}
              className="border p-2 rounded w-full bg-green-700 text-white hover:bg-green-900"
            >
              Search Country
            </button>
          </div>
          {showDropdown && (
            <ul className="absolute z-10 bg-dark border border-gray-300 rounded w-full mt-1 max-h-60 overflow-y-auto shadow-md">
              {filteredCountries.length > 0 ? (
                filteredCountries.filter((country) => country.country_name)
                .map((country) => (
                  <li
                    key={country.id}
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setSearch(country.country_name);
                      setShowDropdown(false);
                    }}
                  >
                    {country.country_name}
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
