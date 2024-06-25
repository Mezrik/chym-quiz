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
