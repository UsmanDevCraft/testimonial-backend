import rateLimit from "express-rate-limit";

// For general data fetching (GET)
export const apiReadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 40,
  message: { message: "Slow down! You're viewing pages too fast." },
  standardHeaders: true,
  legacyHeaders: false,
});

// For updating/deleting data (PUT, DELETE)
export const apiWriteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15,
  message: { message: "Too many updates. Please wait a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});
