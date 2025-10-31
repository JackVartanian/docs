// docs/snippets/ImageCarousel.jsx
import { useRef, useState, useEffect, useCallback } from "react";

export const ImageCarousel = ({
  images = [],
  initialIndex = 0,
  showCaptions = true,
  showPreviews = true,
  className = "",
  thumbClass = "h-16 w-24 object-cover",
}) => {
  const [idx, setIdx] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );
  const thumbsRef = useRef([]);

  const go = useCallback(
    (delta) => {
      if (!images.length) return;
      setIdx((i) => (i + delta + images.length) % images.length);
    },
    [images.length]
  );

  const goTo = (i) => setIdx(i);

  useEffect(() => {
    // centraliza a miniatura ativa
    thumbsRef.current[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [idx]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  if (!images.length) return null;
  const current = images[idx];

  return (
    <div
      className={`not-prose ${className}`}
      role="region"
      aria-label="Image carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* IMAGEM PRINCIPAL */}
      <div className="relative">
        <img
          src={current.src}
          alt={current.alt || ""}
          className="w-full h-auto rounded-xl shadow"
          loading="eager"
        />

        {/* SETAS */}
        {images?.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue/80 hover:bg-white border rounded-full px-3 py-2 shadow"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border rounded-full px-3 py-2 shadow"
              aria-label="Próximo"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* LEGENDA */}
      {showCaptions && (current.caption || current.credit) && (
        <div className="mt-2 text-sm opacity-70">
          {current.caption}
          {current.credit && (
            <>
              {" "}
              — <span className="italic">{current.credit}</span>
            </>
          )}
        </div>
      )}

      {/* MINIATURAS */}
      {showPreviews && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              ref={(el) => (thumbsRef.current[i] = el)}
              className={`shrink-0 rounded-lg transition `}
              aria-label={`Ver imagem ${i + 1}`}
              style={{ borderBottom: idx === i ? "3px solid blue" : "none" }}
            >
              <img
                src={img.src}
                alt={img.alt || ""}
                className={`block rounded-lg ${thumbClass}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
