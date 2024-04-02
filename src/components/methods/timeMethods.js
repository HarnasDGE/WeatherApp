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

export const timeFromSecond = (seconds) => {
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * secondsPerMinute;
  const secondsPerDay = 24 * secondsPerHour;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay; // Uproszczenie, przyjmujemy 30 dni na miesiąc
  const secondsPerYear = 365 * secondsPerDay; // Uproszczenie, bez przestępnych

  let remainingSeconds = seconds;

  const years = Math.floor(remainingSeconds / secondsPerYear);
  remainingSeconds -= years * secondsPerYear;

  const months = Math.floor(remainingSeconds / secondsPerMonth);
  remainingSeconds -= months * secondsPerMonth;

  const weeks = Math.floor(remainingSeconds / secondsPerWeek);
  remainingSeconds -= weeks * secondsPerWeek;

  const days = Math.floor(remainingSeconds / secondsPerDay);
  remainingSeconds -= days * secondsPerDay;

  const hours = Math.floor(remainingSeconds / secondsPerHour);
  remainingSeconds -= hours * secondsPerHour;

  const minutes = Math.floor(remainingSeconds / secondsPerMinute);
  remainingSeconds -= minutes * secondsPerMinute;

  const result = [];
  if (years > 0) result.push(`${years} year(s)`);
  if (months > 0) result.push(`${months} month(s)`);
  if (weeks > 0) result.push(`${weeks} week(s)`);
  if (days > 0) result.push(`${days} day(s)`);
  if (hours > 0) result.push(`${hours} hour(s)`);
  if (minutes > 0) result.push(`${minutes} minute(s)`);
  if (remainingSeconds > 0) result.push(`${remainingSeconds} second(s)`);

  return result.join(' ');
}
