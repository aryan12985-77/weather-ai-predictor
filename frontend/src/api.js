import axios from "axios";

export const getWeatherPrediction = async (city) => {

    const response = await axios.get(
        `https://weather-ai-predictor-wnxz.onrender.com/predict?city=${city}`
    );

    return response.data;
};