import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import loadingIcon from "../images/loading.gif";
import { APIKEY_OPENWEATHERAPI } from "../constans/constans";
import axios from "axios";

class MainInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    
    convertUnixTimeToReadable = (time, timezoneOffsetInSeconds) => {
        const date = new Date((time + timezoneOffsetInSeconds) * 1000);
      
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      
        return `${hours}:${minutes}`;
      }

      setFavoritePlace = () => {
        const checkActualPlaces = this.props.favoritePlaces.find(place => place.name === this.props.nameOfPlace);
            if(!checkActualPlaces) {
            this.props.setFavoritePlace();
        }
    }

    refreshAll = () => {
        console.log(`Im in refreshAll`)
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
    

    render() {
        console.log(this.props.data);
        const weatherInformation = this.props.data;
        const loadingPageIcon = (<img src={loadingIcon} alt="Loading..."/>);
        const informationContainer = weatherInformation.name 
        ? (
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
                <img className="main-image" src={`https://openweathermap.org/img/wn/${weatherInformation.weather[0].icon}@2x.png`} alt="IMG"/>
                <div className="info">
                    <h2 className="place-name">{this.props.nameOfPlace ? this.props.nameOfPlace : weatherInformation.name}</h2>
                    <div className="second-info">
                        <p className="temperature">{Math.floor(weatherInformation.main.temp - 273.15)} °C</p>
                        <p className="condition-text">{weatherInformation.weather[0].main}</p>
                    </div>
                </div>
            </div>
            <div className="actualTime">
                {this.convertUnixTimeToReadable(weatherInformation.dt, weatherInformation.timezone)}
            </div>
            <div className="sunrise-sunset">
                <div className="sunrise">
                    <span className="material-symbols-outlined">wb_sunny</span>
                    <p className="time-sun">{this.convertUnixTimeToReadable(weatherInformation.sys.sunrise, weatherInformation.timezone)}</p>
                </div>
                <div className="sunset">
                    <span className="material-symbols-outlined">nights_stay</span>
                    <p className="time-sun">{this.convertUnixTimeToReadable(weatherInformation.sys.sunset, weatherInformation.timezone)}</p>
                </div>
            </div>
            <div className="condition">
                <div className="flex-and-left">
                    <span className="material-symbols-outlined">share_location</span>
                    <span className="place-lat">LAT: {weatherInformation.coord.lat}</span> 
                    <span className="place-lon">LON: {weatherInformation.coord.lon}</span>
                </div>
                <div id="condition-info" className="flex-and-left">
                    <span className="hpa">hPa</span>
                    <p className="condition-pressure">{weatherInformation.main.pressure} hPa</p>
                </div>
                <div className="flex-and-left">
                    <span className="material-symbols-outlined">humidity_percentage</span>
                    <p className="condition-humidity">{weatherInformation.main.humidity} %</p>
                </div>
                <div className="flex-and-left">
                    <span className="material-symbols-outlined">visibility</span>
                    <p className="condition-visinility">{weatherInformation.visibility} m</p>
                </div>
                <div className="flex-and-left">
                    <span className="material-symbols-outlined">wind_power</span>
                    <p className="condition-visinility">{weatherInformation.wind.speed} km/h</p>
                </div>
            </div>
        </div>)
    : loadingPageIcon;
        return informationContainer;
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(MainInfo);
export default Container;