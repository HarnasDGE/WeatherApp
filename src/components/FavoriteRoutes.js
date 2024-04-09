import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import { getIconLink } from "./methods/iconsMethods";
import { calculateTimeAtRoute, timeFromSecond } from "./methods/timeMethods";

class FavoriteRoutes extends React.Component {
    render() {
        const {favoriteRoutes, route} = this.props;
        if(favoriteRoutes && favoriteRoutes.length < 1) return (
            <div className="favorites">
                <div className="controls-bar">Favorite Routes</div>
                <div className="listOfPlaces"></div>
                <span>You don't have any routes in favorites!</span>
            </div>
        )
        return (
            <div className="favorites">
                <div className="controls-bar">Favorite Routes</div>
                <div className="listOfPlaces">
                    <ul>
                       {favoriteRoutes.map((route, index) => (
                       <li key={`route${index}`} className="favorite-route">
                        <div className="favRoute-item">
                            <div className="favRoute-icon">
                                <span class="material-symbols-outlined">pin_drop</span>
                            </div>
                            <div className="favRoute-details">
                                <span className="favRoute-name">{route.coords.from.name} - {route.coords.to.name}</span>
                                <span className="favRoute-options">
                                    <span className="favRoute-option-name">KM:</span> <span className="favRoute-option-value">{Math.round(route.route.routes[0].summary.lengthInMeters/1000)}</span>
                                    <span className="favRoute-option-name">TIME:</span> <span className="favRoute-option-value">{timeFromSecond(route.route.routes[0].summary.travelTimeInSeconds)}</span>
                                    <span className="favRoute-option-name">TYPE:</span> <span className="favRoute-option-value">{route.routeType}</span>
                                </span>
                            </div>
                            
                        </div>
                        <div className="favRoute-buttons">
                            <button className="control" onClick={() => this.props.removeFavoriteRoute(index)}><span className="material-symbols-outlined">delete</span></button> 
                        </div>
                       </li>))}
                    </ul>
                </div>
            </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(FavoriteRoutes);
export default Container;
