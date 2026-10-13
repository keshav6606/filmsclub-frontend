import React, { useState } from 'react';
import {
  formatQuality,
  getQualityName,
  formatSize,
  parseMediaInfo,
  extractEpisodeNumber,
  sortSources
} from '../utils/helpers';

// Download arrow icon
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Single Movie File Download Row
export function FileDownloadItem({ source, isRecommended, isSmallFile, fallbackLabel }) {
  const info = parseMediaInfo(source.label);
  const tagStr = [info.source, info.codec].filter(Boolean).join(' · ');

  return (
    <li>
      <a
        className={'file' + (isRecommended ? ' rec' : '')}
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="qb">
          {formatQuality(source.quality)}
          {getQualityName(source.quality) && (
            <small>{getQualityName(source.quality)}</small>
          )}
        </span>
        <span className="d">
          <strong>
            {tagStr || source.label || fallbackLabel}
            {isRecommended ? (
              <em>Recommended</em>
            ) : isSmallFile ? (
              <em className="q2">Smaller file</em>
            ) : null}
          </strong>
          {tagStr && info.audio && (
            <span>{info.audio} audio</span>
          )}
        </span>
        <span className="s">{formatSize(source.size || '')}</span>
        <span className="go" aria-hidden="true">
          <DownloadIcon />
        </span>
      </a>
    </li>
  );
}

// Episode or Season Pack Accordion Row
export function EpisodeItem({ label, list = [], isNew, preferredQuality, startOpen = false, isPack = false }) {
  const [open, setOpen] = useState(startOpen);
  const sorted = [...list].sort(sortSources);
  const quickSource = sorted.find(s => s.quality === preferredQuality) || sorted[0];
  const hasMultiple = sorted.length > 1;
  const epNum = extractEpisodeNumber(label);

  return (
    <li className={'epi' + (open ? ' open' : '') + (hasMultiple ? ' multi' : '')}>
      <div
        className="ep"
        onClick={hasMultiple ? () => setOpen(o => !o) : undefined}
      >
        <span className="num">
          {isPack ? 'ZIP' : epNum ? String(epNum).padStart(2, '0') : ''}
        </span>
        <span className="n">
          <span className="nm">
            {label}
            {isNew && <span className="tagnew">New</span>}
          </span>
          {hasMultiple && (
            <small className="cnt">{sorted.length} links</small>
          )}
        </span>

        {quickSource && (
          <a
            className="quick"
            href={quickSource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            <DownloadIcon />
            <b>{quickSource.quality ? formatQuality(quickSource.quality) : 'Download'}</b>
            {quickSource.size && <small>{formatSize(quickSource.size)}</small>}
          </a>
        )}

        {hasMultiple ? (
          <button
            type="button"
            className="tog"
            aria-expanded={open}
            aria-label={`Show all links for ${label}`}
          >
            <ChevronDown />
          </button>
        ) : (
          <span />
        )}
      </div>

      {hasMultiple && (
        <div className="vers">
          <div>
            <div className="vgrid">
              {sorted.map((src, idx) => {
                const info = parseMediaInfo(src.label);
                const sameQualityGroup = sorted.filter(s => s.quality === src.quality);
                const desc = [info.source, info.codec].filter(Boolean).join(' · ') ||
                  (sameQualityGroup.length > 1 && !src.size ? `Link ${sameQualityGroup.indexOf(src) + 1}` : getQualityName(src.quality) || 'Quality not listed');

                return (
                  <a
                    key={idx}
                    className={'ver' + (src === quickSource ? ' on' : '')}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={open ? 0 : -1}
                  >
                    <b>{src.quality ? formatQuality(src.quality) : 'Other'}</b>
                    <span>{desc}</span>
                    <i>{formatSize(src.size || '')}</i>
                    <DownloadIcon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
