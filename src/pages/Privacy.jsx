// Adatkezelési tájékoztató: what the accounts store and why, in plain Hungarian.
export default function Privacy() {
  return (
    <div className="wrap page narrow prose">
      <h1 className="page-title">Adatkezelés</h1>
      <p className="lede">Gyakorolni fiók nélkül is lehet. Ilyenkor minden adat csak a saját böngésződben marad. Ez az oldal arról szól, mi történik, ha regisztrálsz.</p>
      <h2>Mit tárolunk</h2>
      <ul>
        <li>a Neptun-kódodat, ez a felhasználóneved;</li>
        <li>az e-mail-címet, amivel a Drive-mappához hozzáférést kérsz, és Google-belépésnél a Google-fiókod címét;</li>
        <li>a jelszavadat, de csak visszafejthetetlen formában (bcrypt-hash), így azt senki nem látja;</li>
        <li>a haladásodat: melyik kérdést találtad el, a rontott kérdéseidet, a flashcardokat és az ütemtervedet;</li>
        <li>mikor regisztráltál, mikor jártál az oldalon utoljára, és hányszor nyitottad meg a Drive-linket.</li>
      </ul>
      <h2>Miért</h2>
      <ul>
        <li>hogy a haladásod minden eszközödön megmaradjon;</li>
        <li>hogy az oldal üzemeltetője a Drive-hozzáférési kéréseket össze tudja vetni a regisztrált hallgatókkal;</li>
        <li>hogy lássa, hányan és mennyit használják az oldalt.</li>
      </ul>
      <h2>Ki látja, és hol van</h2>
      <p>Az adataidat csak te és az oldal üzemeltetője látja. Senkinek nem adjuk tovább, hirdetési vagy követő sütit az oldal nem használ. Az adatok a Supabase szerverén vannak, az EU-ban (Írország). A belépésed a böngésződ helyi tárolójában marad, amíg ki nem jelentkezel.</p>
      <h2>Meddig, és hogyan törölheted</h2>
      <p>Az adataidat addig tároljuk, amíg a fiókodat nem törlöd. A Fiók oldalon a „Fiók törlése” gombbal bármikor véglegesen törölheted az összes szerveren tárolt adatodat. Ha más kérdésed van az adataiddal kapcsolatban, keresd az oldal üzemeltetőjét.</p>
      <p><strong>Soha ne add meg a Neptun-jelszavadat.</strong> Ennek az oldalnak saját jelszava van, és ez nem a Neptun.</p>
    </div>
  );
}
