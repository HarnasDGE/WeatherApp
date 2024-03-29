import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import { getIconLink } from "./methods/iconsMethods";
import { getNameDayFromData } from "./methods/timeMethods";

class Forecast extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {      
        const weather = this.props.data.daily;  
        return (
            
            <div className="forecast">
                <ul>
                    {weather.time.map((time, index) => {

                        return (
                            <li key={`fore${index}`} onClick={() => this.props.changeDay(index)}> 
                                <h3>{getNameDayFromData(time)}</h3>
                                <img src={getIconLink(weather.weatherCode[index], true)} alt="Weather Img"/>
                                <p>{Math.round(weather.temperatureMax[index] * 10)/10} °C</p>
                                <p>{Math.round(weather.precipitationSum[index] * 10)/10} %</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Forecast);
export default Container;