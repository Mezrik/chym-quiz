export const pickRandomQuestions = <T extends string | number>(
  questionIds: T[][],
  count: number = 20
): T[] => {
  const shuffled = questionIds.flat().sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count);
};
