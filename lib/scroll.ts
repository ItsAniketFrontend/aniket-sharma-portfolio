// Shared mutable bridges so ScrollTriggers in the page can drive R3F useFrame
// loops without React re-renders. Both sides import the same client instance.
export const heroScroll = { progress: 0 };
export const pageScroll = { progress: 0 };
