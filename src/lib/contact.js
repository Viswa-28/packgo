import site from '../content/site.json';

const { whatsappNumber, phoneLink, phoneDisplay } = site.contact;

/**
 * Build a wa.me link with a context-specific prefilled message.
 * Every CTA on the page passes its own text so the enquiry arrives with context.
 */
export function wa(message) {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const tel = `tel:${phoneLink}`;
export const phone = phoneDisplay;

/** "Call 93429 37594" — used on the hero and final CTA. */
export const callLabel = `Call ${phoneDisplay}`;

/** Prices render as "From ₹X,XXX", or not at all when the value is unknown. */
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `From ₹${n.toLocaleString('en-IN')}`;
}

/** Drops the `_note` / `_howto` documentation keys out of rendered data. */
export function clean(list) {
  return list.filter((item) => item && typeof item === 'object');
}
