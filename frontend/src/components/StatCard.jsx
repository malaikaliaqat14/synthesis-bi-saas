import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#6366f1', trend }) => {
  return (
    <div className="glass-panel" style={{
      padding: '1.25rem 1.4rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${color}, #8b5cf6)`
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            color: '#0f172a',
            marginTop: '0.35rem',
            letterSpacing: '-0.02em'
          }}>
            {value}
          </div>
        </div>

        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: `${color}15`,
          border: `1px solid ${color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', fontSize: '0.78rem' }}>
          {trend && (
            <span style={{
              background: trend.isPositive ? '#dcfce7' : '#fee2e2',
              color: trend.isPositive ? '#16a34a' : '#dc2626',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && (
            <span style={{ color: '#64748b' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
