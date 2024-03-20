import React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import MainInfo from './MainInfo';

class Section extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MainInfo />
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Section);
export default Container;