/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import InputField from "../components/common/Input"; 

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const PermissionEnter = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEnterData = async () => {
      try {
        const response = await axios.get(
          "https://api.odcloud.kr/api/15076574/v1/uddi:b0a4deac-3443-4e7b-bee1-a6163b1dbc17?page=1&perPage=200&serviceKey=YO9eH5JtPGlCnJe4hsmmj0Gru%2FMMElU5kcRGbWollJUWM9OUQPTRydfCh1%2Fy0k2K9eTJMXjHQafwH5HHS0h%2FKA%3D%3D",
        );
        if (Array.isArray(response.data.data)) {
          const sortedData = response.data.data.sort((a: any, b: any) =>
            a.국가.localeCompare(b.국가),
          );
          setCountries(sortedData);
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching enter data:", error);
      }
    };
    fetchEnterData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCountries = countries.filter((country: any) =>
    country.국가.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div css={pageWrap}>
      <div css={pageContainer}>
        <h1>국가별 입국 허가요건</h1>
        <p>해당 페이지 설명이 들어가는 자리입니다.</p>

        <InputField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="국가 명을 입력하세요"
        />

        <table css={tableStyle}>
          <thead>
            <tr>
              <th>국가</th>
              <th>입국가능기간</th>
              <th>입국가능여부</th>
              <th>입국시 소지여부</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map((country: any, index: number) => (
              <tr key={index}>
                <td>{country.국가}</td>
                <td>{country["일반여권소지자-입국가능기간"]}</td>
                <td>{country["일반여권소지자-입국가능여부"]}</td>
                <td>{country["입국시 소지여부"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionEnter;

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
