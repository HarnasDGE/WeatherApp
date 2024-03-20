import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import Favorite from './Favorite';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div id="sidebar">
                <Favorite/>
             </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
export default Container;