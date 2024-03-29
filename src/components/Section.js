import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import MainInfo from './MainInfo';
import Forecast from './Forecast';
import SixteenDay from './SixteenDay';
import Maps from './Maps';
import AlongTheRoad from './AlongTheRoad';

class Section extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const sectionName = this.props.actualContent;
        switch(sectionName) {
            case "Main Info":
                return (<MainInfo/>);
           /* case "Forecast":
                return (<Forecast/>);*/
            case "Maps":
                return (<Maps/>);
            case "Along The Road":
                return (<AlongTheRoad/>)
            default:
                return (<MainInfo/>);
        }
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Section);
export default Container;