export const pickRandomQuestions = <T extends string | number>(
  questionIds: T[][],
  count: number = 20
): T[] => {
  const shuffled = questionIds.flat().sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count);
};

export const shuffle = <T extends any>(array: T[]): T[] => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const CHART_TYPE_CAPTION: Record<string, string> = {
  "bar-chart": "Sloupcový graf",
  "pie-chart": "Koláčový graf",
  cartogram: "Kartogram",
  histogram: "Histogram",
  "line-chart": "Liniový graf",
  "correlation-chart": "Korelační graf",
};

export const getChartTypeCaption = (type: string) => {
  return CHART_TYPE_CAPTION[type] ?? type;
};
