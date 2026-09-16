export function GrowVestMark({ className = "", animated = false, ambient = false, outlined = false, decorative = false }) {
  return (
    <svg
      viewBox="0 0 42.75 24.75"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : "GrowVest"}
      className={`gv-mark ${animated ? "gv-mark--animated" : ""} ${ambient ? "gv-mark--ambient" : ""} ${outlined ? "gv-mark--outline" : ""} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="gv-mark__bridge"
        fill="currentColor"
        d="M30.984 17.445c-.441-1-.66-1.52-.66-1.562-.407-.934-1.922-4.473-4.547-10.61-.34-.812-.949-1.218-1.828-1.218h-.05c-.712 0-1.267.3-1.665.906-.23.352-.343.715-.343 1.086 0 .254.054.516.164.789l6.129 14.285c.492 1.273 1.433 1.91 2.816 1.91 1.363 0 2.293-.637 2.8-1.91l2.72-6.355c-4.301 6.476-5.536 2.68-5.536 2.68Z"
      />
      <path
        className="gv-mark__arrow"
        fill="currentColor"
        d="M40.5 0l-8.762 7.36 3.504.16-3.906 9.105c.07.156.148.34.246.559l.012.03.011.028c.008.024.23.656.742.656.395 0 1.531-.34 3.63-3.496l.507-.765a35.76 35.76 0 0 0 2.489-4.61l3.101 2.512L40.5 0Z"
      />
      <path
        className="gv-mark__flow"
        fill="currentColor"
        d="m18.453 20.602-1.23.968c-3.114 2.446-7.688 1.414-9.434-2.136L.094 3.78H3.26c2.426 0 4.637 1.367 5.696 3.547l5.078 10.41a5.66 5.66 0 0 0 1.586 1.918c.684.504 1.617.934 2.797.903a6.563 6.563 0 0 1-.719-1.125L10.004 3.78h3.168c2.422 0 4.633 1.367 5.695 3.547l5.074 10.41a5.686 5.686 0 0 0 1.59 1.918c.7.52 1.668.961 2.89.899l-1.292 1.015c-2.73 2.149-6.594 1.606-8.676-.968Zm6.5-10.176 3.473-6.668-8.676.004 3.348 6.648c.382.762 1.464.77 1.855.016Z"
      />
    </svg>
  );
}
