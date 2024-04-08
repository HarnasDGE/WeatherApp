import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import { POPUP_ERROR } from "../constans/constans";
import { calculateTimeAtRoute, roundUpToFifteenMinutes } from "./methods/timeMethods";
import { getIconLink } from "./methods/iconsMethods";
import AutoMap from "./automap/AutoMap";

class AlongTheRoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: '',
            to: '',
            isLoading: false,
            options: {
                isTemperatureOnMap: false,
                isAlternativeRoutesOnMap: true,
            }
        }
    }
    
    inputFrom = (e) => {
        this.setState( {from: e.target.value})
    }

    inputTo = (e) => {
        this.setState( {to: e.target.value});
    }

    controlPointsChanger = (event) => {
        this.props.setControlPoints(event.target.value);    
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

        this.props.fetchAllDataAboutRoute(from, to);
    }

    toggleTemperatureOnMap = () => {
        this.setState((prevState) => ({
            options: {
                ...prevState.options,
                isTemperatureOnMap: !prevState.options.isTemperatureOnMap
            }
        }))
    }

    toggleAlternativeRoutesOnMap = () => {
        this.setState((prevState) => ({
            options: {
                ...prevState.options,
                isAlternativeRoutesOnMap: !prevState.options.isAlternativeRoutesOnMap
            }
        }))
    }

    setRouteType = (e) => {
        this.props.setRouteType(e.target.value);
    }

    checkWeatherOnRoute = () => {
        if (!this.props.route.routes) return [];
        const { weatherOnRoute, route } = this.props;
        const mainRoute = route.routes[0].legs[0].points;
        let actualWeather = [];
        for (let weather of weatherOnRoute) {
            let allPlacesInRoute = true; 
            for (let place of weather) {
                let isInRoute = mainRoute.some(point => point.latitude === place.lat && point.longitude === place.lon);
                if (!isInRoute) {
                    allPlacesInRoute = false;
                    break;  
                }
            }
            if (allPlacesInRoute) {
                actualWeather = weather;
                break;
            }
        }
        return actualWeather;
    }

    setFavoriteRoute = () => {
        this.props.setFavoriteRoute();
    }

    render() {
        const route = this.props.route;
        const weatherOnRoute = this.checkWeatherOnRoute();
        const controlPoints = this.props.controlPoints;
        const options = this.state.options;
        let allRoutes = [];

        if(route.routes?.length >= 1) {
            allRoutes = route.routes.map(route => ({
               travelTimeInSeconds: route.summary.travelTimeInSeconds,
               points: route.legs[0].points
            }))
            allRoutes = options.isAlternativeRoutesOnMap ? allRoutes : allRoutes.slice(0,1) ;
        }
        const allLocations = weatherOnRoute?.length > 0 ? [...weatherOnRoute] : [];

        return (
        <div id="content">
            <div className="controls-bar">
                <div className="title-container">
                    {this.props.actualContent} 
                </div>
                <div id="controls-container">
                    <button className="control" id="favoriteBtn" onClick={this.setFavoriteRoute}><span className="material-symbols-outlined">favorite</span></button>
                    <button className="control" id="refreshBtn" onClick={this.refreshAll}><span className="material-symbols-outlined">refresh</span></button>
                </div>
            </div>

            <div className="menu-road-information">
                <input placeholder="From..." id="road-from" type="text" onChange={this.inputFrom} value={this.state.from}/>
                <input placeholder="To..." id="road-to" type="text" onChange={this.inputTo} value={this.state.to}/>
                <div className="controls">
                    <label htmlFor="controlPoints">Control Points: {controlPoints}<input type="range" min="3" max="20" name="controlPoints" id="controlPoints" value={this.state.controlPoints} onChange={this.controlPointsChanger}/></label>
                    <label htmlFor="weatherOnRoute">Weather on route<input type="checkbox" id="weatherOnRoute" checked={options.isTemperatureOnMap} onChange={this.toggleTemperatureOnMap}/></label>
                    <label htmlFor="alternativeRoutes">Alternative routes<input type="checkbox" id="alternativeRoutes" checked={options.isAlternativeRoutesOnMap} onChange={this.toggleAlternativeRoutesOnMap}/></label>
                    <label>Type Route
                        <select className="typeRoute" name="typeRoute" defaultValue="Fastest" onChange={this.setRouteType}>
                            <option value="fastest">Fastest</option>
                            <option value="shortest">Shortest</option>
                            <option value="eco">Eco</option>
                            <option value="thrilling">Thrilling</option>
                        </select>
                    </label>
                </div>
                
                <button onClick={this.checkRoute}>Check Weather Along The Road</button>
            </div>

            <div className="automap">
                <AutoMap allRoutes={allRoutes} locations={allLocations} options={options}/>
            </div>

            <div className="weather-along-the-road">
                <div className="along-the-road-graphic">
                    <ul>
                        { weatherOnRoute.map((place, index) => {
                            if(index === 0) return (<li key={`along-item${index}`}><span className="material-symbols-outlined">location_on</span></li>)
                            if(index === weatherOnRoute.length-1) return (<li key={`along-item${index}`}><span className="material-symbols-outlined">pin_drop</span></li>)
                            return (<li key={`along-item${index}`}><span className="material-symbols-outlined">airline_stops</span></li>)
                        })}
                    </ul>
                </div>
                <ul>
                    {weatherOnRoute.map((place, index) => {
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

        </div> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(AlongTheRoad);
export default Container;