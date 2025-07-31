/*
© 2025 Waking Digital Solutions. All rights reserved.
This source code is proprietary and confidential.
Unauthorized copying, distribution, modification, or use is strictly prohibited.
*/

import React, { useState } from "react";
import RotationMatrixDisplay from "./RotationMatrixDisplay";
import "./App.css";

export default function App() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  return (
    <div className="App">
      <h1 style={{
  fontSize: "20px",
  marginBottom: "1rem"
}}>
  TAP Rotation Matrix
</h1>

<div style={{
  fontSize: "14px",
  color: "#555",
  marginBottom: "1rem"
}}>
  {new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Los_Angeles"
  })} PST
</div>

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
