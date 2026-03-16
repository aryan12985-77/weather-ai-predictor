import axios from "axios";

export const getWeatherPrediction = async (city) => {

    const response = await axios.get(
        `http://192.168.0.163:10000/predict?city=${city}`
    );

    return response.data;
};