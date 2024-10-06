import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../components/common/Input";
import { ColorLevel } from "../constants"; 

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const CountrySearchPage = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlarmLevel, setSelectedAlarmLevel] = useState<number | null>(
    null,
  ); // 선택된 alarm_lvl 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "http://apis.data.go.kr/1262000/TravelAlarmService0404/getTravelAlarm0404List?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru/MMElU5kcRGbWollJUWM9OUQPTRydfCh1/y0k2K9eTJMXjHQafwH5HHS0h/KA==&returnType=JSON&numOfRows=203",
        );
        if (Array.isArray(response.data.data)) {
          setCountries(response.data.data);
        } else {
          console.error("Received data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCountryClick = (countryCode: string) => {
    navigate(`/country/${countryCode}`);
  };

  const handleAlarmLevelChange = (level: number | null) => {
    setSelectedAlarmLevel(level);
  };

  const getColorByAlarmLevel = (alarmLevel: number) => {
    return ColorLevel[alarmLevel] || ColorLevel[0]; // ColorLevel에서 가져옴, 기본은 0단계 색상
  };

  const filteredCountries = Array.isArray(countries)
    ? countries.filter((country: any) => {
        const matchesSearch =
          country.country_nm
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(searchQuery.replace(/\s/g, "").toLowerCase()) ||
          country.country_eng_nm
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(searchQuery.replace(/\s/g, "").toLowerCase());

        const alarmLevel = country.alarm_lvl ?? 0;

        const matchesAlarmLevel =
          selectedAlarmLevel === null || alarmLevel === selectedAlarmLevel;

        return matchesSearch && matchesAlarmLevel;
      })
    : [];

  return (
    <div css={pageWrap}>
      <div css={pageContainer}>
        <h1>국가/지역별 정보</h1>
        <p>국가/지역별 현지 인력 정보 등을 제공합니다.</p>

        <InputField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="국가 명을 입력하세요"
        />

        {/* Alarm level 필터 메뉴 */}
        <div css={menuStyle}>
          <button onClick={() => handleAlarmLevelChange(null)}>전체</button>
          {[1, 2, 3, 4].map((level) => (
            <button key={level} onClick={() => handleAlarmLevelChange(level)}>
              <div
                css={css`
                  width: 20px;
                  height: 20px;
                  background-color: ${ColorLevel[level]};
                  display: inline-block;
                  margin-right: 8px;
                `}
              ></div>
              {level === 1 && "1단계 여행유의"}
              {level === 2 && "2단계 여행자제"}
              {level === 3 && "3단계 출국권고"}
              {level === 4 && "4단계 여행금지"}
            </button>
          ))}
        </div>

        <div css={countryListStyle}>
          {filteredCountries.map((country: any) => (
            <div
              key={country.country_iso_alp2}
              css={countryItemStyle}
              onClick={() => handleCountryClick(country.country_iso_alp2)}
            >
              {/* 알람 레벨에 따른 색상 표시 */}
              <div
                css={css`
                  width: 20px;
                  height: 20px;
                  background-color: ${getColorByAlarmLevel(
                    country.alarm_lvl ?? 0,
                  )};
                  margin-right: 10px;
                  border-radius: 3px;
                `}
              ></div>
              <span>{country.country_nm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountrySearchPage;

const pageWrap = css`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #111;
  height: 100%;
  padding-bottom: 20px;
`;

const pageContainer = css`
  padding: 20px;
  color: white;
  background-color: #111;
  width: 80%;
  max-width: 1200px;
  box-sizing: border-box;

  h1 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
  }
`;

const menuStyle = css`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  button {
    padding: 10px;
    background-color: #2d3748;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #4a5568;
    }
  }
`;

const countryListStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const countryItemStyle = css`
  padding: 10px;
  background-color: #2d3748;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 5px;
  width: calc(20% - 10px);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  &:hover {
    background-color: #4a5568;
  }
`;
