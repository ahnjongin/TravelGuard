/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ColorLevel } from "../../constants";

const TravelWarningLevels = () => {
  const levels = [
    {
      color: ColorLevel[0],
      level: "0단계 경보단계 없음",
      description: "경보단계 없음",
    },
    {
      color: ColorLevel[1],
      level: "1단계 여행유의",
      description: "신변안전 위험 요인 숙지 대비",
    },
    {
      color: ColorLevel[2],
      level: "2단계 여행자제",
      description:
        "(여행예정자) 불필요한 여행 자제 (체류자) 신변안전 특별 유의",
    },
    {
      color: ColorLevel[3],
      level: "3단계 출국권고",
      description:
        "(여행예정자) 불필요한 여행 자제 (체류자) 신변안전 특별 유의",
    },
    {
      color: ColorLevel[4],
      level: "4단계 여행금지",
      description:
        "(여행예정자) 불필요한 여행 자제 (체류자) 신변안전 특별 유의",
    },
  ];

  const containerStyle = css`
    background-color: #1d2636;
    padding: 20px;
    border-radius: 10px;
    width: 350px;
    position: fixed;
    bottom: 0;
    z-index: 999;
  `;

  const levelStyle = css`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #2e3c50;
    border-radius: 5px;
    color: white;
    font-size: 14px;
    line-height: 1.5;
  `;

  const colorBoxStyle = (color: string) => css`
    width: 20px;
    height: 20px;
    background-color: ${color};
    margin-right: 10px;
    border-radius: 3px;
  `;

  const levelTextStyle = css`
    font-weight: bold;
    margin-right: 10px;
  `;

  const descriptionStyle = css`
    color: #b0b7c3;
  `;

  return (
    <div css={containerStyle}>
      {levels.map((item, index) => (
        <div css={levelStyle} key={index}>
          <div css={colorBoxStyle(item.color)}></div>
          <div>
            <span css={levelTextStyle}>{item.level}</span>
            <span css={descriptionStyle}>{item.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TravelWarningLevels;
