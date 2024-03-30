import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import logo from '../images/logoweather.png';
import { POPUP_ALERT, POPUP_CONFIRM, POPUP_ERROR, POPUP_INFO } from "../constans/constans";

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
           this.getDataFromPlace();
        } 
    }

    placeOnChange = (e) => {
        this.setState({
            place: e.target.value,
        });
    }

    getDataFromPlace = () => {
        if(this.state.place) {
            this.props.fetchPlaceInformation(this.state.place);
        } else {
            this.props.showNotification(`Input is empty, please enter a value!`, POPUP_ALERT);
        }
    }

    changeContent = (e) => {
        const value = e.target.getAttribute('data-value');
        this.props.changeContent(value);
    }

    showMenu = () => {
        console.log(`this.props.data`);
        console.table(this.props.data);
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
                    <input type="text" id="search-input" onChange={this.placeOnChange} value={this.state.place} placeholder="Enter place..."></input>
                    <button className="buttons-menu" id="search-submit"onClick={this.getDataFromPlace}><span className="material-symbols-outlined">search</span></button>
                    <button className="buttons-menu" id="main-menu" onClick={this.showMenu}><span className="material-symbols-outlined">menu</span></button>
                </div>
            </div>
            <div id="second-header-line">
                <ul className="header-menu" onClick={this.changeContent}>
                    <li data-value="Main Info">Main</li>
                    <li data-value="Forecast">Forecast</li>
                    <li data-value="Maps">Maps</li>
                    <li data-value="Along The Road">Along The Road</li>
                </ul>
            </div>
        </header> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Header);
export default Container;