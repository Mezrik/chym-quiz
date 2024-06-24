export default function Page({ params }: { params: { quizId: string } }) {
  return <div>{params.quizId}</div>;
}
