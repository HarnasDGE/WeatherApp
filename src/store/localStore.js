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
        console.log(`weatherState`);
        console.log( JSON.parse(serializedState).weatherState);
        return { weatherState: JSON.parse(serializedState).weatherState};
    } catch(e) {
      console.error(e);
      return [];
    }
};
