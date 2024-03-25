import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import Map from './Map';

class Maps extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            actualMap: "clauds_new",
        }

    }

    changeMap = (e) => {
    const newMap = e.target.getAttribute('data-value');
    this.setState({ actualMap: newMap})
    }

    render() {
        return (
        <div id="content">
            <div className="controls-bar">
                <div className="title-container">
                    {this.props.actualContent} 
                </div>
                <div id="controls-container">
                    <button className="control" id="favoriteBtn" onClick={this.setFavoritePlace}><span className="material-symbols-outlined">favorite</span></button>
                    <button className="control" id="refreshBtn" onClick={this.refreshAll}><span className="material-symbols-outlined">refresh</span></button>
                </div>
            </div>
            <div id="actual-map"><Map layer={this.state.actualMap}/></div>
            <div className="list-maps">
                <ul onClick={this.changeMap}>
                    <li data-value="clouds_new">Clouds Map</li>
                    <li data-value="precipitation_new">Precipitation Map</li>
                    <li data-value="pressure_new">Pressure Map</li>
                    <li data-value="wind_new">Wind Map</li>
                    <li data-value="temp_new">Temp Map</li>
                </ul>
            </div>
        </div> 
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Maps);
export default Container;