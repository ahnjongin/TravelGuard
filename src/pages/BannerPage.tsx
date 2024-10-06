/* eslint-disable no-prototype-builtins */
import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { TravelWarning } from "../models/travel-warning";
import { ColorLevel } from "../constants";

const ColorLevelMap = {
  0: `${ColorLevel[0]}`,
  1: `${ColorLevel[1]}`,
  2: `${ColorLevel[2]}`,
  3: `${ColorLevel[3]}`,
  4: `${ColorLevel[4]}`,
};

const mapAlarmLevelToColor = (alarmLevel: keyof typeof ColorLevel) => {
  return ColorLevelMap[alarmLevel];
};

const GlobeComponent = () => {
  const globeRef = useRef<GlobeMethods>();
  const [countriesData, setCountriesData] = useState(null);
  const [alertData, setAlertData] = useState<TravelWarning | null>(null);

  const fetchTravelWarnings = async () => {
    try {
      const response = await fetch(
        "http://apis.data.go.kr/1262000/TravelAlarmService0404/getTravelAlarm0404List?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru/MMElU5kcRGbWollJUWM9OUQPTRydfCh1/y0k2K9eTJMXjHQafwH5HHS0h/KA==&returnType=JSON&numOfRows=203",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { data: TravelWarning };
      console.log("Fetched Alert Data:", data);

      if (data.data) {
        return data.data;
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching travel warnings:", error);
      return [];
    }
  };

  const fetchCountriesData = async () => {
    try {
      const data = await fetch("/countries.geojson", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data.json();
    } catch (error) {
      console.error("Error fetching GeoJSON:", error);
    }
  };

  useEffect(() => {
    fetchCountriesData().then(setCountriesData);
    fetchTravelWarnings().then(setAlertData);
  }, []);

  useEffect(() => {
    if (
      globeRef.current != null &&
      alertData != null &&
      countriesData != null
    ) {
      //   globeRef.current.controls().autoRotate = true;
      //   globeRef.current.controls().autoRotateSpeed = 0.3;

      //   globeRef.current.pointOfView({ altitude: 4 }, 5000);
      console.log("Applying colors to the globe");
      // setCountryColors(globeRef.current, alertData);
    }
  }, [alertData, countriesData]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#211e1e"
        polygonsData={countriesData?.features}
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonLabel={({ properties: d }) => {
          const alarmLevel = alertData?.find(
            (warning) => warning.country_iso_alp2 === d.ISO_A2,
          )?.alarm_lvl;

          return `
        <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i> <br />
        alarmLevel: <i>${alarmLevel ?? 0}</i>
      `;
        }}
        polygonCapColor={(d) => {
          const countryISO_A2 = d.properties.ISO_A2;
          const countryWarning = alertData?.find(
            (warning) => warning.country_iso_alp2 === countryISO_A2,
          );
          if (countryWarning) {
            const alarmLevel = countryWarning.alarm_lvl;
            return mapAlarmLevelToColor(alarmLevel);
          }
          return ColorLevelMap[0]; // Default color for countries with no alert
        }}
        //     polygonLabel={({ properties: d }) => `
        //     <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        //     Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
        //   `}
      />
    </div>
  );
};

export default GlobeComponent;
