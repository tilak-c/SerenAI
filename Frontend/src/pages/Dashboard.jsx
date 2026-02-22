import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import HeatMap from "../components/HeatMap";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [insight, setInsight] = useState("");

  const generateInsight = (data) => {
    if (data.length < 2) {
      setInsight("Start chatting to build your emotional pattern.");
      return;
    }

    const first = data[0].score;
    const last = data[data.length - 1].score;

    if (last > first) {
      setInsight("Your mood has been improving over time 🌿");
    } else if (last < first) {
      setInsight("There has been a recent emotional dip.");
    } else {
      setInsight("Your mood has remained stable.");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/emotions")
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          setInsight("No emotional data yet.");
          return;
        }

        const formatted = res.data.map((entry) => ({
          date: entry.date.slice(5), // MM-DD
          score: entry.averageScore
        }));

        setData(formatted);
        generateInsight(formatted);
      })
      .catch(() => {
        setInsight("Unable to load emotional data.");
      });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Emotional Trend</h2>
        <p style={styles.insight}>{insight}</p>

        {data.length > 0 ? (
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid stroke="#134e4a" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#34d399" />
                <YAxis
                  domain={[1, 10]}
                  stroke="#34d399"
                  label={{
                    value: "Mood (1–10)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#34d399"
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f2e22",
                    border: "1px solid #34d399",
                    borderRadius: "12px",
                    color: "#d1fae5"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6ee7b7"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={styles.emptyState}>
            Start chatting to generate emotional data.
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Mood Heatmap</h2>
        <HeatMap />
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#071a12",
    minHeight: "100vh",
    color: "#d1fae5",
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },

  card: {
    background: "#0f2e22",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
  },

  title: {
    color: "#34d399",
    marginBottom: "10px"
  },

  insight: {
    marginBottom: "20px",
    color: "#a7f3d0",
    fontSize: "14px"
  },

  emptyState: {
    padding: "20px",
    color: "#6ee7b7"
  }
};