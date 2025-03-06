"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

function getFlagEmoji(countryCode: string | null): string {
  if (!countryCode || typeof countryCode !== "string") return "";
  let codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

const TitleHeader = () => {
  const searchParams = useSearchParams();
  const countryName = searchParams.get("country") || "Unknown Country";
  const [countryId, setCountryId] = useState<string | null>(null);

  polyfillCountryFlagEmojis();

  useEffect(() => {
    const storedCountry = localStorage.getItem("country");
    setCountryId(storedCountry);
  }, []);

  const title = (
    <>
      Spotivis - {countryName}{" "}
      <span style={{ fontFamily: "Twemoji Country Flags" }}>
        {getFlagEmoji(countryId)}
      </span>
    </>
  );

  return <h1 className="text-4xl font-bold mb-4">{title}</h1>;
};

export default TitleHeader;
