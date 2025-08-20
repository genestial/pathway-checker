import React, { useRef, useEffect } from 'react';

const ScoreCard = ({ title, percentage, canvasRef, ariaLabel, displayText }) => {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percentage !== null ? (percentage / 100) * 2 * Math.PI : 0);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 10;
    const colorClass = percentage === null ? 'in-progress' : 
      percentage >= 85 ? 'leading' : 
      percentage >= 65 ? 'advancing' : 
      percentage >= 40 ? 'developing' : 'needs-improvement';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`).trim() || '#000';
    ctx.stroke();

    const innerRadius = radius - 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`).trim() || '#000') + '80';
    ctx.fill();

  }, [percentage, displayText]);

  return (
    <article className="score-card relative">
      <h2 className="score-card__title">{title}</h2>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width="200" height="200"
          className="score-card__canvas"
          aria-label={ariaLabel}
        />
        {displayText != null && (
          <div className="score-card__overlay">
            {displayText}
          </div>
        )}
      </div>
    </article>
  );
};

export default ScoreCard;