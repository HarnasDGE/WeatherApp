import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";


class DetailsWeather extends React.Component {
    constructor(props) {
        super(props);

    }



    render() {
        const weather = this.props.weather;

        const optionLatLon = weather.lat && weather.lon 
        ? (
            <div className="flex-and-left">
                <span className="material-symbols-outlined">share_location</span>
                <span className="place-lat">LAT: {weather.lat}</span> 
                <span className="place-lon">LON: {weather.lon}</span>
            </div>
        )
        : "";

        const optionUv = weather.uv_index_max && weather.uv_index_clear_sky_max 
        ? (
            <div className="flex-and-left">
                <span className="hpa">UV</span>
                <p className="param">{Math.round(weather.uv_index_max * 10) / 10}/{Math.round(weather.uv_index_clear_sky_max * 10) / 10}</p>
            </div>
        )
        : "";

        const optionRainy = weather.precipitation_probability_max 
        ? (
            <div className="flex-and-left">
                <span className="material-symbols-outlined">rainy</span>
                <p className="param">{weather.precipitation_probability_max} %</p>
            </div>
        ) 
        : "";

        const optionWind = weather.wind_speed 
        ? (
            <div className="flex-and-left">
                <span className="material-symbols-outlined">wind_power</span>
                <p className="param">{Math.round(weather.wind_speed * 10) / 10} km/h <span className="material-symbols-outlined" style={{transform: `rotate(${weather.wind_direction}deg) scale(0.7)`}}>north</span></p>
            </div>
        )
        : "";

        return (
        <div className="condition">
            {optionLatLon}
            {optionUv}
            {optionRainy}
            {optionWind}
        </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(DetailsWeather);
export default Container;