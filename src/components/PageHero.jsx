// src/components/PageHero.jsx
import React from "react";

/**
 * PageHero
 * - title: string (required)
 * - subtitle: ReactNode (optional, can be JSX)
 */
export default function PageHero({ title, subtitle }) {
  return (
    <div className="page-hero">
      <div className="page-hero__band">
        <div className="page-hero__inner">
          <h1 className="page-hero__title">{title}</h1>
          {subtitle ? <div className="page-hero__subtitle">{subtitle}</div> : null}
        </div>
      </div>
    </div>
  );
}
