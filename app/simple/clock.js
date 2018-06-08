/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from "clock";
import { preferences } from "user-settings";

import { days, months, monthsShort } from "./locales/en.js";
import * as util from "./utils";

let dateFormat, clockCallback;

export function initialize(granularity, dateFormatString, callback) {
  dateFormat = dateFormatString;
  clock.granularity = granularity;
  clockCallback = callback;
  clock.addEventListener("tick", tickHandler);
}

function tickHandler(evt) {
  let today = evt.date;
  let dayName = days[today.getDay()];
  let monthNameShort = monthsShort[today.getMonth()];
  let dayNumber = today.getDate();

  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
    dayNumber = util.zeroPad(dayNumber);
  }
  let mins = util.zeroPad(today.getMinutes());

  let timeString = `${hours}:${mins}`;
  let dateString = today;

  dateString = `${dayName} ${dayNumber} ${monthNameShort}`;
  
  clockCallback({time: timeString, date: dateString});
}
