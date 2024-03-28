import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import loadingIcon from "../images/loading.gif";
import { APIKEY_OPENWEATHERAPI } from "../constans/constans";
import axios from "axios";
import { getIconLinkWithHour } from "./methods/iconsMethods";
import * as d3 from 'd3';


class MainInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            actualDay: 0
        }
    }

    componentDidMount() {
        this.drawPrecipitationChart();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data && this.props.data) {
            d3.select("#precipitation").select("svg").remove(); // Usuń istniejący wykres
            this.drawPrecipitationChart(); // Narysuj nowy wykres
        }
    }

    drawPrecipitationChart = () => {
        if(!this.props.data.hourly) return;
        d3.select("#precipitation svg").remove();

        const hours = this.props.data.hourly.time;
        console.log(this.props.data.hourly);
        const precipitationLevels = this.props.data.hourly.precipitationProbability;
        const hourlyForecast = hours.slice(hours.length-24).map((hour, index) => ({hour: hour.toISOString().substring(11,16), value: precipitationLevels[index]}));
        
        const temperatureLevels = this.props.data.hourly.temperature2m;
        const temperatureForecast = hours.slice(hours.length-24).map((hour, index) => ({hour: hour.toISOString().substring(11,16), value: Math.round(temperatureLevels[index])}));
        
        const weatherCodes = this.props.data.hourly.weatherCode;
        const weatherCodesForecast = hours
        .slice(hours.length-24)
        .map((hour, index) => ({
            hour: hour.toISOString().substring(11,16),
            value: getIconLinkWithHour(weatherCodes[index], hour)
        
            }));
        
        // Rozmiary i marginesy dla wykresu
        const margin = { top: 20, right: 20, bottom: 20, left: 20 },
        width = 800 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

        // Skala dla osi X
        const x = d3.scaleBand()
        .range([0, width])
        .domain(hourlyForecast.map(d => d.hour))
        .padding(0.2); // Dodaje trochę przestrzeni między słupkami

        // Skala dla osi Y
        const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 100]);

            // Skala dla osi Y (temperatura)
        const yTemperature = d3.scaleLinear()
        .range([height, 0])
        .domain([d3.min(temperatureForecast, d => d.value)-5, d3.max(temperatureForecast, d => d.value)+5]);

        const svg = d3.select("#precipitation").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top}) `);

        // Dodanie słupków
        svg.selectAll(".bar")
        .data(hourlyForecast)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.hour))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", "steelblue");

        const lineGenerator = d3.line()
            .x(d => x(d.hour) + x.bandwidth() / 2) // Centrowanie linii w pasmach
            .y(d => yTemperature(d.value))
            .curve(d3.curveMonotoneX); // Dla gładkiej linii

        svg.selectAll(".temperature-line").remove();

        svg.append("path")
            .datum(temperatureForecast) // Przekazanie danych temperatury
            .attr("class", "temperature-line") // Dodanie klasy dla potencjalnego łatwiejszego usuwania
            .attr("fill", "none")
            .attr("stroke", "orangered") // Kolor linii
            .attr("stroke-width", 1)
            .attr("d", lineGenerator);

        svg.selectAll(".dot")
            .data(temperatureForecast)
            .enter().append("circle") // Dodaje kropki
            .attr("class", "dot") // Klasa CSS dla stylizacji, jeśli potrzebna
            .attr("cx", d => x(d.hour) + x.bandwidth() / 2)
            .attr("cy", d => yTemperature(d.value))
            .attr("r", 4) // Promień kropki
            .style("fill", "#ff4500"); // Kolor kropki
        
        // Dodanie osi X
        svg.append("g")
            .attr("transform", `translate(0,${height}) `)
            .call(d3.axisBottom(x));

        svg.selectAll(".temperatureText")
            .data(temperatureForecast)
            .enter().append("text")
            .attr("class", "temperatureText") // Klasa CSS dla stylizacji, jeśli potrzebna
            .attr("x", d => x(d.hour) + x.bandwidth() / 2)
            .attr("y", d => yTemperature(d.value) - 10) // Aby tekst był trochę powyżej kropki
            .text(d => `${d.value}`) // Tekst do wyświetlenia
            .attr("text-anchor", "middle") // Centruje tekst względem punktu
            .style("fill", "#ff4500") // Kolor tekstu
            .style("font-size", "12px"); // Rozmiar czcionki

        // Dodanie tekstu dla opadów
        svg.selectAll(".precipitation-text")
            .data(hourlyForecast)
            .enter().append("text")
            .attr("class", "precipitation-text") // Klasa dla stylizacji, jeśli jest potrzebna
            .attr("x", d => x(d.hour) + x.bandwidth() / 2) // Wycentrowanie tekstu na słupku
            .attr("y", d => y(d.value) - 5) // Ustawienie tekstu nieco powyżej słupka
            .text(d => d.value !== 0 ? `${d.value}%` : '') // Wyświetlenie wartości opadów
            .attr("text-anchor", "middle") // Centrowanie tekstu względem punktu x
            .style("fill", "steelblue") // Kolor tekstu
            .style("font-size", "12px"); // Rozmiar czcionki

            // Dodanie obrazków
        svg.selectAll(".weather-icon")
            .data(weatherCodesForecast) // Użyj swoich danych pogodowych
            .enter().append("image")
            .attr("xlink:href", d => d.value) // Ustaw źródło obrazka na podstawie warunku pogodowego
            .attr("x", d => x(d.hour) + (x.bandwidth() / 2) - 15) // Wycentrowanie obrazka względem słupka/godziny, -10 dla przykładowego rozmiaru ikony 20x20
            .attr("y", d => y(120)) // Ustawienie obrazka nieco powyżej słupka
            .attr("width", 30) // Szerokość ikony
            .attr("height", 30); // Wysokość ikony
    };
    
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

    loadWeatherInformation = (day) => {
        if (!this.props.data || !this.props.data.daily) {
            return {
                time: "?",
                code: "?",
                temperature: "?",
                sunrise: "?",
                sunset: "?",
                daylight_duration: "?",
                sunshine_duration: "?",
                uv_index_max: "?",
                uv_index_clear_sky_max: "?",
                precipitation_sum: "?",
                rain_sum: "?",
                showers_sum: "?",
                snowfall_sum: "?",
                precipitation_hours: "?",
                precipitation_probability_max: "?",
                wind_speed: "?",
                wind_gusts: "?",
                wind_direction: "?",
            };
        }
        const weatherInformation = this.props.data.daily;
        const placeInformation = this.props.data.main;

        const defaultData = ["?","?","?","?","?"];
        return {
            time: weatherInformation.time && weatherInformation.time[day] ? weatherInformation.time[day].toISOString().substring(0,10) : defaultData[day],
            code: weatherInformation.weatherCode && weatherInformation.weatherCode[day] ? weatherInformation.weatherCode[day] : defaultData[day],
            temperatureMax: weatherInformation.temperature2mMax && weatherInformation.temperature2mMax[day] ? weatherInformation.temperature2mMax[day] : defaultData[day],
            temperatureMin: weatherInformation.temperature2mMin && weatherInformation.temperature2mMin[day] ? weatherInformation.temperature2mMin[day] : defaultData[day],
            sunrise: weatherInformation.sunrise && weatherInformation.sunrise[day] ? weatherInformation.sunrise[day] : defaultData[day],
            sunset: weatherInformation.sunset && weatherInformation.sunset[day] ? weatherInformation.sunset[day] : defaultData[day],
            daylight_duration: weatherInformation.daylightDuration && weatherInformation.daylightDuration[day] ? weatherInformation.daylightDuration[day] : defaultData[day],
            sunshine_duration: weatherInformation.sunshineDuration && weatherInformation.sunshineDuration[day] ? weatherInformation.sunshineDuration[day] : defaultData[day],
            uv_index_max: weatherInformation.uvIndexMax && weatherInformation.uvIndexMax[day] ? weatherInformation.uvIndexMax[day].toString().substring(0,4) : defaultData,
            uv_index_clear_sky_max: weatherInformation.uvIndexClearSkyMax && weatherInformation.uvIndexClearSkyMax[day] ? weatherInformation.uvIndexClearSkyMax[day].toString().substring(0,4) : defaultData[day],
            precipitation_sum: weatherInformation.precipitationSum && weatherInformation.precipitationSum[day] ? weatherInformation.precipitationSum[day] : defaultData[day],
            rain_sum: weatherInformation.rainSum && weatherInformation.rainSum[day] ? weatherInformation.rainSum[day] : defaultData[day],
            showers_sum: weatherInformation.showersSum && weatherInformation.showersSum[day] ? weatherInformation.showersSum[day] : defaultData[day],
            snowfall_sum: weatherInformation.snowfallSum && weatherInformation.snowfallSum[day] ? weatherInformation.snowfallSum[day] : defaultData[day],
            precipitation_hours: weatherInformation.precipitationHours && weatherInformation.precipitationHours[day] ? weatherInformation.precipitationHours[day] : defaultData[day],
            precipitation_probability_max: weatherInformation.precipitationProbabilityMax && weatherInformation.precipitationProbabilityMax[day] ? weatherInformation.precipitationProbabilityMax[day] : defaultData[day],
            wind_speed: weatherInformation.windSpeed10mMax && weatherInformation.windSpeed10mMax[day] ? weatherInformation.windSpeed10mMax[day].toString().substring(0,5) : defaultData[day],
            wind_gusts: weatherInformation.windGusts10mMax && weatherInformation.windGusts10mMax[day] ? weatherInformation.windGusts10mMax[day] : defaultData[day],
            wind_direction: weatherInformation.windDirection10mDominant && weatherInformation.windDirection10mDominant[day] ? weatherInformation.windDirection10mDominant[day] : defaultData[day],
        
            name: placeInformation.name ? placeInformation.name : "?",
            lat: placeInformation.lat ? placeInformation.lat.toString().substring(0,5) : "?",
            lon: placeInformation.lon ? placeInformation.lon.toString().substring(0,5) : "?",

        }
    }
    

    render() {
        const weather = this.loadWeatherInformation(this.state.actualDay);
        console.log(`renderMainInfo`);
        console.table(this.props.data);
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
                <img className="main-image" src={getIconLinkWithHour(weather.code, new Date(weather.time))} alt="IMG"/>
                <div className="info">
                    <h2 className="place-name">{weather.name}</h2>
                    <div className="second-info">
                        <p className="temperature">{`${Math.round(weather.temperatureMax * 10) / 10}°C`}</p>
                        <p className="condition-text">{`${Math.round(weather.temperatureMin * 10) / 10}°C`}</p>
                    </div>
                </div>
            </div>
            <div className="actualTime">
                {weather.time}
            </div>
            <div className="precipitation" id="precipitation">
                
            </div>
            <div className="condition">
                <div className="flex-and-left">
                    <span className="material-symbols-outlined">share_location</span>
                    <span className="place-lat">LAT: {weather.lat}</span> 
                    <span className="place-lon">LON: {weather.lon}</span>
                </div>
                <div className="flex-and-left">
                <span className="hpa">UV</span>
                <p className="param">{weather.uv_index_max}/{weather.uv_index_clear_sky_max}</p>
                </div>
                <div className="flex-and-left">
                    <span className="material-symbols-outlined">rainy</span>
                    <p className="param">{weather.precipitation_probability_max} %</p>
                </div>
                <div className="flex-and-left">
                    <span className="material-symbols-outlined">wind_power</span>
                    <p className="param">{weather.wind_speed} km/h <span className="material-symbols-outlined" style={{transform: `rotate(${weather.wind_direction}deg) scale(0.7)`}}>north</span></p>
                </div>
            </div>
        </div>
        );
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(MainInfo);
export default Container;