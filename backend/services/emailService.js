const nodemailer = require("nodemailer");
const emailConfig = require("../config/email");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email service is ready to send emails");
    } catch (error) {
      console.error("❌ Email service connection failed:", error.message);
      console.log("🔧 Please check your Mailtrap credentials in .env file");
    }
  }

  async sendOrderConfirmation(order) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    const html = this.generateApprovedEmailTemplate(order);

    try {
      const info = await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: order.customerInfo.email,
        subject,
        html,
      });

      console.log(`✅ Confirmation email sent to ${order.customerInfo.email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending confirmation email:", error.message);
      return false;
    }
  }

  async sendDeclinedNotification(order) {
    const subject = `Payment Declined - ${order.orderNumber}`;
    const html = this.generateDeclinedEmailTemplate(order);

    try {
      const info = await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: order.customerInfo.email,
        subject,
        html,
      });

      console.log(
        `📨 Declined notification sent to ${order.customerInfo.email}`
      );
      console.log(`📧 Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending declined notification:", error.message);
      return false;
    }
  }

  async sendErrorNotification(order) {
    const subject = `Payment Error - ${order.orderNumber}`;
    const html = this.generateErrorEmailTemplate(order);

    try {
      const info = await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: order.customerInfo.email,
        subject,
        html,
      });

      console.log(`⚠️ Error notification sent to ${order.customerInfo.email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error("❌ Error sending error notification:", error.message);
      return false;
    }
  }

  generateApprovedEmailTemplate(order) {
    const { customerInfo, productInfo, transaction } = order;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 0 20px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #4CAF50, #45a049); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px 20px; }
            .order-details { 
                background: #f9f9f9; 
                padding: 20px; 
                margin: 20px 0; 
                border-left: 4px solid #4CAF50; 
                border-radius: 5px; 
            }
            .order-details h3 { margin-top: 0; color: #4CAF50; }
            .footer { 
                text-align: center; 
                padding: 20px; 
                background: #f8f8f8; 
                color: #666; 
            }
            .success { color: #4CAF50; font-weight: bold; font-size: 18px; }
            .amount { font-size: 24px; color: #4CAF50; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Order Confirmed!</h1>
                <p class="success">✅ Your payment was successful</p>
            </div>
            
            <div class="content">
                <h2>Hi ${customerInfo.fullName},</h2>
                <p>Thank you for your order! We've received your payment and your order is being processed.</p>
                
                <div class="order-details">
                    <h3>📋 Order Details</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Product:</strong> ${productInfo.title}</p>
                    <p><strong>Selected Options:</strong> ${productInfo.selectedVariants.join(
                      ", "
                    )}</p>
                    <p><strong>Quantity:</strong> ${productInfo.quantity}</p>
                    <p class="amount"><strong>Total Paid:</strong> $${order.pricing.total.toFixed(
                      2
                    )}</p>
                    <p><strong>Transaction ID:</strong> ${
                      transaction.transactionId
                    }</p>
                </div>
                
                <div class="order-details">
                    <h3>🚚 Shipping Address</h3>
                    <p>${customerInfo.fullName}<br>
                    ${customerInfo.address}<br>
                    ${customerInfo.city}, ${customerInfo.state} ${
      customerInfo.zipCode
    }</p>
                    <p><strong>Phone:</strong> ${customerInfo.phone}</p>
                </div>
                
                <div class="order-details">
                    <h3>📦 What's Next?</h3>
                    <ul>
                        <li>✅ Your order is confirmed and being prepared</li>
                        <li>📧 You'll receive tracking information via email</li>
                        <li>🚚 Estimated delivery: 3-5 business days</li>
                       
                    </ul>
                </div>
                
                <p><strong>Questions?</strong> Contact us at support@ecommerce.com or (555) 123-4567</p>
            </div>
            
            <div class="footer">
                <p>Thank you for shopping with us! 🛍️</p>
                <p><strong>E-Commerce Store</strong></p>
                <p style="font-size: 12px; color: #999;">
                    This is a confirmation email for order ${order.orderNumber}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateDeclinedEmailTemplate(order) {
    const { customerInfo, productInfo } = order;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Declined</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 0 20px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #f44336, #d32f2f); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px 20px; }
            .order-details { 
                background: #fff3f3; 
                padding: 20px; 
                margin: 20px 0; 
                border-left: 4px solid #f44336; 
                border-radius: 5px; 
            }
            .order-details h3 { margin-top: 0; color: #f44336; }
            .footer { 
                text-align: center; 
                padding: 20px; 
                background: #f8f8f8; 
                color: #666; 
            }
            .error { color: #f44336; font-weight: bold; font-size: 18px; }
            .retry-btn { 
                background: #4CAF50; 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 5px; 
                display: inline-block; 
                margin: 20px 0; 
                font-weight: bold;
            }
            .steps { background: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>❌ Payment Declined</h1>
                <p class="error">Your payment could not be processed</p>
            </div>
            
            <div class="content">
                <h2>Hi ${customerInfo.fullName},</h2>
                <p>We were unable to process your payment for the following order. This could be due to insufficient funds, an expired card, or other payment issues.</p>
                
                <div class="order-details">
                    <h3>📋 Order Details</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Product:</strong> ${productInfo.title}</p>
                    <p><strong>Selected Options:</strong> ${productInfo.selectedVariants.join(
                      ", "
                    )}</p>
                    <p><strong>Quantity:</strong> ${productInfo.quantity}</p>
                    <p><strong>Attempted Amount:</strong> $${order.pricing.total.toFixed(
                      2
                    )}</p>
                </div>
                
                <div class="steps">
                    <h3>🔧 What to do next:</h3>
                    <ul>
                        <li>✅ Check your card details and try again</li>
                        <li>📞 Contact your bank to verify the transaction</li>
                        <li>💳 Try using a different payment method</li>
                        <li>🆘 Contact our support team if you need assistance</li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="${
                      process.env.FRONTEND_URL || "http://localhost:3000"
                    }" class="retry-btn">
                        🔄 Try Again
                    </a>
                </div>
                
                <p><strong>Good News:</strong> Your items are still available for purchase!</p>
                <p><strong>Need Help?</strong> Contact us at support@ecommerce.com or (555) 123-4567</p>
            </div>
            
            <div class="footer">
                <p>We're here to help! 🤝</p>
                <p><strong>E-Commerce Store</strong></p>
                <p style="font-size: 12px; color: #999;">
                    Payment declined for order ${order.orderNumber}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateErrorEmailTemplate(order) {
    const { customerInfo, productInfo } = order;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Error</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 0 20px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #FF9800, #F57C00); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px 20px; }
            .order-details { 
                background: #fff8f0; 
                padding: 20px; 
                margin: 20px 0; 
                border-left: 4px solid #FF9800; 
                border-radius: 5px; 
            }
            .order-details h3 { margin-top: 0; color: #FF9800; }
            .footer { 
                text-align: center; 
                padding: 20px; 
                background: #f8f8f8; 
                color: #666; 
            }
            .warning { color: #FF9800; font-weight: bold; font-size: 18px; }
            .retry-btn { 
                background: #4CAF50; 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 5px; 
                display: inline-block; 
                margin: 20px 0; 
                font-weight: bold;
            }
            .steps { background: #fff8f0; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚠️ Payment System Error</h1>
                <p class="warning">Temporary system error occurred</p>
            </div>
            
            <div class="content">
                <h2>Hi ${customerInfo.fullName},</h2>
                <p>We encountered a temporary error while processing your payment. This is not related to your payment method, but rather a technical issue on our end.</p>
                
                <div class="order-details">
                    <h3>📋 Order Details</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Product:</strong> ${productInfo.title}</p>
                    <p><strong>Selected Options:</strong> ${productInfo.selectedVariants.join(
                      ", "
                    )}</p>
                    <p><strong>Quantity:</strong> ${productInfo.quantity}</p>
                    <p><strong>Amount:</strong> $${order.pricing.total.toFixed(
                      2
                    )}</p>
                </div>
                
                <div class="steps">
                    <h3>🔧 What happens next:</h3>
                    <ul>
                        <li>🚨 Our technical team has been notified</li>
                        <li>⏱️ You can try placing the order again in a few minutes</li>
                        <li>💰 No charges have been made to your account</li>
                        <li>📞 Contact support if the issue persists</li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="${
                      process.env.FRONTEND_URL || "http://localhost:3000"
                    }" class="retry-btn">
                        🔄 Try Again
                    </a>
                </div>
                
                <p><strong>Important:</strong> Your items remain available for purchase!</p>
                <p><strong>Need Help?</strong> Contact us at support@ecommerce.com or (555) 123-4567</p>
            </div>
            
            <div class="footer">
                <p>We apologize for the inconvenience 🙏</p>
                <p><strong>E-Commerce Store</strong></p>
                <p style="font-size: 12px; color: #999;">
                    Technical error for order ${order.orderNumber}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();
