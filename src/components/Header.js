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

    changeContent = (e) => {
        const value = e.target.getAttribute('data-value');
        this.props.changeContent(value);
    }

    render() {
        return (
        <header>
            <div id="main-header-line">
                <div id="logo-app">
                    <img src={logo} alt="Logo"/>
                    <div className="pageTitle">Weather App</div>
                </div>
                <div id="search-container">
                    <input type="text" id="search-input" onChange={this.placeOnChange} value={this.state.place}></input>
                    <button id="search-submit"onClick={this.getDataFromPlace}><span className="material-symbols-outlined">search</span></button>
                </div>
            </div>
            <div id="second-header-line">
                <ul className="header-menu" onClick={this.changeContent}>
                    <li data-value="Main Info">Main</li>
                    <li data-value="4-day Forecast">4-day</li>
                    <li data-value="16-day Forecast">16-day</li>
                    <li data-value="Maps">Maps</li>
                </ul>
            </div>
        </header> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Header);
export default Container;