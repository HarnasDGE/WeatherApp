import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import { getIconLink } from "./methods/iconsMethods";

class FavoriteRoutes extends React.Component {
    render() {
        const {favoriteRoutes, route} = this.props;
        console.log(`[FavoriteRoutes LOG] route: `, route);
        console.log(`[FavoriteRoutes LOG] favoriteRoutes: `, favoriteRoutes);
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
                       {favoriteRoutes.map((route, index) => (<li key={`route${index}`}>
                        {route.coords.from.name} - {route.coords.to.name}
                       </li>))}
                    </ul>
                </div>
            </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(FavoriteRoutes);
export default Container;
