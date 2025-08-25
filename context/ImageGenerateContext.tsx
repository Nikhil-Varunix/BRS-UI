// context/ImageGenerateContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

type ImageGenerateContextType = {
    images: any[];
    loading: boolean;
};

const ImageGenerateContext = createContext<ImageGenerateContextType>({
    images: [],
    loading: true,
});

export const ImageGenerateProvider = ({ children }: { children: ReactNode }) => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/images`);
                setImages(response.data);
            } catch (err) {
                console.error("Images API error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return (
        <ImageGenerateContext.Provider value={{ images, loading }}>
            {children}
        </ImageGenerateContext.Provider>
    );
};

export const useImageGenerate = () => {
    const context = useContext(ImageGenerateContext);
    if (!context) throw new Error("useImageGenerate must be used within an ImageGenerateProvider");
    return context;
};
