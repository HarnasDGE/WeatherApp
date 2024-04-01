export const saveToLocalStorage = (state) => {

    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('weather', serializedState);
    } catch(e) {
      console.error(e);
    }
};

export const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('weather');
        if (serializedState === null) return [];
        return { weatherState: JSON.parse(serializedState).weatherState};
    } catch(e) {
      console.error(e);
      return [];
    }
};
