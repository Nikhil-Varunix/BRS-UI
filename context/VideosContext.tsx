// context/VideosContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

type VideosContextType = {
    videos: any[];
    loading: boolean;
};

const VideosContext = createContext<VideosContextType>({
    videos: [],
    loading: true,
});

export const VideosProvider = ({ children }: { children: ReactNode }) => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/videos/`);
                setVideos(response.data);
            } catch (err) {
                console.error("Videos API error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <VideosContext.Provider value={{ videos, loading }}>
            {children}
        </VideosContext.Provider>
    );
};

export const useVideos = () => {
    const context = useContext(VideosContext);
    if (!context) throw new Error("useVideos must be used within a VideosProvider");
    return context;
};
