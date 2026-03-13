import { body, validationResult } from "express-validator";

export const validateSpace = [
  body("spaceName")
    .isLength({ min: 2, max: 20 })
    .withMessage("Space name must be between 2 and 20 characters"),
  body("spaceDesc")
    .isLength({ min: 2, max: 300 })
    .withMessage("Description must be between 2 and 300 characters"),
  body("customMessage")
    .isLength({ max: 300 })
    .withMessage("Custom message must be max 300 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];
