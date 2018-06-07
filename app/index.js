import document from "document";

import * as simpleActivity from "./simple/activity";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleSettings from "./simple/device-settings";
import * as messaging from "messaging";
import { battery } from "power";
import Weather from '../common/weather/device';

let background = document.getElementById("background");
let dividers = document.getElementsByClassName("divider");
let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");
let txtWeathertemp = document.getElementById("txtWeathertemp");
let txtWeather1 = document.getElementById("txtWeather1");
let txtWeather2 = document.getElementById("txtWeather2");
let txtBattery = document.getElementById("txtBattery");
let txtVersion = document.getElementById("txtVersion");
let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");
let statsCycle = document.getElementById("stats-cycle");
let statsCycleItems = statsCycle.getElementsByClassName("cycle-item");

let weather = new Weather();

let weatherUnits = "C";

const GRANULARITY = "minutes";

weather.setProvider("yahoo"); 
weather.setApiKey("");
weather.setMaximumAge(30 * 60 * 1000); // 30 Minutes
weather.setFeelsLike(false);

weather.onsuccess = (data) => {
  var loc;
  var len
  var temp;
  console.log("Weather is " + JSON.stringify(data));
  if ( weatherUnits === "C") {
    temp = data.temperatureC + "°";    
  } else {
    temp = data.temperatureF + "°";
  }
  txtWeathertemp.text = temp;
  txtWeather1.text = data.location.substring(0,21);
  txtWeather2.text = data.description.substring(0,21);
}

weather.onerror = (error) => {
  console.log("Weather error " + error);
  txtWeather1.text = error.substring(0,24).toUpperCase();
  txtWeather2.text = error.substring(25,24).toUpperCase();
}

messaging.peerSocket.onopen = () => {
  console.log("App Socket Open, Weather Fetch");
  weather.fetch();
};

messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

/* --------- CLOCK ---------- */
function clockCallback(data) {
  txtTime.text = data.time;
  txtDate.text = data.date;

  txtBattery.text = battery.chargeLevel + "%";
  
  weather.fetch();    
}
simpleClock.initialize(GRANULARITY, "longDate", clockCallback);

/* ------- ACTIVITY --------- */
function activityCallback(data) {
  statsCycleItems.forEach((item, index) => {
    let img = item.firstChild;
    let txt = img.nextSibling;
    txt.text = data[Object.keys(data)[index]].pretty;
    // Reposition the activity icon to the left of the variable length text
    img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 2;
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
  if (data.colorWeather) {
    txtWeathertemp.style.fill = data.colorWeather;
    txtWeather1.style.fill = data.colorWeather;
    txtWeather2.style.fill = data.colorWeather;
  }
  if (data.colorBattery) {
    txtBattery.style.fill = data.colorBattery;    
    txtVersion.style.fill = data.colorBattery;
  }
  if (data.toggleFahrenheit === true) {
    weatherUnits = "F";
  } else {
    weatherUnits = "C";
  }
  weather.fetch();
}
simpleSettings.initialize(settingsCallback);
