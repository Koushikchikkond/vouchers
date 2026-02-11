const API_URL = import.meta.env.VITE_API_URL;

export const api = {
    // ============================================
    // AUTHENTICATION
    // ============================================
    login: async (username, password) => {
        // Hardcoded authentication - no backend call
        const HARDCODED_USERNAME = 'koushik';
        const HARDCODED_PASSWORD = 'Koushik@8861';

        // Simulate a slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
            return {
                status: 'success',
                user: {
                    username: HARDCODED_USERNAME,
                    name: 'Koushik'
                }
            };
        } else {
            return {
                status: 'error',
                message: 'Invalid username or password'
            };
        }
    },

    requestPasswordReset: async (email) => {
        if (!API_URL) return { status: 'error', message: 'API not configured' };
        try {
            const response = await fetch(`${API_URL}?action=requestPasswordReset&email=${encodeURIComponent(email)}`);
            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error requesting password reset:", error);
            throw error;
        }
    },

    verifyOTP: async (email, otp) => {
        if (!API_URL) return { status: 'success' };
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "verifyOTP", email, otp }),
        });
        return await response.json();
    },

    resetPassword: async (email, otp, newPassword) => {
        if (!API_URL) return { status: 'success' };
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "resetPassword", email, otp, newPassword }),
        });
        return await response.json();
    },

    // ============================================
    // NODE MANAGEMENT
    // ============================================
    getNodes: async (username) => {
        if (!API_URL || API_URL.includes("YOUR_DEPLOYMENT_ID")) {
            console.warn("API URL not set or is placeholder. Returning mock data.");
            return ["Demo Project", "Office Expenses"];
        }
        try {
            const response = await fetch(`${API_URL}?action=getNodes&user=${encodeURIComponent(username)}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            return data.nodes;
        } catch (error) {
            console.error("Error fetching nodes:", error);
            return [];
        }
    },

    getNodeSummary: async (username, node) => {
        if (!API_URL) return { totalIn: 0, totalOut: 0, balance: 0, transactions: [] };
        try {
            const response = await fetch(`${API_URL}?action=getNodeSummary&user=${encodeURIComponent(username)}&node=${encodeURIComponent(node)}`);
            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error fetching node summary:", error);
            throw error;
        }
    },

    updateNode: async (username, oldNode, newNode) => {
        if (!API_URL) return { status: 'success' };
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "updateNode", user: username, oldNode, newNode }),
        });
        return await response.json();
    },

    deleteNode: async (username, node) => {
        if (!API_URL) return { status: 'success' };
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "deleteNode", user: username, node }),
        });
        return await response.json();
    },

    // ============================================
    // TRANSACTION MANAGEMENT
    // ============================================
    saveTransaction: async (transactionData) => {
        if (!API_URL) {
            console.log("Mock Save:", transactionData);
            return { status: 'success' };
        }
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "saveTransaction", ...transactionData }),
        });
        return await response.json();
    },

    updateTransaction: async (transactionData) => {
        if (!API_URL) return { status: 'success' };
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "updateTransaction", ...transactionData }),
        });
        return await response.json();
    },

    deleteTransaction: async (transactionId) => {
        if (!API_URL) return { status: 'success' };
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "deleteTransaction", rowId: transactionId }),
        });
        return await response.json();
    },

    getHistory: async (username, node, startDate, endDate) => {
        if (!API_URL) return { transactions: [] };
        const response = await fetch(`${API_URL}?action=getHistory&user=${encodeURIComponent(username)}&node=${encodeURIComponent(node)}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        return data;
    },

    // ============================================
    // EXPORT
    // ============================================
    getAllNodesExport: async (username) => {
        if (!API_URL) return { transactions: [] };
        const response = await fetch(`${API_URL}?action=getAllNodesExport&user=${encodeURIComponent(username)}`);
        return await response.json();
    }
};
