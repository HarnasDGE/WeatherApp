import axios from "axios";
import { APIKEY_OPENWEATHERAPI } from "../../constans/constans";

export const fetchDataForPlace = async (place) => {
    const {lat, lon} = place.coord;
    const {name} = place;

    let newDataPlace = [];
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY_OPENWEATHERAPI}`);
        newDataPlace = {...response.data, name: name};
    } catch (error) {
        console.log(`(error) fetchDataForPlace ${error.message}`);
      }
      return newDataPlace;
};

export const fetchDataFromCoords = async (lat, lon) => {

    let newDataPlace = [];
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY_OPENWEATHERAPI}`);
        newDataPlace = response.data;
    } catch (error) {
        console.log(`(error) fetchDataForPlace ${error.message}`);
      }
      return newDataPlace;
};

