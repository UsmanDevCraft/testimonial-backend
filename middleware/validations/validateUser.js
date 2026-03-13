import { body, validationResult } from "express-validator";

export const validateUser = [
  body("name")
    .isLength({ min: 2, max: 20 })
    .withMessage("Name must be between 2 and 20 characters"),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters")
    .matches(/[a-z]/)
    .withMessage("Must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Must contain an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Must contain a special symbol"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];
