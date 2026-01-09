import { useState, useEffect, useRef } from "react";

const ResponsiveImage = ({
  src,
  alt = "Image",
  className = "",
  priority = false,
  width,
  height,
  aspectRatio = "auto",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px",
  objectFit = "cover",
  onLoaded,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imgRef = useRef(null);

  const generateSrcSet = () => {
    if (!src) return "";
    const widths = [320, 480, 640, 768, 1024, 1280, 1536, 1920];

    if (src.includes("cloudinary.com")) {
      return widths
        .map(
          (w) =>
            `${src.replace(
              /\/upload\//,


              `/upload/w_${w},c_fill,f_auto,q_auto/`,
            )} ${w}w`,


        )
        .join(", ");
    }

    return widths
      .map((w) => {
        const sep = src.includes("?") ? "&" : "?";
        return `${src}${sep}w=${w} ${w}w`;
      })
      .join(", ");
  };

  const getContainerStyle = () => {
    if (width && height) {
      return {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      };
    } else if (aspectRatio && aspectRatio !== "auto") {
      return { aspectRatio };
    } else if (imageDimensions.width && imageDimensions.height) {
      return {
        aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
      };
    } else {
      return { aspectRatio: "4 / 3" }; // fallback
    }
  };

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setLoaded(true);
      onLoaded?.();
    };

    img.onerror = () => {
      setError(true);
      onError?.();
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (!src) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500 text-sm">No image source provided</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={getContainerStyle()}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      {!error && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          role="img"
          aria-label={alt}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          srcSet={generateSrcSet()}
          width={aspectRatio === "auto" ? width : undefined}
          height={aspectRatio === "auto" ? height : undefined}
          className={`w-full h-full object-${objectFit} transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => {
            if (!loaded) {
              setLoaded(true);
              onLoaded?.();
            }
          }}
          onError={() => {
            setError(true);
            onError?.();
          }}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}

      {error && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <svg
            className="w-12 h-12 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">Failed to load image</p>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
