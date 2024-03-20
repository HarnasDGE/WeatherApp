import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import logo from '../images/logoweather.png';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            place: ''
        }
    }

    componentDidMount() {
        document.addEventListener("keypress", this.keyPressEnter);
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this.keyPressEnter);

    }

    keyPressEnter = (e) => {
        if (e.key === "Enter") {
            this.props.fetchPlaceInformation(this.state.place);
        } 
    }

    placeOnChange = (e) => {
        this.setState({
            place: e.target.value,
        });
    }

    getDataFromPlace = () => {
        this.props.fetchPlaceInformation(this.state.place);
    }

    render() {
        return (
        <header>
            <div id="logo-app">
                <img src={logo} alt="Logo"/>
                <div className="pageTitle">Weather App</div>
            </div>
            <div id="search-container">
                <input type="text" id="search-input" onChange={this.placeOnChange} value={this.state.place}></input>
                <button id="search-submit"onClick={this.getDataFromPlace}><span className="material-symbols-outlined">search</span></button>
            </div>
        </header> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Header);
export default Container;