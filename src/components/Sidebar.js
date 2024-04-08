import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import FavoritePlaces from './FavoritePlaces';
import FavoriteRoutes from './FavoriteRoutes';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div id="sidebar">
                <FavoritePlaces/>
                <FavoriteRoutes/>
             </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
export default Container;