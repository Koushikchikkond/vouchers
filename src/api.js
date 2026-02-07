const API_URL = import.meta.env.VITE_API_URL;

export const api = {
    getNodes: async () => {
        // Check if API_URL is missing or still has the placeholder
        if (!API_URL || API_URL.includes("YOUR_DEPLOYMENT_ID")) {
            console.warn("API URL not set or is placeholder. Returning mock data.");
            return ["Demo Project", "Office Expenses"];
        }
        try {
            const response = await fetch(`${API_URL}?action=getNodes`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            return data.nodes;
        } catch (error) {
            console.error("Error fetching nodes:", error);
            return []; // Return empty array on error to prevent infinite loading
        }
    },

    saveTransaction: async (transactionData) => {
        if (!API_URL) {
            console.log("Mock Save:", transactionData);
            return { status: 'success' };
        }
        // Google Apps Script `doPost` requires sending data as a stringified body 
        // and sometimes doesn't support CORS purely, so typically we use `no-cors` or just standard POST.
        // However, `Content-Type: text/plain` is often needed to avoid preflight issues with GAS.
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "saveTransaction", ...transactionData }),
        });
        return await response.json();
    },

    getHistory: async (node, startDate, endDate) => {
        if (!API_URL) return [];
        const response = await fetch(`${API_URL}?action=getHistory&node=${encodeURIComponent(node)}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        return data.transactions;
    }
};
