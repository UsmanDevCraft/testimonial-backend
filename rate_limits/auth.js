import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 5, // Limit each IP to 5 failed login attempts per hour
  standardHeaders: true, // This sends 'RateLimit-Remaining' and 'RateLimit-Reset'
  legacyHeaders: false, // This turns off the old 'X-RateLimit' headers
  message: {
    message: "Too many login attempts, please try again in 5 minutes.",
  },
});

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 signup requests per hour
  standardHeaders: true, // Let the frontend know how many tries are left
  legacyHeaders: false,
  message: {
    message:
      "Too many accounts created from this IP. Please try again in an hour.",
  },
});
