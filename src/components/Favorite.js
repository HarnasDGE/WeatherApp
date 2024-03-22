import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";

class Favorite extends React.Component {
    render() {
        // Zabezpieczenie przed undefined przy użyciu wartości domyślnej (pustej tablicy)
        const favoritePlaces = this.props.favoritePlaces || [];

        return (
            <div id="favorites">
                <div className="controls-bar">Favorite Places</div>
                <div className="listOfPlaces">
                <ul>
                    {favoritePlaces.map((place, index) => (
                    <li key={`favPlace${index}`} className="favorite-place" onClick={() => this.props.fetchPlaceInformation(place.name)}>
                        <div className="main-info-favorites">
                            {/* Zabezpieczenie przed undefined przy próbie dostępu do place.weather[0] i place.main */}
                            <img className="favourite-image" src={`https://openweathermap.org/img/wn/${place.weather?.[0]?.icon}@2x.png`} alt="Weather icon"/>
                            <div className="info">
                                <h2 className="favourite-place-name">{place.name}</h2>
                                <div className="second-info">
                                    {/* Zabezpieczenie przed undefined przy próbie dostępu do place.main.temp */}
                                    <p className="favourite-temperature">{Math.floor(place.main?.temp - 273.15)} °C</p>
                                    <p className="favourite-condition-text">{place.weather?.[0]?.main}</p>
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
