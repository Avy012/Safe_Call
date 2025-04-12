// src/App.js
import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Analytics from "./Analytics";
import Blocks from "./Blocks";
import Login from "./Login";
import Signup from "./Signup";
import "./styles.css";
import { Chart } from "chart.js/auto";

function App() {
  const [section, setSection] = useState("analytics");

  const dailyChartRef = useRef(null);
  const scamChartRef = useRef(null);

  useEffect(() => {
    const dailyUserCtx = document.getElementById("dailyUserChart")?.getContext("2d");
    if (dailyUserCtx) {
      if (dailyChartRef.current) {
        dailyChartRef.current.destroy();
      }
      dailyChartRef.current = new Chart(dailyUserCtx, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [20000, 34000, 29000, 15000, 18000, 33000, 12000],
              backgroundColor: "#1d3154",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    const scamRatioCtx = document.getElementById("scamRatioChart")?.getContext("2d");
    if (scamRatioCtx) {
      if (scamChartRef.current) {
        scamChartRef.current.destroy();
      }
      scamChartRef.current = new Chart(scamRatioCtx, {
        type: "bar",
        data: {
          labels: ["Total call", "Scam"],
          datasets: [
            {
              data: [100, 35],
              backgroundColor: ["#1d3154", "#eaeacc"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }
  }, [section]);

  const renderSection = () => {
    switch (section) {
      case "analytics":
        return <Analytics />;
      case "blocks":
        return <Blocks />;
      case "login":
        return <Login />;
      case "signup":
        return <Signup />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header currentSection={section} setSection={setSection} />
      <main>{renderSection()}</main>
    </div>
  );
}

export default App;
