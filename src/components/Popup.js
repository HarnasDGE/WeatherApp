import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import { POPUP_ALERT, POPUP_CONFRIM, POPUP_ERROR, POPUP_INFO } from "../constans/constans";


class PopUp extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const popup = document.getElementById("popup-dispay");
        setTimeout(() => {popup.style.display = "none"}, 700);
    }

    render() {
        const type = this.props.popup.type;
        let styleType = "";
        let iconType = "";
    
        switch(type) {
            case POPUP_ALERT: 
                styleType = "alert-popup"
                iconType = "warning"
            break;
            case POPUP_CONFRIM: 
                styleType = "confirm-popup"
                iconType = "check_circle"
            break;
            case POPUP_ERROR: 
                styleType = "error-popup"
                iconType = "error"
            break;
            case POPUP_INFO: 
                styleType = "info-popup"
                iconType = "info"
            break;
        }
        
        return (
            <div id="popup-display">
                <span class="material-symbols-outlined popup-display-icon ${styleType}" >${iconType}</span>
                <span class='popup-display-text'>${this.props.popup.message}</span>
            </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(PopUp);
export default Container;