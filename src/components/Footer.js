import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import logo from '../images/logoweather.png';
import { USED_API } from "../constans/constans";


class Footer extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <footer>
                <div className="footer-column">
                    <img src={logo} alt="Logo App"/>
                    <div className="pageTitle gradient-text">Weather App</div>
                </div>
                <div className="footer-column">
                    <ul>
                        <li key="api-list-title">USED API</li>
                        {USED_API.map((api, index) => (<li key={`api-list-${index}`}><a href={api.url}><span className="api-list-title">{api.name}</span> <span className="api-list-desc">{api.desc}</span></a></li>))}
                    </ul>
                </div>
                <div className="footer-column">
                    <ul>
                        <li>Services</li>
                        <li data-value="Main Info">Main</li>
                        <li data-value="Maps">Maps</li>
                        <li data-value="Along The Road">Along The Road</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <ul>
                        <li>Thanks to</li>
                        <li> Me {`<3`}</li>
                        <li>My Girlfriend</li>
                        <li>Api Creators</li>
                    </ul>
                </div>
            </footer>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Footer);
export default Container;