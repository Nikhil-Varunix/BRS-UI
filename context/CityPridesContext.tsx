// context/CityPridesContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

type CityPridesContextType = {
    cityPrides: any[];
    loading: boolean;
};

const CityPridesContext = createContext<CityPridesContextType>({
    cityPrides: [],
    loading: true,
});

export const CityPridesProvider = ({ children }: { children: ReactNode }) => {
    const [cityPrides, setCityPrides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCityPrides = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/cities`);
                setCityPrides(response.data);
            } catch (err) {
                console.error("CityPrides API error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCityPrides();
    }, []);

    return (
        <CityPridesContext.Provider value={{ cityPrides, loading }}>
            {children}
        </CityPridesContext.Provider>
    );
};

export const useCityPrides = () => {
    const context = useContext(CityPridesContext);
    if (!context) throw new Error("useCityPrides must be used within a CityPridesProvider");
    return context;
};
