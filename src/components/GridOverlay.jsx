/**
 * 12 kolonluk ızgaranın kendisi. "g" tuşuyla açılıp kapanır —
 * sayfanın hangi sisteme oturduğunu görmek isteyen için.
 */
export default function GridOverlay({ on }) {
  return (
    <div className="grid-overlay" data-on={on} aria-hidden="true">
      <div className="shell h-full">
        <div className="grid12 h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="grid-overlay__col" />
          ))}
        </div>
      </div>
    </div>
  );
}
