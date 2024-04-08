import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getIconLink } from '../methods/iconsMethods';
import '../../styles/automap.css';
import {connect} from 'react-redux';
import { PaintRoad } from './PaintRoad';
import { WeatherMarkers } from './WeatherMarkers';
import { mapDispatchToProps, mapStateToProps } from '../../containers/containerWeather';

class AutoMap extends React.Component {
  constructor(props) {
    super(props);

  }

  changeMainRoute = (index) => {
    this.props.changeMainRoute(index);
  }

  render() {
    const {allRoutes, locations, options} = this.props;

    return (
      <MapContainer center={[50.0619474, 19.9368564]} zoom={4} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
          <PaintRoad allRoutes={allRoutes} changeMainRoute={this.changeMainRoute} options={options}/>
          <WeatherMarkers locationsInfo={locations} options={options}/>
      </MapContainer>
    );
  }
  
};

const Container = connect(mapStateToProps, mapDispatchToProps)(AutoMap);

export default Container;
