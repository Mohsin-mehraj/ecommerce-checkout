const { body, validationResult } = require("express-validator");

const validateCheckoutForm = [
  // Customer Information
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Address must be between 5 and 100 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("zipCode")
    .trim()
    .notEmpty()
    .withMessage("Zip code is required")
    .matches(/^[0-9]{5}(-[0-9]{4})?$/)
    .withMessage("Please provide a valid zip code (e.g., 12345 or 12345-6789)"),

  // Payment Information
  body("cardNumber")
    .trim()
    .notEmpty()
    .withMessage("Card number is required")
    .matches(/^[0-9]{16}$/)
    .withMessage("Card number must be exactly 16 digits"),

  body("expiryDate")
    .trim()
    .notEmpty()
    .withMessage("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
    .withMessage("Expiry date must be in MM/YY format")
    .custom((value) => {
      const [month, year] = value.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);

      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth <= currentMonth)
      ) {
        throw new Error("Expiry date must be in the future");
      }
      return true;
    }),

  body("cvv")
    .trim()
    .notEmpty()
    .withMessage("CVV is required")
    .matches(/^[0-9]{3}$/)
    .withMessage("CVV must be exactly 3 digits"),

  // Product Information
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid number"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1, max: 10 })
    .withMessage("Quantity must be between 1 and 10"),

  body("selectedVariants")
    .isArray({ min: 1 })
    .withMessage("At least one variant must be selected"),

  body("selectedVariants.*")
    .trim()
    .notEmpty()
    .withMessage("Variant values cannot be empty"),
];

const validateProductStock = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid number"),

  body("selectedVariants")
    .isArray({ min: 1 })
    .withMessage("At least one variant must be selected"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1, max: 10 })
    .withMessage("Quantity must be between 1 and 10"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    console.log("❌ Validation failed:");
    console.log("📋 Request body:", JSON.stringify(req.body, null, 2));
    console.log("🚫 Validation errors:", formattedErrors);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = {
  validateCheckoutForm,
  validateProductStock,
  handleValidationErrors,
};
