import React, { useRef, useEffect } from 'react';

const TopicSection = ({ pillar, topics, responses, calculateTopicScore, getIconComponent, canvasRef, pillarScore }) => {
  const score = useRef(null);

  useEffect(() => {
    console.log(`Redrawing gauge for ${pillar}:`, score.current);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !score.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (score.current.percentage !== null ? (score.current.percentage / 100) * 2 * Math.PI : 0);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 10;
    const colorClass = score.current.percentage === null ? 'in-progress' : 
      score.current.percentage >= 85 ? 'leading' : 
      score.current.percentage >= 65 ? 'advancing' : 
      score.current.percentage >= 40 ? 'developing' : 'needs-improvement';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`).trim() || '#000';
    ctx.stroke();

    const innerRadius = radius - 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`).trim() || '#000') + '80';
    ctx.fill();

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`).trim() || '#000';
    ctx.font = score.current.percentage !== null ? '16px Montserrat' : '12px Montserrat';
    ctx.textAlign = 'center';
    ctx.fillText(score.current.percentage !== null ? `${Math.round(score.current.percentage)}%` : 'In progress', centerX, centerY + 5);
  }, [canvasRef, score.current && score.current.percentage]);

 // const pillarScore = calculatePillarScore(pillar, topics, calculateTopicScore);
  score.current = pillarScore;

  return (
    <section className="topic-section">
      <h2 className="topic-section__title">{pillar}</h2>
      <canvas ref={canvasRef} width="200" height="200" className="topic-section__canvas" aria-label={`${pillar} Pillar Gauge`} />
      <div className="topic-section__grid">
        {topics.map(topic => {
          const score = calculateTopicScore(topic);
          const IconComponent = getIconComponent(topic);
          return (
            <article key={topic} className="topic-section__item">
              <div className="topic-section__icon-container">
                {IconComponent ? (
                  <IconComponent style={{ width: '100%', height: '100%' }} />
                ) : (
                  <span className="in-progress">No Icon</span>
                )}
              </div>
              <p className="topic-section__value">
                <span className={score.percentage === null ? 'in-progress' : 
                  score.percentage >= 85 ? 'leading' : 
                  score.percentage >= 65 ? 'advancing' : 
                  score.percentage >= 40 ? 'developing' : 'needs-improvement'}>
                  {score.percentage !== null ? `${Math.round(score.percentage)}%` : 'In progress'}
                </span>
              </p>
              <p className="topic-section__label">{topic}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

// Helper function to calculate pillar score
/*const calculatePillarScore = (pillar, topics, calculateTopicScore) => {
  const topicScores = topics.map(calculateTopicScore);
  const validTopics = topicScores.filter(score => score.valid);
  const completeTopics = topicScores.filter(score => score.complete);
  if (validTopics.length === 0) return { percentage: null, valid: false, complete: false };
  if (completeTopics.length < topics.length) return { percentage: null, valid: true, complete: false };

  const totalPercentage = validTopics.reduce((sum, score) => sum + score.percentage, 0) / validTopics.length;
  return { percentage: totalPercentage, valid: true, complete: true };
};*/

export default TopicSection;