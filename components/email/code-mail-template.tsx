import * as React from "react";

interface CodeMailTemplateProps {
  code: string;
  quizUrl: string;
}

export const CodeMailTemplate: React.FC<Readonly<CodeMailTemplateProps>> = ({
  code,
  quizUrl,
}) => (
  <div>
    <div style={{ width: "56px", height: "56px" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        style={{ width: "100%" }}
        src="https://zfdvpmvjmixjasshtxvf.supabase.co/storage/v1/object/public/question_image/logo.png"
        alt="Test vizualizační gramotnosti"
      />
    </div>
    <p>
      <strong>Kód pro studenty: {code}</strong>
    </p>
    <p>Výsledky jsou dostupné zde: {quizUrl}</p>
  </div>
);
