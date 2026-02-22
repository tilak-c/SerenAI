import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

export default function HeatMap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/emotions/heatmap")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CalendarHeatmap
        startDate={
          new Date(new Date().setMonth(new Date().getMonth() - 3))
        }
        endDate={new Date()}
        values={data}
        gutterSize={3}
        showWeekdayLabels={false}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.intensity >= 8) return "color-strong";
          if (value.intensity >= 5) return "color-medium";
          return "color-light";
        }}
      />
    </div>
  );
}