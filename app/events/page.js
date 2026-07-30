'use client';
import { useState, useEffect } from 'react';
import { events, eventTypes } from '@/data/events';

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="countdown-strip">
      ⏱️ Next event in:
      {['days', 'hours', 'mins', 'secs'].map((unit, i) => (
        <>
          <div key={unit} className="countdown-unit">
            <span className="countdown-value">{String(timeLeft[unit]).padStart(2, '0')}</span>
            <span className="countdown-label">{unit}</span>
          </div>
          {i < 3 && <span className="countdown-sep" key={`sep-${i}`}>:</span>}
        </>
      ))}
    </div>
  );
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredEvents = activeFilter === 'All'
    ? events
    : events.filter(e => e.type === activeFilter);

  const nextEvent = events.reduce((earliest, ev) => {
    const d = new Date(ev.date);
    return d > new Date() && (!earliest || d < new Date(earliest.date)) ? ev : earliest;
  }, null);

  return (
    <>
      {/* Hero */}
      <section className="events-hero">
        <div className="events-hero-bg" />
        <div className="container text-center">
          <span className="label">Growth &amp; Learning</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Upcoming <span className="text-gradient">Events</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '1.05rem' }}>
            Join our seminars, workshops, and training sessions across India to upgrade your skills and network with top performers.
          </p>
          {nextEvent && <Countdown targetDate={nextEvent.date} />}
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section">
        <div className="container">
          {/* Filter Tabs */}
          <div className="events-filter">
            {eventTypes.map(type => (
              <button
                key={type}
                className={`chip ${activeFilter === type ? 'active' : ''}`}
                onClick={() => setActiveFilter(type)}
              >
                {type === 'All' && '🗓️ '}
                {type === 'Seminar' && '🎤 '}
                {type === 'Workshop' && '🛠️ '}
                {type === 'Training' && '📚 '}
                {type === 'Online Meeting' && '💻 '}
                {type}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Events Grid */}
          <div className="events-grid">
            {filteredEvents.map(event => {
              const spotsPercent = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);
              const isUrgent = event.spotsLeft < 20;

              return (
                <div key={event.id} className="event-card glass-card card-hover-glow">
                  {/* Card Header */}
                  <div className="event-card-header">
                    <div className="event-emoji-wrap">{event.image}</div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-sm" style={{ marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${event.mode === 'Online' ? 'badge-secondary' : 'badge-primary'}`}>
                          {event.mode === 'Online' ? '🌐' : '📍'} {event.mode}
                        </span>
                        {event.mode === 'Online' && <span className="badge badge-live">● LIVE</span>}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {event.type}
                        </span>
                      </div>
                      <h3 className="event-card-title">{event.title}</h3>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <span style={{ color: 'var(--primary)' }}>📅</span>
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="event-meta-item">
                      <span style={{ color: 'var(--primary)' }}>⏰</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="event-meta-item">
                      <span style={{ color: 'var(--primary)' }}>📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Speaker */}
                  <div className="event-speaker">
                    <div className="speaker-avatar">🎤</div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Speaker</span>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{event.speaker}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="event-desc">{event.description}</p>

                  {/* Footer */}
                  <div className="event-card-footer">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                        <span style={{ color: isUrgent ? '#ff4757' : 'var(--text-secondary)', fontWeight: 600 }}>
                          {isUrgent ? '🔥 ' : ''}{event.spotsLeft} spots left
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>{event.spots} total</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '6px' }}>
                        <div className="progress-bar-fill" style={{
                          width: `${spotsPercent}%`,
                          background: isUrgent ? 'linear-gradient(90deg, #ff4757, #ff6b81)' : undefined,
                        }} />
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }}>
                      Register →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        .events-hero {
          padding: calc(var(--nav-height) + 3rem) 0 4rem;
          position: relative;
          overflow: hidden;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-glass);
        }

        .events-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 80%, rgba(0,212,170,0.06), transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(108,99,255,0.05), transparent 50%);
        }

        .events-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .event-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }

        .event-card-header {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 1.5rem 1.5rem 1rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid var(--border-glass);
        }

        .event-emoji-wrap {
          width: 56px; height: 56px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .event-card-title {
          font-size: 1.15rem;
          line-height: 1.3;
          margin: 0;
        }

        .event-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 1rem 1.5rem;
          background: rgba(0,212,170,0.02);
        }

        .event-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .event-speaker {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.75rem 1.5rem;
          background: var(--bg-tertiary);
        }

        .speaker-avatar {
          width: 32px; height: 32px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }

        .event-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          padding: 1rem 1.5rem;
          flex: 1;
          line-height: 1.6;
          margin: 0;
        }

        .event-card-footer {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px dashed var(--border-glass);
        }

        @media (max-width: 768px) {
          .events-grid { grid-template-columns: 1fr; }
          .events-filter { gap: 0.4rem; }
        }
      `}</style>
    </>
  );
}
