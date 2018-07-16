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
let txtInfo = document.getElementById("txtInfo");
let txtVersion = document.getElementById("txtVersion");
let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");
let statsCycle = document.getElementById("stats-cycle");
let statsCycleItems = statsCycle.getElementsByClassName("cycle-item");

let weather = new Weather();

let weatherUnits = "C";
let weatherFetch = 30; // Pull every thirty-minutes
let weatherTimeleft = 0;

let currentTheme = "default";
let customTheme;

const GRANULARITY = "minutes";

weather.setProvider("yahoo"); 
weather.setApiKey("");
weather.setMaximumAge(weatherFetch * 60 * 1000); // 30 Minutes
weather.setFeelsLike(false);

weather.onsuccess = (data) => {
  var temp;
  console.log("Weather is " + JSON.stringify(data));
  if ( weatherUnits === "C") {
    temp = data.temperatureC;    
  } else {
    temp = data.temperatureF;
  }
  txtWeathertemp.text = Math.round(temp) + "°";
  txtWeather1.text = data.location; //.substring(0,30);
  let time = Date().replace(/\s+/," ").split(" ")[4].split(":");
  let displaytime = time[0] + ":" + time[1];
  let desc = data.description;
  txtWeather2.text = displaytime + " " + desc; //.substring(0,);
  if ( txtWeather2.getBBox().x < 93 ) {
    txtWeather2.text = displaytime + " " + desc.replace(/[\sAaEeIiOoUu]/g, ""); //.substring(0,);
  }
}

weather.onerror = (error) => {
  console.log("Weather error " + error);
  txtWeather1.text = error.substring(0,30);
  txtWeather2.text = error.substring(30,30);
}

messaging.peerSocket.onopen = () => {
  console.log("App Socket Open, Weather Fetch");
  getWeather();
};

messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

function getWeather() {
  console.log("Getting The Weather");
  weatherTimeleft = weatherFetch;
  weather.fetch();
}

/* --------- CLOCK ---------- */
function clockCallback(data) {
  console.log("Updating Time/Date " + data.time + " " + data.date);
  txtTime.text = data.time;
  txtDate.text = data.date;

  txtBattery.text = battery.chargeLevel + "%";
  console.log("Battery Chargelevel: " + battery.chargeLevel + "%");
  if (battery.chargelevel < 15) {
    txtBattery.style.fill = "red";
  } else {
    if (battery.chargelevel < 40) {
      txtBattery.style.fill = "orange"; 
    } else {
      txtBattery.style.fill = "lime";
    }
  }
  weatherTimeleft--;
  if (weatherTimeleft < 1) {
    console.log("Fetching Weather Interval");
    getWeather();
  }
  console.log("Weather Time Left: " + weatherTimeleft + " minutes");  
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
  
  //console.log("New settings: " + JSON.stringify(data));
  
  if (data.colorTheme !== currentTheme) {
    console.log("Color Theme set from " + currentTheme + " to " + data.colorTheme);

    currentTheme = data.colorTheme;
    
    switch (data.colorTheme) {
      case "night":
        background.style.fill = "black";
        data.colorBackground = "black";
        dividers.forEach(item => {
          item.style.fill = "darkgreen";
          data.colorDividers = "darkgreen";
        });
        txtTime.style.fill = "lime";
        data.colorTime = "lime";
        txtDate.style.fill = "lime";
        data.colorDate = "lime";
        statsCycleItems.forEach((item, index) => {
          let img = item.firstChild;
          let txt = img.nextSibling;
          img.style.fill = "lime";
          data.colorActivity = "lime";
          txt.style.fill = "lime";
          data.colorActivity = "lime";
        });
        txtHRM.style.fill = "lime";
        data.colorHRM = "lime";
        imgHRM.style.fill = "lime";
        data.colorImgHRM = "lime"
        txtWeathertemp.style.fill = "lime";
        data.colorWeathertemp = "lime";
        txtWeather1.style.fill = "lime";
        data.colorWeather = "lime";
        txtWeather2.style.fill = "lime";
        txtBattery.style.fill = "darkgreen";
        data.colorBattery = "darkgreen";    
        txtVersion.style.fill = "darkgreen";
        data.colorBattery = "darkgreen";
        break;
      case "red":
        background.style.fill = "black";
        data.colorBackground = "black";
        dividers.forEach(item => {
          item.style.fill = "darkred";
          data.colorDividers = "darkred";
        });
        txtTime.style.fill = "red";
        data.colorTime = "red";
        txtDate.style.fill = "red";
        data.colorDate = "red";
        statsCycleItems.forEach((item, index) => {
          let img = item.firstChild;
          let txt = img.nextSibling;
          img.style.fill = "red";
          data.colorActivity = "red";
          txt.style.fill = "red";
          data.colorActivity = "red";
        });
        txtHRM.style.fill = "red";
        data.colorHRM = "red";
        imgHRM.style.fill = "red";
        data.colorImgHRM = "red"
        txtWeathertemp.style.fill = "red";
        data.colorWeathertemp = "red";
        txtWeather1.style.fill = "red";
        data.colorWeather = "red";
        txtWeather2.style.fill = "red";
        txtBattery.style.fill = "darkred";
        data.colorBattery = "darkred";    
        txtVersion.style.fill = "darkred";
        data.colorBattery = "darkred";
        break;
      case "custom":
        //restore custom
        console.log("Restoring CUSTOM colors");
        break;
      default:
        background.style.fill = "black";
        data.colorBackground = "black";
        dividers.forEach(item => {
          item.style.fill = "dimgrey";
          data.colorDividers = "dimgrey";
        });
        txtTime.style.fill = "red";
        data.colorTime = "red";
        txtDate.style.fill = "white";
        data.colorDate = "white";
        statsCycleItems.forEach((item, index) => {
          let img = item.firstChild;
          let txt = img.nextSibling;
          img.style.fill = "white";
          data.colorActivity = "white";
          txt.style.fill = "white";
          data.colorActivity = "white";
        });
        txtHRM.style.fill = "white";
        data.colorHRM = "white";
        imgHRM.style.fill = "red";
        data.colorImgHRM = "red"
        txtWeathertemp.style.fill = "yellow";
        data.colorWeathertemp = "yellow";
        txtWeather1.style.fill = "white";
        data.colorWeather = "white";
        txtWeather2.style.fill = "white";
        txtBattery.style.fill = "dimgrey";
        data.colorBattery = "dimgrey";    
        txtVersion.style.fill = "dimgrey";
        data.colorBattery = "dimgrey";
        break;
    }
  }
  
  if (data.updateInterval !== weatherFetch) {
    console.log("Weather Interval set to " + data.updateInterval + " minutes");
    getWeather();
    weatherFetch = data.updateInterval;
  }
  
  if (data.colorTheme === "custom") {
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
    
    if (data.colorWeathertemp) {
      txtWeathertemp.style.fill = data.colorWeathertemp;
    }
  
    if (data.colorWeather) {
      txtWeather1.style.fill = data.colorWeather;
      txtWeather2.style.fill = data.colorWeather;
    }
  
    if (data.colorBattery) {
      txtBattery.style.fill = data.colorBattery;   
      txtInfo.style.fill = data.colorBattery;
      txtVersion.style.fill = data.colorBattery;
    }
  }
  
  let oldweatherUnits = weatherUnits;
  if (data.toggleFahrenheit === true) {
    weatherUnits = "F";
  } else {
    weatherUnits = "C";
  }
  if (weatherUnits !== oldweatherUnits) {
    getWeather();
  }
}
simpleSettings.initialize(settingsCallback);
