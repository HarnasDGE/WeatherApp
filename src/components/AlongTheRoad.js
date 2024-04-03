import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import axios, { all } from "axios";
import { APIKEY_OPENWEATHERAPI, APIKEY_TOMTOM, POPUP_ERROR } from "../constans/constans";
import { fetchWeatherApi } from 'openmeteo';
import { calculateTimeAtRoute, roundUpToFifteenMinutes } from "./methods/timeMethods";
import { getIconLink } from "./methods/iconsMethods";
import AutoMap from "./AutoMap";
import { showNotification } from "../actions/notificationActions";

class AlongTheRoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: '',
            to: '',
            controlPoints: 5,
            isLoading: false,
        }
    }
    
    inputFrom = (e) => {
        this.setState( {from: e.target.value})
    }

    inputTo = (e) => {
        this.setState( {to: e.target.value});
    }

    controlPointsChanger = (event) => {
        this.setState({controlPoints : event.target.value});
    }

    checkRoute = () => {
        const {from, to} = this.state;
        if(!from.length) {
            this.props.showNotification("Complete first input 'From'", POPUP_ERROR);
            return;
        }
        if(!to.length) {
            this.props.showNotification("Complete second input 'To'", POPUP_ERROR);
            return;
        }

        this.props.fetchRoute(from, to);
    }

    render() {
        console.log(this.props.route);
        //console.log(this.state.roadDetails);
        //const timeTravel = this.state.roadDetails.routes?.length >= 1 ? this.state.roadDetails.routes[0].summary.travelTimeInSeconds : 0;
        //const allRoad = this.state.roadDetails.routes?.length >= 1 ? [...this.state.roadDetails.routes[0].legs[0].points] : [];
        //const allLocations = this.state.weatherAlongTheRoad?.length > 0 ? [...this.state.weatherAlongTheRoad] : [];

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
                
                <button onClick={this.checkRoute}>Check Weather Along The Road</button>
            </div>

            {/* 
            <div className="weather-along-the-road">
                <div className="along-the-road-graphic">
                    <ul>
                        { this.state.weatherAlongTheRoad.map((place, index) => {
                            if(index === 0) return (<li key={`along-item${index}`}><span className="material-symbols-outlined">location_on</span></li>)
                            if(index === this.state.weatherAlongTheRoad.length-1) return (<li key={`along-item${index}`}><span className="material-symbols-outlined">pin_drop</span></li>)
                            return (<li key={`along-item${index}`}><span className="material-symbols-outlined">airline_stops</span></li>)
                        })}
                    </ul>
                </div>
                <ul>
                    {this.state.weatherAlongTheRoad.map((place, index) => {
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
                                    <p className="route-time">{calculateTimeAtRoute(place.travelTimeInSeconds)}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="automap">
                <AutoMap road={allRoad} locations={allLocations} timeTravel={timeTravel}/>
            </div>
            */}
        </div> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(AlongTheRoad);
export default Container;