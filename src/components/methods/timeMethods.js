export const convertUnixTimeToReadable = (time, timezoneOffsetInSeconds) => {
    const date = new Date((time + timezoneOffsetInSeconds) * 1000);
  
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes}`;
  }

  export const roundUpToFifteenMinutes = (time) => {
    // Konwersja stringa czasu na obiekt Date
    const date = new Date(time);

    // Pobranie minut i obliczenie, do którego kwadransa zaokrąglić
    let minutes = date.getMinutes();
    let roundedMinutes = Math.round(minutes / 15) * 15;

    // Jeśli zaokrąglone minuty wynoszą 60, zwiększ godzinę i ustaw minuty na 0
    if (roundedMinutes === 60) {
        date.setHours(date.getHours() + 1);
        roundedMinutes = 0;
    }

    // Ustawienie zaokrąglonych minut (i zerowania sekund oraz milisekund dla uproszczenia)
    date.setMinutes(roundedMinutes, 0, 0);

    // Formatowanie daty z powrotem do stringa i zwrócenie
    return date.toISOString().substring(0, 16);
}

export const calculateTimeAtRoute = (secondFromStart) => {
  const today = new Date();
  let millisecondsToAdd = secondFromStart * 1000; 
  let newTime = new Date(today.getTime() + millisecondsToAdd);
  return newTime.toTimeString().slice(0, 5);
}

export const getNameDayFromData = (data) => {
  const newDate = new Date(data);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[newDate.getDay()];

}