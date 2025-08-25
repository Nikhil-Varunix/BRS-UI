// context/SchemesContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";

// If using react-native-dotenv
import { API_BASE_URL } from "../config";

type SchemesContextType = {
    schemes: any[];
    loading: boolean;
};

const SchemesContext = createContext<SchemesContextType>({
    schemes: [],
    loading: true,
});

export const SchemesProvider = ({ children }: { children: ReactNode }) => {
    const [schemes, setSchemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching schemes...");
        const fetchSchemes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/schemes/`);
                setSchemes(response.data);
            } catch (err) {
                console.error("Schemes API error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemes();
    }, []);


    return (
        <SchemesContext.Provider value={{ schemes, loading }}>
            {children}
        </SchemesContext.Provider>
    );
};

export const useSchemes = () => {
    const context = useContext(SchemesContext);
    if (!context) throw new Error("useSchemes must be used within a SchemesProvider");
    return context;
};
