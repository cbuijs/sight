import * as messaging from "messaging";
import { settingsStorage } from "settings";

export function initialize() {
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
}

function sendValue(key, val) {
  if (val) {
    let checkval = JSON.stringify(val).indexOf("values");
    if (checkval > -1) {
      val = JSON.parse(val).values[0].value;
    } else {
      val = JSON.parse(val);
    }
    sendSettingData({
      key: key,
      value: val
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}
