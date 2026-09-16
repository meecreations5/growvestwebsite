import Image from "next/image";

const OPTIMIZED_HOSTS = new Set([
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
]);

function canUseNextImage(src) {
  const value = String(src || "").trim();
  if (!value) return false;
  if (value.startsWith("/")) return true;
  try {
    const { hostname, protocol } = new URL(value);
    if (protocol !== "https:") return false;
    return OPTIMIZED_HOSTS.has(hostname)
      || hostname.endsWith(".googleusercontent.com")
      || hostname.endsWith(".googleapis.com");
  } catch {
    return false;
  }
}

export function OptimizedImage({
  src,
  alt = "",
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className = "",
  style,
  loading,
  ...rest
}) {
  if (!src) return null;

  if (canUseNextImage(src)) {
    const shared = {
      src,
      alt,
      className,
      style,
      sizes,
      priority,
      ...(priority ? {} : { loading: loading || "lazy" }),
      ...rest,
    };
    return fill
      ? <Image {...shared} fill />
      : <Image {...shared} width={width || 800} height={height || 450} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? "eager" : (loading || "lazy")}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      {...rest}
    />
  );
}
