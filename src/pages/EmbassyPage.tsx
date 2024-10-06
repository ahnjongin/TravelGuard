/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import InputField from "../components/common/Input"; 

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const EmbassyInfoPage = () => {
  const [embassies, setEmbassies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmbassyData = async () => {
      try {
        const response = await axios.get(
          "http://apis.data.go.kr/1262000/EmbassyService2/getEmbassyList2?serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru/MMElU5kcRGbWollJUWM9OUQPTRydfCh1/y0k2K9eTJMXjHQafwH5HHS0h/KA==&returnType=JSON&numOfRows=203",
        );
        if (Array.isArray(response.data.data)) {
          setEmbassies(response.data.data); 
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching embassy data:", error);
      }
    };
    fetchEmbassyData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredEmbassies = embassies.filter(
    (embassy: any) =>
      embassy.embassy_kor_nm
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      embassy.country_nm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      embassy.country_eng_nm.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div css={pageWrap}>
      <div css={pageContainer}>
        <h1>국가별 대사관 정보</h1>
        <p>국가/지역별 현지 공관 정보를 제공합니다.</p>

        <InputField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="대륙 또는 국가명을 입력하세요"
        />

        <table css={tableStyle}>
          <thead>
            <tr>
              <th>재외공관 한글명</th>
              <th>재외공관 주소</th>
              <th>대표전화번호</th>
              <th>긴급전화번호</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmbassies.map((embassy: any, index: number) => (
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
  );
};

export default EmbassyInfoPage;

const pageWrap = css`
  background-color: #111;
  min-height: 100vh;
  color: white;
  padding: 20px;
`;

const pageContainer = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
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
