export default function Marquee({ images }: { images: string[] }) {
  const track = [...images, ...images];
  return (
    <div className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-[marquee_35s_linear_infinite] items-center gap-10 py-4">
        {track.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden={i >= images.length}
            className="h-24 w-auto shrink-0 object-contain lg:h-32"
          />
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
