class TransactionService {
  processTransaction(cardNumber) {
    // Get the last digit of the card number
    const lastDigit = cardNumber.toString().slice(-1);

    switch (lastDigit) {
      case "1":
        return {
          status: "approved",
          message: "Transaction approved successfully",
          transactionId: this.generateTransactionId(),
        };
      case "2":
        return {
          status: "declined",
          message:
            "Transaction declined. Please check your card details or try a different payment method.",
          transactionId: null,
        };
      case "3":
        return {
          status: "error",
          message:
            "Payment gateway error. Please try again later or contact support.",
          transactionId: null,
        };
      default:
        // For any other digit, randomly assign an outcome for realism
        const outcomes = ["approved", "declined", "error"];
        const randomOutcome =
          outcomes[Math.floor(Math.random() * outcomes.length)];

        switch (randomOutcome) {
          case "approved":
            return {
              status: "approved",
              message: "Transaction approved successfully",
              transactionId: this.generateTransactionId(),
            };
          case "declined":
            return {
              status: "declined",
              message: "Transaction declined. Please check your card details.",
              transactionId: null,
            };
          default:
            return {
              status: "error",
              message: "Payment gateway error. Please try again later.",
              transactionId: null,
            };
        }
    }
  }

  generateTransactionId() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `TXN-${timestamp}-${randomNum}`;
  }

  maskCardNumber(cardNumber) {
    const cardStr = cardNumber.toString();
    const lastFour = cardStr.slice(-4);
    const masked = "*".repeat(cardStr.length - 4) + lastFour;
    return masked;
  }

  validateCardNumber(cardNumber) {
    const cardStr = cardNumber.toString().replace(/\s/g, "");
    return /^\d{16}$/.test(cardStr);
  }

  validateExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) {
      return false;
    }

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth <= currentMonth)
    ) {
      return false;
    }

    return true;
  }

  validateCVV(cvv) {
    return /^\d{3}$/.test(cvv.toString());
  }
}

module.exports = new TransactionService();
