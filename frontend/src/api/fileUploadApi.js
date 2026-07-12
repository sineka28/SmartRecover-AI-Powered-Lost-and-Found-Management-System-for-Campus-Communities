import axios from "axios";

const API_URL = "http://localhost:8080/api/files";

export const uploadImage = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};