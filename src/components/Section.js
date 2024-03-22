import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import MainInfo from './MainInfo';
import FourDay from './FourDay';
import SixteenDay from './SixteenDay';
import Maps from './Maps';

class Section extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const sectionName = this.props.actualContent;
        switch(sectionName) {
            case "Main Info":
                return (<MainInfo/>);
            case "4-day Forecast":
                return (<FourDay/>);
            case "16-day Forecast":
                return (<SixteenDay/>);
            case "Maps":
                return (<Maps/>);
            default:
                return (<MainInfo/>);
        }
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Section);
export default Container;