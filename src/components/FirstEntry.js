import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";


class FirstEntry extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
        <div id="content" className="hello-form">
            <h2 className="gradient-text">Hello in Weather App.</h2>
            <p>Search for weather information from anywhere in the world! Also use the weather information search function for travelers</p>
            <input type="text" className="search-input"/>
            <button >Search</button>
        </div> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(FirstEntry);
export default Container;