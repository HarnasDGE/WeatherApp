import React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../containers/containerWeather';
import Header from './Header';
import Section from './Section';
import Sidebar from './Sidebar'
import { loadFromLocalStorage } from '../store/localStore';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: null
        }
    }

    importAll = (r) => {
        let images = {};
        r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
        return images
    }
    
    componentDidMount() {
        const images = this.importAll(require.context('../images/timeOfDay', false, /\.(png|jpe?g|svg)$/));
        this.setState({ images });
        
        const favoritePlace = this.props.favoritePlaces && this.props.favoritePlaces.length > 0 ? this.props.favoritePlaces[0] : null;
        if(favoritePlace) {
            this.props.fetchDataSuccess(favoritePlace)
        }
    }

    render() {
        if (!this.state.images) {
            return <div>Loading...</div>;
        }
        const images = this.state.images;
        const urlImageOfPlace = this.props.imageLink;
        // <div id="main-container" style={{background: `url(${images[this.props.timeOfDay + '.png']}) no-repeat left top fixed `}}>

        return(    
            <div id="main-container" style={{background: `url(${urlImageOfPlace}) no-repeat left top fixed `}}>
                <Header />
                <Section />
                <Sidebar />
            </div>
        )
    }
}
const Container = connect(mapStateToProps, mapDispatchToProps)(App);
export default Container;