import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import axios from "axios";
import { APIKEY_OPENWEATHERAPI } from "../constans/constans";


class FourDays extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fourDayForeCast: []
        }
    }
    componentDidMount() {
        const { lat, lon } = this.props.data.coord;

        const units = 'metric'; // Use metric units
        console.log(this.props.data)
        // Construct the URL for the API call
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY_OPENWEATHERAPI}&units=${units}`;

        axios.get(url)
            .then(response => {
                const timezoneOffset = response.data.city.timezone; // Przesunięcie strefy czasowej w sekundach
                const filteredForecasts = response.data.list.filter(forecast => {
                    const date = new Date((forecast.dt + timezoneOffset) * 1000); // Dostosowanie do czasu lokalnego
                    const hour = date.getUTCHours(); // Pobranie godziny UTC po uwzględnieniu przesunięcia
                    // Wybór prognozy najbliżej godziny 12:00, w zakresie od 11 do 14
                    return hour >= 11 && hour <= 14;
                }).slice(0, 4); // Limit do pierwszych 4 pasujących wpisów, po jednym na dzień

                this.setState({ fourDayForeCast: filteredForecasts });
            })
            .catch(error => {
                console.error("Błąd podczas pobierania danych pogodowych:", error);
            });
    }


    displayDayOfWeek = (data) => {
        const timestamp = data.dt;
        const date = new Date(timestamp * 1000);
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
    
        if (date.getFullYear() === tomorrow.getFullYear() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getDate() === tomorrow.getDate()) {
            return "Tomorrow";
        } else {
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return daysOfWeek[date.getDay()];
        }
    }


    render() {
        const { fourDayForeCast } = this.state;
        console.log(`render: ${fourDayForeCast}`);
        fourDayForeCast.forEach(day => console.log(day));

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
            <div id="forecast">
                <ul>
                    {fourDayForeCast.map((day, index) => (
                    <li key={`foreDay${index}`} className="forecast-day">
                        <div className="main-info-forecast">
                            <img className="forecast-image" src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@2x.png`} alt="Weather icon"/>
                            <p className="forecast-temperature">{Math.floor(day.main.temp)} °C</p>
                            <h2 className="name-of-day">{this.displayDayOfWeek(day)}</h2>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(FourDays);
export default Container;