export default function Page() {
  return (
    <div className="col-span-8">
      <div className="text-xl space-y-6">
        <p>Tato aplikace vznikla v rámci diplomové práce:</p>
        <p>
          <strong>
            Tvorba nástroje pro hodnocení vizualizační gramotnosti
          </strong>{" "}
          na{" "}
          <a
            className="text-blue-500 underline"
            href="https://www.google.com/search?q=kisk+muni&rlz=1C1GCEA_enCZ1088CZ1088&oq=kisk+muni&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDEzMjJqMGo5qAIAsAIB&sourceid=chrome&ie=UTF-8"
          >
            katedře informačních studií a knihovnictví Masarykovy univerzity
          </a>
          .
        </p>
        <p>
          Veškerý popis této aplikace spolu s teorií naleznete v ní. V případě
          jakýchkoliv dotazů kontaktuje: jachymkubacek@gmail.com
        </p>
      </div>
    </div>
  );
}
