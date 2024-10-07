/* eslint-disable no-prototype-builtins */
import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { TravelWarning } from "../models/travel-warning";
import { ColorLevel } from "../constants"; // ColorLevel을 직접 가져옴



const GlobeComponent = () => {
  const globeRef = useRef<GlobeMethods>();
  const [countriesData, setCountriesData] = useState(null);
  const [alertData, setAlertData] = useState<TravelWarning | null>(null);

  // 경고 정보를 가져오는 함수
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

  // 국가 데이터를 가져오는 함수
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
      console.log("Applying colors to the globe");
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
            return ColorLevel[alarmLevel] || ColorLevel[0]; 
          }
          return ColorLevel[0]; // 기본 값
        }}
      />
    </div>
  );
};

export default GlobeComponent;
