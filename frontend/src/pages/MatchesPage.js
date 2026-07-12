import { useEffect, useState } from "react";
import {
  getAllMatches,
  findMatches,
  updateMatchStatus,
} from "../api/matchApi";

function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      await findMatches();

      const response = await getAllMatches();

      // Remove duplicate lostItem + foundItem combinations
      const uniqueMatches = [];
      const seen = new Set();

      response.data.forEach((match) => {
        const key = `${match.lostItem.id}-${match.foundItem.id}`;

        if (!seen.has(key)) {
          seen.add(key);
          uniqueMatches.push(match);
        }
      });

      setMatches(uniqueMatches);

    } catch (error) {
      console.log(error);
      alert("Failed to load AI Matches!");
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await updateMatchStatus(id, status);

      alert("Status Updated Successfully!");

      loadMatches();

    } catch (error) {
      console.log(error);
      alert("Failed to Update Status!");
    }
  };

  const getColor = (percentage) => {
    if (percentage >= 90) return "#2e7d32";
    if (percentage >= 70) return "#f9a825";
    return "#d32f2f";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef3f8",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1565c0",
          marginBottom: "40px",
        }}
      >
        🤖 AI Smart Matches
      </h1>

      {matches.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No Matches Found</h2>
      ) : (
        matches.map((match) => (
          <div
            key={match.id}
            style={{
              width: "800px",
              margin: "20px auto",
              background: "white",
              borderRadius: "15px",
              padding: "25px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>🤖 AI Match</h2>

              <span
                style={{
                  background: getColor(match.matchPercentage),
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                {match.matchPercentage}%
              </span>
            </div>

            <hr />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "30px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3>📦 Lost Item</h3>
                <p><strong>Name:</strong> {match.lostItem.itemName}</p>
                <p><strong>Category:</strong> {match.lostItem.category}</p>
                <p><strong>Location:</strong> {match.lostItem.location}</p>
                <p><strong>Description:</strong> {match.lostItem.description}</p>
              </div>

              <div style={{ flex: 1 }}>
                <h3>🔍 Found Item</h3>
                <p><strong>Name:</strong> {match.foundItem.itemName}</p>
                <p><strong>Category:</strong> {match.foundItem.category}</p>
                <p><strong>Location:</strong> {match.foundItem.location}</p>
                <p><strong>Description:</strong> {match.foundItem.description}</p>
              </div>
            </div>

            <hr />

            <p>
              <strong>Status : </strong>
              <span
                style={{
                  color:
                    match.status === "APPROVED"
                      ? "green"
                      : match.status === "REJECTED"
                      ? "red"
                      : "#ff9800",
                  fontWeight: "bold",
                }}
              >
                {match.status}
              </span>
            </p>

            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={() => changeStatus(match.id, "APPROVED")}
                style={{
                  background: "#2e7d32",
                  color: "white",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: "8px",
                  marginRight: "15px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ✅ Approve
              </button>

              <button
                onClick={() => changeStatus(match.id, "REJECTED")}
                style={{
                  background: "#d32f2f",
                  color: "white",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ❌ Reject
              </button>
            </div>

            <div
              style={{
                background: "#f4f8ff",
                padding: "15px",
                borderRadius: "10px",
                borderLeft: "5px solid #1565c0",
              }}
            >
              <h3>🤖 AI Reason</h3>
              <p>{match.matchReason}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MatchesPage;