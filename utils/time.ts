const addZero = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

export const timeFormat = (sec: number) => {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec - hours * 3600) / 60);
  const seconds = Math.round((sec - hours * 3600 - minutes * 60) * 100) / 100;

  return `${hours > 0 ? hours + " hodin " : ""}${
    minutes > 0 ? minutes + " minut " : ""
  }${seconds > 0 ? seconds + " sekund" : ""}`;
};

export const timeDigital = (sec: number) => {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec - hours * 3600) / 60);
  const seconds = Math.round((sec - hours * 3600 - minutes * 60) * 100) / 100;

  return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
};
