const colorSet = [
  {color: "black"},
  {color: "darkslategrey"},
  {color: "dimgrey"},
  {color: "grey"},
  {color: "lightgrey"},
  {color: "beige"},
  {color: "white"},
  {color: "maroon"},
  {color: "saddlebrown"},
  {color: "darkgoldenrod"},
  {color: "goldenrod"},
  {color: "rosybrown"},
  {color: "wheat"},
  {color: "navy"},
  {color: "blue"},
  {color: "dodgerblue"},
  {color: "deepskyblue"},
  {color: "aquamarine"},
  {color: "cyan"},
  {color: "olive"},
  {color: "darkgreen"},
  {color: "green"},
  {color: "springgreen"},
  {color: "limegreen"},
  {color: "palegreen"},
  {color: "lime"},
  {color: "greenyellow"},
  {color: "darkslateblue"},
  {color: "slateblue"},
  {color: "purple"},
  {color: "fuchsia"},
  {color: "purple"},
  {color: "plum"},
  {color: "orchid"},
  {color: "lavender"},
  {color: "darkkhaki"},
  {color: "khaki"},
  {color: "lemonchiffon"},
  {color: "yellow"},
  {color: "gold"},
  {color: "orangered"},
  {color: "orange"},
  {color: "coral"},
  {color: "lightpink"},
  {color: "palevioletred"},
  {color: "deeppink"},
  {color: "darkred"},
  {color: "crimson"},
  {color: "red"}       
];

const toggles = [
  ['Fahrenheit', 'toggleFahrenheit']
];

const options = [
  ['Custom Background Color', 'colorBackground'],
  ['Custom Dividers Color', 'colorDividers'],
  ['Custom Time Color', 'colorTime'],
  ['Custom Date Color', 'colorDate'],
  ['Custom Activity Color', 'colorActivity'],
  ['Custom HRM Text Color', 'colorHRM'],
  ['Custom HRM Heart Color', 'colorImgHRM'],
  ['Custom Weather Info Color', 'colorWeather'],
  ['Custom Weather Temperature Color', 'colorWeathertemp'],
  ['Custom Status-Line Color', 'colorBattery']
];


function mySettings(props) {
  return (
    <Page>
      {toggles.map(([label, settingsKey]) =>       
        <Toggle
          label={label}
          settingsKey={settingsKey}
        />
      )}
      <Select
        label="Color Theme"
        settingsKey="colorTheme"
        options={[
          {name:"Default", value:"default"},
          {name:"Night Vision", value:"night"},
          {name:"Rhodopsin", value:"red"},
          {name:"Custom (see below)", value:"custom"}
        ]}
      />
      {options.map(([title, settingsKey]) =>
        <Section title={title}>
          <ColorSelect
            settingsKey={settingsKey}
            colors={colorSet}
          />
        </Section>
      )}
    </Page>
  );
}

registerSettingsPage(mySettings);
