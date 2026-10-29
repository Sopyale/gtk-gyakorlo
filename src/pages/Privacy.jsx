// Adatkezelési tájékoztató: what the accounts store and why, in plain Hungarian.
export default function Privacy() {
  return (
    <div className="wrap page narrow prose">
      <h1 className="page-title">Adatkezelés</h1>
      <p className="lede">Gyakorolni fiók nélkül is lehet. Ilyenkor minden adat csak a saját böngésződben marad. Ez az oldal arról szól, mi történik, ha regisztrálsz.</p>
      <h2>Miért kérjük</h2>
      <p>Azért, hogy az oldal üzemeltetője tudja, <strong>kinek adhat hozzáférést a Drive-mappához</strong>. Amikor valaki hozzáférést kér, a kérésben szereplő e-mail-címet össze tudja vetni a regisztrált Neptun-kódokkal. A haladásodat azért tároljuk, hogy minden eszközödön ott folytathasd, ahol abbahagytad.</p>
      <p>Az adatokkal ezen kívül semmit nem kezdünk: nem adjuk el, nem adjuk tovább, és nem küldünk hírlevelet. Az e-mail-címedre csak akkor megy levél, ha jelszó-visszaállítást kérsz.</p>
      <h2>Mit tárolunk</h2>
      <ul>
        <li>a Neptun-kódodat, ez a felhasználóneved;</li>
        <li>az e-mail-címedet: amivel regisztráltál, vagy Google-belépésnél a Google-fiókod címét;</li>
        <li>a jelszavadat, de csak visszafejthetetlen formában (bcrypt-hash), így azt senki nem látja;</li>
        <li>a haladásodat: melyik kérdést találtad el, a rontott kérdéseidet, a flashcardokat és az ütemtervedet;</li>
        <li>a „Segítség kérése” oldalon elküldött üzeneteidet és a rájuk írt válaszokat;</li>
        <li>a 3 naponta kért visszajelzéseidet (értékelés és szöveg); bejelentkezés nélkül a fiókod helyett egy véletlenszerű eszközazonosítóval;</li>
        <li>mikor regisztráltál, mikor jártál az oldalon utoljára, és hányszor nyitottad meg a Drive-linket. Ebből az üzemeltető összesítve látja, hányan használják az oldalt.</li>
      </ul>
      <h2>Ki látja, és hol van</h2>
      <p>Az adataidat csak te és az oldal üzemeltetője látja. Senkinek nem adjuk tovább, hirdetési vagy követő sütit az oldal nem használ. Az adatok a Supabase szerverén vannak, az EU-ban (Írország). A belépésed a böngésződ helyi tárolójában marad, amíg ki nem jelentkezel.</p>
      <h2>Meddig, és hogyan törölheted</h2>
      <p>Az adataidat addig tároljuk, amíg a fiókodat nem törlöd. A Fiók oldalon a „Fiók törlése” gombbal bármikor véglegesen törölheted az összes szerveren tárolt adatodat. Ha más kérdésed van az adataiddal kapcsolatban, keresd az oldal üzemeltetőjét.</p>
      <p><strong>Soha ne add meg a Neptun-jelszavadat.</strong> Ennek az oldalnak saját jelszava van, és ez nem a Neptun.</p>
    </div>
  );
}
