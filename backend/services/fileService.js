const fs = require("fs").promises;
const path = require("path");

class FileService {
  constructor() {
    this.productsPath = path.join(__dirname, "../data/products.json");
    this.ordersPath = path.join(__dirname, "../data/orders.json");

    // In-memory storage for Vercel (since file system is not persistent)
    this.memoryOrders = [];

    // Add some demo orders for recruiters to see
    this.initializeDemoOrders();

    this.initializeFiles();
  }

  initializeDemoOrders() {
    // Add some sample orders so recruiters can see the system working
    this.memoryOrders = [
      {
        orderNumber: "ORD-20250530-DEMO1",
        customerInfo: {
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "1234567890",
          address: "123 Demo Street",
          city: "Demo City",
          state: "CA",
          zipCode: "12345",
        },
        productInfo: {
          id: 1,
          title: "Premium Wireless Headphones",
          price: 199.99,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
          selectedVariants: ["Black", "Regular"],
          quantity: 1,
        },
        paymentInfo: {
          cardNumber: "****1234",
          expiryDate: "12/26",
        },
        pricing: {
          subtotal: 199.99,
          tax: 16.0,
          total: 215.99,
        },
        transaction: {
          status: "approved",
          message: "Transaction approved successfully",
          transactionId: "TXN-DEMO-001",
        },
        status: "approved",
        createdAt: "2025-01-30T10:00:00.000Z",
        updatedAt: "2025-01-30T10:00:00.000Z",
      },
      {
        orderNumber: "ORD-20250530-DEMO2",
        customerInfo: {
          fullName: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "0987654321",
          address: "456 Sample Ave",
          city: "Test City",
          state: "NY",
          zipCode: "54321",
        },
        productInfo: {
          id: 2,
          title: "Smart Fitness Watch",
          price: 299.99,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
          selectedVariants: ["Silver", "Sport"],
          quantity: 1,
        },
        paymentInfo: {
          cardNumber: "****5678",
          expiryDate: "11/27",
        },
        pricing: {
          subtotal: 299.99,
          tax: 24.0,
          total: 323.99,
        },
        transaction: {
          status: "declined",
          message: "Transaction declined",
          transactionId: null,
        },
        status: "declined",
        createdAt: "2025-01-30T09:30:00.000Z",
        updatedAt: "2025-01-30T09:30:00.000Z",
      },
    ];
  }

  async initializeFiles() {
    try {
      // Ensure data directory exists
      const dataDir = path.join(__dirname, "../data");
      await fs.mkdir(dataDir, { recursive: true });

      // Check if orders.json exists, create if not
      try {
        await fs.access(this.ordersPath);
      } catch (error) {
        console.log("📁 Creating orders.json file...");
        await fs.writeFile(this.ordersPath, JSON.stringify([], null, 2));
        console.log("✅ orders.json created successfully");
      }

      console.log("✅ File service initialized");
    } catch (error) {
      console.error("❌ Error initializing files:", error);
    }
  }

  async readProducts() {
    try {
      const data = await fs.readFile(this.productsPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("❌ Error reading products:", error);

      // Return fallback products if file doesn't exist
      return [
        {
          id: 1,
          title: "Premium Wireless Headphones",
          description:
            "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding.",
          price: 199.99,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
          variants: [
            {
              type: "color",
              label: "Color",
              options: ["Black", "White", "Blue"],
            },
            { type: "size", label: "Size", options: ["Regular", "Large"] },
          ],
          inventory: {
            "Black-Regular": 15,
            "Black-Large": 8,
            "White-Regular": 12,
            "White-Large": 5,
            "Blue-Regular": 10,
            "Blue-Large": 3,
          },
        },
        {
          id: 2,
          title: "Smart Fitness Watch",
          description:
            "Track your fitness journey with our advanced smartwatch. Features heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life.",
          price: 299.99,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
          variants: [
            {
              type: "color",
              label: "Color",
              options: ["Black", "Silver", "Rose Gold"],
            },
            {
              type: "band",
              label: "Band Type",
              options: ["Sport", "Leather", "Metal"],
            },
          ],
          inventory: {
            "Black-Sport": 20,
            "Black-Leather": 10,
            "Black-Metal": 8,
            "Silver-Sport": 15,
            "Silver-Leather": 7,
            "Silver-Metal": 12,
            "Rose Gold-Sport": 18,
            "Rose Gold-Leather": 6,
            "Rose Gold-Metal": 4,
          },
        },
      ];
    }
  }

  async readOrders() {
    try {
      // For Vercel deployment, use in-memory storage + any file-based orders
      const fileOrders = [];

      try {
        const data = await fs.readFile(this.ordersPath, "utf8");
        fileOrders.push(...JSON.parse(data));
      } catch (error) {
        // File doesn't exist or can't be read, that's okay
      }

      // Combine demo orders with any new orders
      const allOrders = [...this.memoryOrders, ...fileOrders];
      console.log(
        `📋 Read ${allOrders.length} orders (${this.memoryOrders.length} demo + ${fileOrders.length} new)`
      );

      return allOrders;
    } catch (error) {
      console.error("❌ Error reading orders:", error);
      console.log("🔄 Returning demo orders only");
      return this.memoryOrders;
    }
  }

  async writeOrders(orders) {
    try {
      // Update memory storage
      const newOrders = orders.filter(
        (order) =>
          !this.memoryOrders.find(
            (demo) => demo.orderNumber === order.orderNumber
          )
      );

      // Try to write to file (may not persist on Vercel)
      await fs.writeFile(this.ordersPath, JSON.stringify(newOrders, null, 2));
      console.log(
        `💾 Saved ${orders.length} orders (${newOrders.length} new orders)`
      );
      return true;
    } catch (error) {
      console.error("❌ Error writing orders:", error);
      console.log(
        "💡 Note: Orders may not persist between deployments on Vercel"
      );
      return true; // Don't fail the operation
    }
  }

  async addOrder(order) {
    try {
      console.log(`📝 Adding order ${order.orderNumber} to storage...`);

      // Add to memory immediately
      this.memoryOrders.push(order);

      // Try to save to file as well
      const currentOrders = await this.readOrders();
      const updatedOrders = [...currentOrders];

      // Don't duplicate if already exists
      if (!updatedOrders.find((o) => o.orderNumber === order.orderNumber)) {
        updatedOrders.push(order);
      }

      await this.writeOrders(updatedOrders);
      console.log(`✅ Order ${order.orderNumber} saved successfully`);
      return order;
    } catch (error) {
      console.error(`❌ Error adding order ${order.orderNumber}:`, error);
      throw new Error("Failed to save order");
    }
  }

  async findOrderByNumber(orderNumber) {
    try {
      console.log(`🔍 Searching for order: ${orderNumber}`);
      const orders = await this.readOrders();
      const order = orders.find((order) => order.orderNumber === orderNumber);

      if (order) {
        console.log(`✅ Found order: ${orderNumber}`);
      } else {
        console.log(`❌ Order not found: ${orderNumber}`);
      }

      return order;
    } catch (error) {
      console.error(`❌ Error finding order ${orderNumber}:`, error);
      return null;
    }
  }
}

module.exports = new FileService();
