"use client"; // Add this at the very top

import Page1 from "@/app/radartest/page";
import Page2 from "@/app/tester/page";

export default function Home() {
    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1, border: "1px solid black", padding: "10px" }}>
                <h2>Page 1</h2>
                <Page1 />
            </div>
            <div style={{ flex: 1, border: "1px solid black", padding: "10px" }}>
                <h2>Page 2</h2>
                <Page2 />
            </div>
        </div>
    );
}