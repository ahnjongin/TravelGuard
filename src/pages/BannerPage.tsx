import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { TravelWarning } from "../models/travel-warning";
import { ColorLevel } from "../constants";
import { FeatureCollection } from "geojson";

const GlobeComponent = () => {
  const globeRef = useRef<GlobeMethods | null>(null);
  const [countriesData, setCountriesData] = useState<FeatureCollection | null>(
    null,
  );
  const [alertData, setAlertData] = useState<TravelWarning | null>(null);

  useEffect(() => {
    const fetchTravelWarnings = async () => {
      try {
        const response = await fetch(
          "http://apis.data.go.kr/1262000/TravelAlarmService0404/getTravelAlarm0404List?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru%2FMMElU5kcRGbWollJUWM9OUQPTRydfCh1%2Fy0k2K9eTJMXjHQafwH5HHS0h%2FKA%3D%3D&page=1&numOfRows=203&perPage=203&returnType=JSON",
        );

        const data = await response.json();
        console.log("Fetched Alert Data:", data);

        const travelWarnings = data?.response?.body?.items?.item;

        if (Array.isArray(travelWarnings)) {
          console.log("Final Travel Warnings:", travelWarnings);
          setAlertData(travelWarnings as TravelWarning[]);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching travel warnings:", error);
        setAlertData(null);
      }
    };

    const fetchCountriesData = async () => {
      try {
        const response = await fetch("/countries.geojson");
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        setCountriesData(data as FeatureCollection);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        setCountriesData(null);
      }
    };

    fetchCountriesData();
    fetchTravelWarnings();
  }, []);

  useEffect(() => {
    if (globeRef.current && alertData && countriesData) {
      console.log("Applying colors to the globe");
    }
  }, [alertData, countriesData]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Globe
        /* ref={globeRef} */
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#211e1e"
        polygonsData={countriesData?.features}
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonLabel={({
          properties,
        }: {
          properties?: { ADMIN: string; ISO_A2: string; POP_EST: number };
        }) => {
          if (!properties) return "";

          const alarmLevel =
            alertData?.find(
              (warning) => warning.country_iso_alp2 === properties.ISO_A2,
            )?.alarm_lvl ?? 0;

          return `
            <b>${properties.ADMIN} (${properties.ISO_A2})</b> <br />
            Population: <i>${Math.round(properties.POP_EST / 1e4) / 1e2}M</i> <br />
            alarmLevel: <i>${alarmLevel}</i>
          `;
        }}
        polygonCapColor={(d: { properties?: { ISO_A2?: string } }) => {
          if (!d.properties || !d.properties.ISO_A2) return ColorLevel[0];

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
