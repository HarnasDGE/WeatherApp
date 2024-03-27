import { SHOW_NOTIFICATION } from "../constans/constans";

export const showNotification = (message, type) => ({
    type: SHOW_NOTIFICATION,
    popup: {
      message: message,
      type: type
    }
  })