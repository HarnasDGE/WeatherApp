import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { POPUP_ALERT, POPUP_CONFIRM, POPUP_ERROR, POPUP_INFO } from '../constans/constans';
import '../styles/app.css';
import { showNotification } from '../actions/notificationActions';


class Notification extends React.Component {
    componentDidUpdate() {
            this.showNotification();
    }

    showNotification() {
        const popupDisplay = document.getElementById('popup-display');
        if (popupDisplay) {
            popupDisplay.style.display = 'flex';
            setTimeout(() => {
                popupDisplay.style.display = 'none';
            }, 1000);
        }
    }

    render() {
        const { message, type } = this.props.popup;
        let iconType = "";

        switch(type) {
            case POPUP_CONFIRM: 
                iconType = "check_circle";
                break;
            case POPUP_ALERT: 
                iconType = "warning";
                break;
            case POPUP_ERROR: 
                iconType = "error";
                break;
            case POPUP_INFO: 
                iconType = "info";
                break;
            default:
                iconType = "";
        }

        return (
            <div id="popup-display" style={{ display: 'none' }}>
                <span className={`popup-display-icon material-symbols-outlined ${iconType}-popup`}>{iconType}</span>
                <span className="popup-display-text">{message}</span>
            </div>
        );
    }
}

Notification.propTypes = {
    popup: PropTypes.shape({
        message: PropTypes.string,
        type: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({
    popup: state.notificationState.popup // Dostosuj do struktury twojego stanu Redux
});

const mapDispatchToProps = (dispatch) => {
    return {
        showNotification: (message, type) => dispatch(showNotification(message, type)),
      }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
