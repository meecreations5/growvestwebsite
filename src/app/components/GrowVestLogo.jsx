import { GrowVestMark } from "./GrowVestMark";

export function GrowVestLogo({ className = "", tone = "white", animated = true }) {
  const wordmarkSource = tone === "dark" ? "/growvest-wordmark-dark.svg" : "/growvest-wordmark-white.svg";

  return (
    <span className={`gv-full-logo ${className}`} aria-hidden="true">
      <img
        src={wordmarkSource}
        alt=""
        className="gv-full-logo__wordmark"
        draggable="false"
      />
      <GrowVestMark
        ambient={animated}
        decorative
        className="gv-full-logo__mark"
      />
    </span>
  );
}
