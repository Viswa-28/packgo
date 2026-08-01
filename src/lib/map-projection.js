/**
 * Projection for the hero sightseeing map.
 *
 * Plate carrée with a cos(latitude) correction on x, so the peninsula isn't
 * stretched sideways. Shared by the build script that traces the coastline and
 * by the component that places the pins, so they can never disagree.
 */

/** Reference latitude for the width correction — mid-frame. */
const COS_MID = Math.cos((12 * Math.PI) / 180);

export const FRAME = {
  lon0: 73.2,
  lat0: 16.6,
  scale: 58,
  padX: 26,
  padY: 16,
  width: 560,
  height: 548,
};

export function project(lat, lon) {
  return {
    x: FRAME.padX + (lon - FRAME.lon0) * FRAME.scale * COS_MID,
    y: FRAME.padY + (FRAME.lat0 - lat) * FRAME.scale,
  };
}
