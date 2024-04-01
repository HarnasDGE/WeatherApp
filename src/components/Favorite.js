import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import { getIconLink } from "./methods/iconsMethods";

class Favorite extends React.Component {
    render() {
        const favoritePlaces = this.props.favoritePlaces || [];
        if(favoritePlaces.length < 1) return (
            <div id="favorites">
                <div className="controls-bar">Favorite Places</div>
                <div className="listOfPlaces"></div>
                <span>Press {`<3`} to add place to favorites!</span>
            </div>
        )
        return (
            <div id="favorites">
                <div className="controls-bar">Favorite Places</div>
                <div className="listOfPlaces">
                    <ul>
                        {favoritePlaces.map((place, index) => (
                        <li key={`favPlace${index}`} className="favorite-place" onClick={() => this.props.fetchPlaceInformation(place.main.name)}>
                            <div className="main-info-favorites">
                                <img className="favourite-image" src={getIconLink(place.daily.weatherCode[0], true)} alt="Weather icon"/>
                                <div className="info">
                                    <h2 className="favourite-place-name">{place.main.name}</h2>
                                    <div className="second-info">
                                        <p className="favourite-temperature">{Math.round(place.daily.temperatureMax[0] * 10) /10} °C</p>
                                    </div>
                                </div>
                            </div>
                            <div className="favorite-controls">
                                <button className="control" onClick={() => this.props.removeFavoritePlace(index)}><span className="material-symbols-outlined">delete</span></button> 
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Favorite);
export default Container;
