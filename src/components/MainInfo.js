import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import loadingIcon from "../images/loading.gif";
import { APIKEY_OPENWEATHERAPI } from "../constans/constans";
import axios from "axios";
import { getIconLinkWithHour } from "./methods/iconsMethods";
import Graph from './Graph';
import Forecast from './Forecast';
import DetailsWeather from './DetailsWeather';
import { getNameDayFromData } from "./methods/timeMethods";

class MainInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            actualDay: 0
        }
    }

    convertUnixTimeToReadable = (time, timezoneOffsetInSeconds) => {
        const date = new Date((time + timezoneOffsetInSeconds) * 1000);
      
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      
        return `${hours}:${minutes}`;
      }

      setFavoritePlace = () => {
        const checkActualPlaces = this.props.favoritePlaces.find(place => place.main.name === this.props.data.main.name);
            if(!checkActualPlaces) {
            this.props.setFavoritePlace();
        }
    }

    refreshAll = () => {
        this.props.fetchPlaceInformation(this.props.nameOfPlace);
        this.refreshAllFavoritePlaces();
    }
    
    fetchDataForPlace = async (place) => {
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

    refreshAllFavoritePlaces = async () => {
        const { favoritePlaces} = this.props;
        const updatedPlaces = [];
    
        for (const place of favoritePlaces) {
            try {
                // Załóżmy, że fetchDataForPlace to funkcja, która zwraca aktualne dane dla danego miejsca
                const updatedData = await this.fetchDataForPlace(place);
                updatedPlaces.push(updatedData);
            } catch (error) {
                console.error(`Error refreshing place ${place.name}:`, error);
                updatedPlaces.push(place); 
            }
        }
        console.log(`New Array with FavoritePlaces: ${updatedPlaces}`);
        console.log(`Actual Array with FavouritePlaces: ${this.props.favoritePlaces}`)
        this.props.updateAllFavoritePlaces(updatedPlaces); // Aktualizacja całej listy ulubionych miejsc naraz
    };

    loadWeatherInformation = (day) => {
        const weatherInformation = this.props.data.daily;
        const placeInformation = this.props.data.main;
        if(placeInformation.name === "?") return [];
        return {
            time: weatherInformation.time[day].substring(0,10),
            weatherCode: weatherInformation.weatherCode[day],
            temperatureMax: weatherInformation.temperatureMax[day],
            temperatureMin: weatherInformation.temperatureMin[day],
            sunrise: weatherInformation.sunrise[day],
            sunset: weatherInformation.sunset[day],
            daylight_duration: weatherInformation.daylightDuration[day],
            sunshine_duration: weatherInformation.sunshineDuration[day],
            uv_index_max: weatherInformation.uvIndexMax[day],
            uv_index_clear_sky_max: weatherInformation.uvIndexClearSkyMax[day],
            precipitation_sum: weatherInformation.precipitationSum[day],
            rain_sum: weatherInformation.rainSum[day],
            showers_sum: weatherInformation.showersSum[day],
            snowfall_sum: weatherInformation.snowfallSum[day],
            precipitation_hours: weatherInformation.precipitationHours[day],
            precipitation_probability_max: weatherInformation.precipitationProbabilityMax[day],
            wind_speed: weatherInformation.windSpeedMax[day],
            wind_gusts: weatherInformation.windGustsMax[day],
            wind_direction: weatherInformation.windDirectionDominant[day],
            name: placeInformation.name,
            lat: placeInformation.lat,
            lon: placeInformation.lon,
            countryCode: placeInformation.countryCode
        }
    }
    

    render() {
        const weather = this.loadWeatherInformation(this.state.actualDay);
        if (weather.length < 1) return (<div id="loaing">Waiting for first data...</div>)
        const flagUrl = `https://flagcdn.com/16x12/${weather.countryCode.toLowerCase()}.png`
       return (
       <div id="content">
            <div className="controls-bar">
                <div className="title-container">
                {this.props.actualContent} 
                </div>
                <div id="controls-container">
                    <button className="control" id="favoriteBtn" onClick={this.setFavoritePlace}><span className="material-symbols-outlined">favorite</span></button>
                    <button className="control" id="refreshBtn" onClick={this.refreshAll}><span className="material-symbols-outlined">refresh</span></button>
                </div>
            </div>
            <div className="main-info">
                <img className="main-image" src={getIconLinkWithHour(weather.weatherCode, new Date())} alt="IMG"/>
                <div className="info">
                    <h2 className="place-name"><img src={flagUrl} width="24" height="16" alt={weather.countryCode}/> {weather.name}</h2>
                    <div className="second-info">
                        <p className="temperature">{`${Math.round(weather.temperatureMax * 10) / 10}°C`}</p>
                        <p className="condition-text">{`${Math.round(weather.temperatureMin * 10) / 10}°C`}</p>
                    </div>
                </div>
            </div>
            <div className="actualTime">
                <div className="actual-date">{weather.time}</div>
                <div className="actual-day">{getNameDayFromData(weather.time)}</div>
            </div>
            <Graph day={this.state.actualDay}/>
            <Forecast changeDay={(index) => this.setState({actualDay: index})}/>
            <DetailsWeather weather={weather}/>
        </div>
        );
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(MainInfo);
export default Container;