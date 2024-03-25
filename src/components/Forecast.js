import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import {convertUnixTimeToReadable} from './methods/timeMethods'

class Forecast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actualDay: "Saturday",
        }
    }

    displayDayOfWeek = (data) => {
        const timestamp = data.dt;
        const date = new Date(timestamp * 1000);
    
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[date.getDay()];

    }

    changeActualDay = (e) => {
        const newDay = e.currentTarget.getAttribute('data-value');
        console.log(newDay);
        this.setState({
            actualDay: newDay
        })

        console.log(this.state.actualDay)
    }


    render() {
        const fourDayForeCast = this.props.forecast.list.filter(day => convertUnixTimeToReadable(day.dt, this.props.data.timezone) === "13:00");
        
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
                    {fourDayForeCast.map((day, index) => {
                    if(this.displayDayOfWeek(day) !== this.state.actualDay) {
                        return (
                            <li key={`foreDay${index}`} className="forecast-item-list" data-value={this.displayDayOfWeek(day)} onClick={this.changeActualDay}>
                                <div className="main-info-forecast">
                                    <img className="forecast-image" src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@2x.png`} alt="Weather icon"/>
                                    <p className="forecast-temperature">{Math.floor(day.main.temp)} °C</p>
                                    <h2 className="name-of-day">{this.displayDayOfWeek(day)}</h2>
                                </div>
                            </li>
                        )
                    } else {
                        return (
                            <li className="forecast-active-item-list">
                                <div className="forecast-actual-day">
                                    <div className="main-info">
                                        <img className="main-image" src={`https://openweathermap.org/img/wn/${day.weather?.[0].icon}@2x.png`} alt="IMG"/>
                                        <div className="info">
                                            <h2 className="place-name">{this.props.nameOfPlace ? this.props.nameOfPlace : day.name}</h2>
                                            <div className="second-info">
                                                <p className="temperature">{Math.floor(day.main.temp)} °C</p>
                                                <p className="condition-text">{day.weather?.[0].main}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="forecast-actualTime">13:00<span className="actual-day-name">{this.state.actualDay}</span></div>
                                </div>
                                <div className="forecast-details">
                                    <div className="forecast-detail">
                                        <span className="hpa">hPa</span>
                                        <p className="condition-pressure">{day.main.pressure} hPa</p>
                                    </div>
                                    <div className="forecast-detail">
                                        <span className="material-symbols-outlined">humidity_percentage</span>
                                        <p className="condition-humidity">{day.main.humidity} %</p>
                                    </div>
                                    <div className="forecast-detail">
                                        <span className="material-symbols-outlined">visibility</span>
                                        <p className="condition-visinility">{day.visibility} m</p>
                                    </div>
                                    <div className="forecast-detail">
                                        <span className="material-symbols-outlined">wind_power</span>
                                        <p className="condition-visinility">{day.wind.speed} km/h</p>
                                    </div>
                                </div>
                            </li>
                        )
                    }     
                    })}
                </ul>
            </div>
        </div> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Forecast);
export default Container;