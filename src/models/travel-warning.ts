export type TravelWarning = Array<{
  /** 국가코드 */
  country_iso_alp2: string;
  /** 위험경보 */
  alarm_lvl: number;

  properties: {
    ADMIN: string;
    ISO_A2: string;
    POP_EST: number;
  };
}>;
