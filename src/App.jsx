import React, { useState } from "react";
import RotationMatrixDisplay from "./RotationMatrixDisplay";
import "./App.css";

export default function App() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  return (
    <div className="App">
      <h1>TAP Rotation Matrix</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Select Day:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>
      </div>

      <RotationMatrixDisplay day={selectedDay} />
    </div>
  );
}
