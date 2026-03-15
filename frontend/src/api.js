import axios from "axios";

export const getWeatherPrediction = async (city) => {

    const response = await axios.get(
        `http://127.0.0.1:5000/predict?city=${city}`
    );

    return response.data;
};