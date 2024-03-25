import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import axios from "axios";
import { APIKEY_OPENWEATHERAPI, APIKEY_TOMTOM } from "../constans/constans";
import { fetchWeatherApi } from 'openmeteo';
import { roundUpToFifteenMinutes } from "./methods/timeMethods";
import { getIconLink } from "./methods/iconsMethods";
import AutoMap from "./AutoMap";



class AlongTheRoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roadDetails: [],
            from: '',
            to: '',
            weatherAlongTheRoad: [],
            controlPoints: 5,
            isLoading: false,
            loadingProcent: 0,
        }
    }
    
    fetchCoordPlaces = async (from, to) => {
        try {
            const responseFrom = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${from}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`)
            try {
                const responseTo = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${to}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`)
                const coord = {
                    from: {
                        name: responseFrom.name,
                        lat: responseFrom.data[0].lat,
                        lon: responseFrom.data[0].lon
                    },
                    to: {
                        name: responseTo.name,
                        lat: responseTo.data[0].lat,
                        lon: responseTo.data[0].lon
                    }
                  }
                  this.setState( { loadingProcent: 25});
                  this.setRoute(coord)
            } catch (error) {
                console.log(`Error ResponseTo ${error.message}`)
            }
        } catch (error) {
            console.log(`Error ResponseTo ${error.message}`)
        }
    }

    setRoute = async (coord) => {
        const startPoint = `${coord.from.lat},${coord.from.lon}`;
        const endPoint = `${coord.to.lat},${coord.to.lon}`;

        try {
            const response = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${startPoint}:${endPoint}/json?key=${APIKEY_TOMTOM}`);
            
            this.setState({ loadingProcent: 40, roadDetails: response.data }, () => {
                this.control();
              });
        } catch (error) {
            console.log(`Error setRoute ${error.message}`);
        }
    }

    control = async () => {
        try {
            const weatherAlongTheRoad = await this.checkWeather();
            this.setState({isLoading: false, loadingProcent: 0, weatherAlongTheRoad: weatherAlongTheRoad})
        }  catch(error) {
            console.log(`Error setState weatherAlongTheRoad ${error.message}`);
        }
    }

    inputFrom = (e) => {
        this.setState( {from: e.target.value})
    }

    inputTo = (e) => {
        this.setState( {to: e.target.value});
    }

    checkRoad = () => {
        this.setState( {isLoading: true, loadingProcent: 10});
        this.fetchCoordPlaces(this.state.from, this.state.to);
    }

    checkWeather = async () => {
        this.setState( { loadingProcent: 50});
        const routeCoords = this.state.roadDetails.routes[0].legs[0].points;
        const startCoords = `${routeCoords[0].latitude},${routeCoords[0].longitude}`;
        const interval = Math.floor(routeCoords.length / this.state.controlPoints + 1);
        console.log(`Interval: ${interval}`);
        const selectedCoords = routeCoords.filter((_, index) => index % interval === 0 || index === routeCoords.length - 1);
        console.log(`selectedCoords: ${selectedCoords}`);

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        const weatherDetails = await Promise.all(selectedCoords.map(async (coord, index) => {
            await delay(index * 1000);
            this.setState((prevState) => {
                return {loadingProcent: prevState.loadingProcent + Math.floor(50/prevState.controlPoints-1)};
              });
            const pointCoords = `${coord.latitude},${coord.longitude}`;
            const responseTomTom = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${startCoords}:${pointCoords}/json?key=${APIKEY_TOMTOM}`);
            const lengthInMeters = responseTomTom.data.routes[0].summary.lengthInMeters;
            const travelTimeInSeconds = responseTomTom.data.routes[0].summary.travelTimeInSeconds;
            const timeToGetThisPoint = responseTomTom.data.routes[0].summary.arrivalTime.substring(0, 16);
            const dayForecast = timeToGetThisPoint.substring(0,10);
            const roundedTime = roundUpToFifteenMinutes(timeToGetThisPoint);

            const params = {
                "latitude": coord.latitude,
                "longitude": coord.longitude,
                "minutely_15": ["temperature_2m", "weather_code", "is_day"],
                "start_date": dayForecast,
                "end_date": dayForecast
            };
            const url = "https://api.open-meteo.com/v1/forecast";
            const openMeteoResponses = await fetchWeatherApi(url, params);

            const range = (start, stop, step) =>
	        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

            const response = openMeteoResponses[0];

            // Attributes for timezone and location
            const utcOffsetSeconds = response.utcOffsetSeconds();

            const minutely15 = response.minutely15();

            // Note: The order of weather variables in the URL query and the indices below need to match!
            const weatherData = {
                minutely15: {
                    time: range(Number(minutely15.time()), Number(minutely15.timeEnd()), minutely15.interval()).map(
                        (t) => new Date((t + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: minutely15.variables(0).valuesArray(),
                    weatherCode: minutely15.variables(1).valuesArray(),
                    isDay: minutely15.variables(2).valuesArray(),
                },
            };

            const roundedDateTime = new Date(roundedTime);

            // Znajdowanie indeksu używając findIndex i porównując zaokrąglone czas
            const timeIndex = weatherData.minutely15.time.findIndex(t => {
                // Zaokrąglanie każdego czasu w tablicy do kwadransów
                const rounded = roundUpToFifteenMinutes(t.toISOString().substring(0, 16));
                const roundedDate = new Date(rounded);
                // Porównanie, czy zaokrąglony czas jest równy roundedTime
                return roundedDate.getTime() === roundedDateTime.getTime();
            });
            let weather = [];
            if(timeIndex !== -1) {
                weather = {
                    time: roundedDateTime,
                    temperature_2m: weatherData.minutely15.temperature2m[timeIndex],
                    weather_code: weatherData.minutely15.weatherCode[timeIndex],
                    isDay: weatherData.minutely15.isDay[timeIndex]
                }
            }

            console.log(`////////// WeatherData ///////`);
            console.log(weather);

            const openWeatherMapResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${coord.latitude}&lon=${coord.longitude}&limit=1&appid=${APIKEY_OPENWEATHERAPI}`);
            const locationName = openWeatherMapResponse.data[0]?.name || "Place on the road";

            return {
                name: locationName,
                lengthInMeters: lengthInMeters,
                travelTimeInSeconds: travelTimeInSeconds,
                temperature: `${Math.round(weather.temperature_2m * 10) / 10}°C`,
                code: weather.weather_code,
                isDay: weather.isDay
            };
        }))
        console.log(`///////// weatherDetails ////////`);
        console.table(weatherDetails);
        return weatherDetails;
    }

    controlPointsChanger = (event) => {
        this.setState({controlPoints : event.target.value});
      }

    render() {

        const whenIsLoading = (
            <div className="loading">
                Loading ... {this.state.loadingProcent} %
            </div>
        );

        const allRoad = this.state.roadDetails.length > 0 ? this.state.roadDetails.routes[0].legs[0].points : [];
        console.log(`AllROad: `, allRoad)
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

            <div className="menu-road-information">
                <input placeholder="From..." id="road-from" type="text" onChange={this.inputFrom} value={this.state.from}/>
                <input placeholder="To..." id="road-to" type="text" onChange={this.inputTo} value={this.state.to}/>
                <div className="controls">
                    <label htmlFor="controlPoints">Control Points: {this.state.controlPoints}<input type="range" min="3" max="20" name="controlPoints" id="controlPoints" value={this.state.controlPoints} onChange={this.controlPointsChanger}/></label>
                </div>
                
                <button onClick={this.checkRoad}>Check Weather Along The Road</button>
            </div>

            {this.state.isLoading ? whenIsLoading : ""}
            
            <div className="weather-along-the-road">
                <div className="along-the-road-graphic">
                    <ul>
                        { this.state.weatherAlongTheRoad.map((place, index) => {
                            if(index === 0) return (<li><span className="material-symbols-outlined">location_on</span></li>)
                            if(index === this.state.weatherAlongTheRoad.length-1) return (<li><span className="material-symbols-outlined">pin_drop</span></li>)
                            return (<li><span className="material-symbols-outlined">airline_stops</span></li>)
                        })}
                    </ul>
                </div>
                <ul>
                    {this.state.weatherAlongTheRoad.map((place, index) => {
                        const today = new Date();
                        let millisecondsToAdd = place.travelTimeInSeconds * 1000; 
                        let newTime = new Date(today.getTime() + millisecondsToAdd);
                        let formattedTime = newTime.toTimeString().slice(0, 5);
                
                        return (
                            <li key={`along-item${index}`} className="along-item">
                                <div className="along-item-weather">
                                    <img src={getIconLink(place.code, place.isDay)} alt="Weather icon"/>
                                    <div className="information">
                                        <h2>{place.name}</h2>
                                        <p>{place.temperature}</p>
                                    </div>
                                </div>
                                <div className="along-item-route">
                                    <p className="route-km">{Math.floor(place.lengthInMeters/1000)} KM</p>
                                    <p className="route-time">{formattedTime}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="automap">
                <AutoMap road={allRoad}/>
            </div>
        </div> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(AlongTheRoad);
export default Container;