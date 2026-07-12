import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLostItem } from "../api/lostItemApi";

function LostItemPage() {
  const navigate = useNavigate();

  const [lostItem, setLostItem] = useState({
    itemName: "",
    category: "",
    location: "",
    description: "",
    date: "",
    status: "LOST",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setLostItem({
      ...lostItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitLostItem = async (e) => {
    e.preventDefault();

    try {
      await addLostItem(lostItem);

      alert("✅ Lost Item Reported Successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("❌ Failed to Report Lost Item!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "white",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1e3a8a",
            marginBottom: "10px",
          }}
        >
          📦 Report Lost Item
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Fill in the details of your lost item.
        </p>

        <form onSubmit={submitLostItem}>
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            value={lostItem.itemName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={lostItem.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="location"
            placeholder="Last Seen Location"
            value={lostItem.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <textarea
            name="description"
            placeholder="Describe your item..."
            value={lostItem.description}
            onChange={handleChange}
            rows="4"
            required
            style={{
              ...inputStyle,
              resize: "none",
            }}
          />

          <input
            type="date"
            name="date"
            value={lostItem.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label
            style={{
              fontWeight: "bold",
              color: "#1e3a8a",
            }}
          >
            Upload Item Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{
              marginTop: "10px",
              marginBottom: "20px",
            }}
          />

          {preview && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "15px",
                  border: "3px solid #2563eb",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📦 Report Lost Item
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "15px",
              background: "#e5e7eb",
              color: "#1f2937",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ⬅ Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default LostItemPage;