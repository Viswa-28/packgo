import site from '../content/site.json';

const { whatsappNumber, phoneLink, phoneDisplay, altPhoneLink, altPhoneDisplay } = site.contact;

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

/**
 * Second contact number. Both are `null` when the owner hasn't set one, so
 * every caller can render the extra row conditionally.
 */
export const altPhone = altPhoneDisplay || null;
export const altTel = altPhone ? `tel:${altPhoneLink}` : null;

/**
 * The WhatsApp number in display form ("93429 37594"), derived from
 * whatsappNumber so the two can never drift apart.
 */
export const whatsappDisplay = whatsappNumber.replace(/^91/, '').replace(/^(\d{5})(\d{5})$/, '$1 $2');

/** Every number the business answers on — used for the JSON-LD `telephone`. */
export const phoneLinks = [phoneLink, altPhone ? altPhoneLink : null].filter(Boolean);

/** "Call 63691 53144" — used on the hero and final CTA. */
export const callLabel = `Call ${phoneDisplay}`;

/** Drops the `_note` / `_howto` documentation keys out of rendered data. */
export function clean(list) {
  return list.filter((item) => item && typeof item === 'object');
}
