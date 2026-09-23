const API_URL = "http://localhost:3000";

export const analyzeTicket = async (ticket) => {
const response = await fetch(`${API_URL}/analyze-ticket`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(ticket)
});

const data = await response.json();

if (!response.ok) {
    throw new Error(data.error || "Failed to analyze ticket");
}

return data;

};
