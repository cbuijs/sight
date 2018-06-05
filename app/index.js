import document from "document";

import * as simpleActivity from "./simple/activity";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleSettings from "./simple/device-settings";
import Weather from '../common/weather/device';

let background = document.getElementById("background");
let dividers = document.getElementsByClassName("divider");
let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");
let txtWeather = document.getElementById("txtWeather");
let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");
let statsCycle = document.getElementById("stats-cycle");
let statsCycleItems = statsCycle.getElementsByClassName("cycle-item");

let weather = new Weather();

const GRANULARITY = "minutes";

var WEATHERINTERVAL = 30;
var WEATHERCOUNT = WEATHERINTERVAL;
var WEATHERDATA = null;

weather.setProvider("yahoo"); 
weather.setApiKey("");
weather.setMaximumAge(25 * 60 * 1000); 
weather.setFeelsLike(false);

weather.onsuccess = (data) => {
  console.log("Weather is " + JSON.stringify(data));
  WEATHERDATA = data
  
}

weather.onerror = (error) => {
  console.log("Weather error " + error);
}

weather.fetch();


/* --------- CLOCK ---------- */
function clockCallback(data) {
  txtTime.text = data.time;
  txtDate.text = data.date;
  if (WEATHERCOUNT < 2) {
    WEATHERCOUNT = WEATHERINTERVAL
    weather.fetch();
  } else {
    WEATHERCOUNT = WEATHERCOUNT - 1;
  }
  txtWeather.text = WEATHERDATA.location + " " + WEATHERDATA.temperatureC + "°C";
}
simpleClock.initialize(GRANULARITY, "longDate", clockCallback);

/* ------- ACTIVITY --------- */
function activityCallback(data) {
  statsCycleItems.forEach((item, index) => {
    let img = item.firstChild;
    let txt = img.nextSibling;
    txt.text = data[Object.keys(data)[index]].pretty;
    // Reposition the activity icon to the left of the variable length text
    img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  });
}
simpleActivity.initialize(GRANULARITY, activityCallback);

/* -------- HRM ------------- */
function hrmCallback(data) {
  txtHRM.text = `${data.bpm}`;
  if (data.zone === "out-of-range") {
    imgHRM.href = "images/heart_open.png";
  } else {
    imgHRM.href = "images/heart_solid.png";
  }
  if (data.bpm !== "--") {
    iconHRM.animate("highlight");
  }
}
simpleHRM.initialize(hrmCallback);

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  if (data.colorBackground) {
    background.style.fill = data.colorBackground;
  }
  if (data.colorDividers) {
    dividers.forEach(item => {
      item.style.fill = data.colorDividers;
    });
  }
  if (data.colorTime) {
    txtTime.style.fill = data.colorTime;
  }
  if (data.colorDate) {
    txtDate.style.fill = data.colorDate;
  }
  if (data.colorActivity) {
    statsCycleItems.forEach((item, index) => {
      let img = item.firstChild;
      let txt = img.nextSibling;
      img.style.fill = data.colorActivity;
      txt.style.fill = data.colorActivity;
    });
  }
  if (data.colorHRM) {
    txtHRM.style.fill = data.colorHRM;
  }
  if (data.colorImgHRM) {
    imgHRM.style.fill = data.colorImgHRM;
  }
}
simpleSettings.initialize(settingsCallback);
