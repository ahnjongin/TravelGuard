/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const DetailedCountryPage = () => {
  const { countryCode } = useParams(); 
  const [countryInfo, setCountryInfo] = useState<any>(null);
  const [embassyInfo, setEmbassyInfo] = useState<any[]>([]);
  const [entryInfo, setEntryInfo] = useState<any[]>([]);
  const [safetyNotices, setSafetyNotices] = useState<any[]>([]);
  const [loadingSafetyNotices, setLoadingSafetyNotices] = useState(true);
  const [loadingEntryInfo, setLoadingEntryInfo] = useState(true); 

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await axios.get(
          `http://apis.data.go.kr/1262000/TravelAlarmService0404/getTravelAlarm0404List?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru/MMElU5kcRGbWollJUWM9OUQPTRydfCh1/y0k2K9eTJMXjHQafwH5HHS0h/KA==&returnType=JSON&country_iso_alp2=${countryCode}&numOfRows=203`,
        );

        // 응답 데이터 전체 출력 (구조 확인용)
        console.log("API Response:", response.data.data);

        // 응답 데이터에서 countryCode와 일치하는 국가 정보를 찾음 (대소문자 구분 없이 비교)
        const countryData = response.data.data.find(
          (country: any) =>
            country.country_iso_alp2.toUpperCase() ===
            countryCode?.toUpperCase(),
        );

        if (countryData) {
          setCountryInfo(countryData);
        } else {
          console.error(`No data found for countryCode: ${countryCode}`);
        }
      } catch (error) {
        console.error("Error fetching country info:", error);
      }
    };
    fetchCountryInfo();
  }, [countryCode]);

  // 대사관 정보 로드
  useEffect(() => {
    const fetchEmbassyInfo = async () => {
      try {
        const response = await axios.get(
          `http://apis.data.go.kr/1262000/EmbassyService2/getEmbassyList2?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru/MMElU5kcRGbWollJUWM9OUQPTRydfCh1/y0k2K9eTJMXjHQafwH5HHS0h/KA==&returnType=JSON&numOfRows=203`,
        );
        const filteredEmbassies = response.data.data.filter(
          (embassy: any) => embassy.country_iso_alp2 === countryCode,
        );
        setEmbassyInfo(filteredEmbassies);
      } catch (error) {
        console.error("Error fetching embassy info:", error);
      }
    };
    fetchEmbassyInfo();
  }, [countryCode]);

  // 입국 허가 정보 로드
  useEffect(() => {
    const fetchEntryInfo = async () => {
      if (!countryInfo) return;

      try {
        const response = await axios.get(
          `https://api.odcloud.kr/api/15076574/v1/uddi:b0a4deac-3443-4e7b-bee1-a6163b1dbc17?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru%2FMMElU5kcRGbWollJUWM9OUQPTRydfCh1%2Fy0k2K9eTJMXjHQafwH5HHS0h%2FKA%3D%3D&page=1&perPage=220&numOfRows=203`,
        );
        const filteredEntries = response.data.data.filter(
          (entry: any) =>
            entry.국가.localeCompare(countryInfo?.country_nm, undefined, {
              sensitivity: "base",
            }) === 0,
        );
        setEntryInfo(filteredEntries);
      } catch (error) {
        console.error("Error fetching entry info:", error);
      } finally {
        setLoadingEntryInfo(false); // 로딩 완료
      }
    };
    fetchEntryInfo();
  }, [countryInfo]);

  // 안전 공지 로드
  useEffect(() => {
    const fetchSafetyNotices = async () => {
      try {
        const response = await axios.get(
          `https://apis.data.go.kr/1262000/CountrySafetyService6/getCountrySafetyList6?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru/MMElU5kcRGbWollJUWM9OUQPTRydfCh1/y0k2K9eTJMXjHQafwH5HHS0h/KA==&numOfRows=3&cond[country_iso_alp2::EQ]=${countryCode}&pageNo=1`,
        );
        const filteredNotices = response.data.data.filter(
          (notice: any) => notice.country_iso_alp2 === countryCode,
        );
        setSafetyNotices(filteredNotices);
      } catch (error) {
        console.error("Error fetching safety notices:", error);
      } finally {
        setLoadingSafetyNotices(false);
      }
    };
    fetchSafetyNotices();
  }, [countryCode]);

  return (
    <div css={pageWrap}>
      <div css={pageContainer}>
        <p css={pagep}>국가 지역 별 최신 정보를 제공합니다.</p>
        <div css={countryInfoContainer}>
          <img
            src={countryInfo?.flag_download_url}
            alt={`${countryInfo?.country_nm} 국기`}
            css={flagStyle}
          />
          <h1>
            {countryInfo?.country_nm} ({countryInfo?.country_eng_nm})
          </h1>
        </div>
        <div css={contentContainer}>
          {/* 왼쪽 지도 및 국가 정보 표시 */}
          <div css={leftContainer}>
            <div css={mapContainer}>
              <img
                src={countryInfo?.dang_map_download_url}
                alt="지도 이미지"
                css={mapStyle}
              />
            </div>
          </div>

          {/* 오른쪽 안전 공지 정보 */}
          <div css={rightContainer}>
            <div css={safetyNoticeStyle}>
              <h2>안전 공지</h2>
              {loadingSafetyNotices ? (
                <p>로딩 중...</p>
              ) : safetyNotices.length > 0 ? (
                <ul>
                  {safetyNotices.map((notice: any, index: number) => (
                    <li key={index}>
                      <p>{notice.title}</p>
                      <p>{notice.wrt_dt}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>안전 공지가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        <div css={entryInfoStyle}>
          <h2>입국 허가 정보</h2>
          {loadingEntryInfo ? (
            <p>로딩 중...</p>
          ) : entryInfo.length > 0 ? (
            <table css={tableStyle}>
              <thead>
                <tr>
                  <th>입국 가능 여부</th>
                  <th>입국 가능 기간</th>
                  <th>필수 소지 서류</th>
                </tr>
              </thead>
              <tbody>
                {entryInfo.map((entry: any, index: number) => (
                  <tr key={index}>
                    <td>{entry["일반여권소지자-입국가능여부"]}</td>
                    <td>{entry["일반여권소지자-입국가능기간"]}</td>
                    <td>{entry["입국시 소지여부"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>해당 국가에 대한 입국 정보가 없습니다.</p>
          )}
        </div>
        {/* 하단 재외공관 정보 */}
        <div css={embassyInfoContainer}>
          <h2>대사관 정보</h2>
          <table css={tableStyle}>
            <thead>
              <tr>
                <th>재외공관명</th>
                <th>주소</th>
                <th>전화번호</th>
                <th>긴급전화</th>
              </tr>
            </thead>
            <tbody>
              {embassyInfo.map((embassy: any, index: number) => (
                <tr key={index}>
                  <td>{embassy.embassy_kor_nm}</td>
                  <td>{embassy.emblgbd_addr}</td>
                  <td>{embassy.tel_no}</td>
                  <td>{embassy.urgency_tel_no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailedCountryPage;

// 스타일
const pageWrap = css`
  background-color: #111;
  min-height: 100vh;
  color: white;
  padding: 20px;
`;

const pagep = css`
  padding: 20px;
  width: 80%;
  display: flex;
`;

const pageContainer = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
`;

const contentContainer = css`
  display: flex;
  gap: 20px;
  height: max-content;
`;

const leftContainer = css`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: auto;
  object-fit: contain;
`;

const rightContainer = css`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const countryInfoContainer = css`
  display: flex;
  gap: 20px;
`;

const flagStyle = css`
  width: 150px;
  height: auto;
`;

const mapContainer = css`
  width: 100%;
  height: 300px;
  background-color: #222;
  border-radius: 10px;
  margin-top: 20px;
`;

const mapStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const safetyNoticeStyle = css`
  padding: 20px;
  background-color: #222;
  border-radius: 10px;

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 10px;
      background-color: #333;
      margin-bottom: 10px;
      border-radius: 5px;

      &:hover {
        background-color: #4a5568;
      }
    }
  }
`;

const entryInfoStyle = css`
  padding: 20px;
  margin-top: 20px;
  background-color: #222;
  border-radius: 10px;
`;

const embassyInfoContainer = css`
  padding: 20px;
  background-color: #222;
  border-radius: 10px;
  margin-top: 20px;
`;

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    border: 1px solid #333;
    text-align: left;
  }

  th {
    background-color: #333;
    color: #fff;
  }

  tr {
    background-color: #2d2d2d;
  }

  tr:nth-of-type(even) {
    background-color: #1e1e1e;
  }

  tr:hover {
    background-color: #4a5568;
  }
`;
