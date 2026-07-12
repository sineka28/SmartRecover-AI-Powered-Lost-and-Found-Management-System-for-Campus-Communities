import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFoundItem } from "../api/foundItemApi";

function FoundItemPage() {
  const navigate = useNavigate();

  const [foundItem, setFoundItem] = useState({
    itemName: "",
    category: "",
    location: "",
    description: "",
    date: "",
    status: "FOUND",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFoundItem({
      ...foundItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitFoundItem = async (e) => {
    e.preventDefault();

    try {
      await addFoundItem(foundItem);

      alert("✅ Found Item Reported Successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("❌ Failed to Report Found Item!");
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
          🔍 Report Found Item
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Fill in the details of the found item.
        </p>

        <form onSubmit={submitFoundItem}>
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            value={foundItem.itemName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={foundItem.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="location"
            placeholder="Found Location"
            value={foundItem.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <textarea
            name="description"
            placeholder="Describe the found item..."
            value={foundItem.description}
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
            value={foundItem.date}
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
                  border: "3px solid #22c55e",
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
              background: "linear-gradient(90deg,#16a34a,#15803d)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔍 Report Found Item
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

export default FoundItemPage;