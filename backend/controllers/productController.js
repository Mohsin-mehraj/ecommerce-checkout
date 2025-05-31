// const fileService = require("../services/fileService");

// // In-memory storage for runtime inventory changes
// let runtimeInventory = {};

// class ProductController {
//   // Get all products
//   async getAllProducts(req, res, next) {
//     try {
//       const products = await fileService.readProducts();

//       // Apply runtime inventory changes
//       const updatedProducts = products.map((product) => ({
//         ...product,
//         inventory: {
//           ...product.inventory,
//           ...(runtimeInventory[product.id] || {}),
//         },
//       }));

//       res.json({
//         success: true,
//         data: updatedProducts,
//         count: updatedProducts.length,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // Get single product by ID
//   async getProductById(req, res, next) {
//     try {
//       const productId = parseInt(req.params.id);
//       const products = await fileService.readProducts();

//       const product = products.find((p) => p.id === productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       // Apply runtime inventory changes
//       const updatedProduct = {
//         ...product,
//         inventory: {
//           ...product.inventory,
//           ...(runtimeInventory[product.id] || {}),
//         },
//       };

//       res.json({
//         success: true,
//         data: updatedProduct,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // Check product stock availability
//   async checkStock(req, res, next) {
//     try {
//       const productId = parseInt(req.params.id);
//       const { selectedVariants, quantity } = req.body;

//       const products = await fileService.readProducts();
//       const product = products.find((p) => p.id === productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       // Create variant key
//       const variantKey = selectedVariants.join("-");

//       // Get current inventory (including runtime changes)
//       const currentInventory = {
//         ...product.inventory,
//         ...(runtimeInventory[productId] || {}),
//       };

//       const availableStock = currentInventory[variantKey] || 0;

//       if (availableStock < quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock. Only ${availableStock} items available.`,
//           availableStock,
//         });
//       }

//       res.json({
//         success: true,
//         message: "Stock available",
//         availableStock,
//         requestedQuantity: quantity,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // Update inventory (decrease stock after successful purchase)
//   async updateInventory(productId, selectedVariants, quantity) {
//     try {
//       const products = await fileService.readProducts();
//       const product = products.find((p) => p.id === productId);

//       if (!product) {
//         throw new Error("Product not found");
//       }

//       const variantKey = selectedVariants.join("-");

//       // Initialize runtime inventory for this product if not exists
//       if (!runtimeInventory[productId]) {
//         runtimeInventory[productId] = {};
//       }

//       // Get current stock (original + runtime changes)
//       const originalStock = product.inventory[variantKey] || 0;
//       const runtimeChange = runtimeInventory[productId][variantKey] || 0;
//       const currentStock = originalStock + runtimeChange;

//       if (currentStock < quantity) {
//         throw new Error("Insufficient stock");
//       }

//       // Update runtime inventory (negative value to decrease stock)
//       runtimeInventory[productId][variantKey] = runtimeChange - quantity;

//       console.log(
//         `Updated inventory for product ${productId}, variant ${variantKey}: ${
//           currentStock - quantity
//         } remaining`
//       );

//       return true;
//     } catch (error) {
//       console.error("Error updating inventory:", error);
//       throw error;
//     }
//   }

//   // Get current inventory status
//   async getInventoryStatus(req, res, next) {
//     try {
//       const products = await fileService.readProducts();

//       const inventoryStatus = products.map((product) => ({
//         id: product.id,
//         title: product.title,
//         originalInventory: product.inventory,
//         runtimeChanges: runtimeInventory[product.id] || {},
//         currentInventory: Object.keys(product.inventory).reduce((acc, key) => {
//           const original = product.inventory[key];
//           const change = runtimeInventory[product.id]?.[key] || 0;
//           acc[key] = original + change;
//           return acc;
//         }, {}),
//       }));

//       res.json({
//         success: true,
//         data: inventoryStatus,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   // Reset inventory to original state (useful for testing)
//   async resetInventory(req, res, next) {
//     try {
//       runtimeInventory = {};

//       res.json({
//         success: true,
//         message: "Inventory reset to original state",
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// module.exports = new ProductController();

const fileService = require("../services/fileService");

// Module-level inventory changes (not class property)
let demoInventoryChanges = {
  1: {
    "Black-Regular": -2,
    "White-Regular": -1,
  },
  2: {
    "Silver-Sport": -1,
  },
};

class ProductController {
  // Get all products
  async getAllProducts(req, res, next) {
    try {
      const products = await fileService.readProducts();

      const updatedProducts = products.map((product) => {
        const changes = demoInventoryChanges[product.id] || {};
        const updatedInventory = { ...product.inventory };

        Object.keys(changes).forEach((variantKey) => {
          if (updatedInventory[variantKey] !== undefined) {
            updatedInventory[variantKey] = Math.max(
              0,
              updatedInventory[variantKey] + changes[variantKey]
            );
          }
        });

        return {
          ...product,
          inventory: updatedInventory,
        };
      });

      res.json({
        success: true,
        data: updatedProducts,
        count: updatedProducts.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single product by ID
  async getProductById(req, res, next) {
    try {
      const productId = parseInt(req.params.id);
      const products = await fileService.readProducts();

      const product = products.find((p) => p.id === productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const changes = demoInventoryChanges[productId] || {};
      const updatedInventory = { ...product.inventory };

      Object.keys(changes).forEach((variantKey) => {
        if (updatedInventory[variantKey] !== undefined) {
          updatedInventory[variantKey] = Math.max(
            0,
            updatedInventory[variantKey] + changes[variantKey]
          );
        }
      });

      const updatedProduct = {
        ...product,
        inventory: updatedInventory,
      };

      res.json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  // Check product stock availability
  async checkStock(req, res, next) {
    try {
      const productId = parseInt(req.params.id);
      const { selectedVariants, quantity } = req.body;

      const products = await fileService.readProducts();
      const product = products.find((p) => p.id === productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const variantKey = selectedVariants.join("-");
      const changes = demoInventoryChanges[productId] || {};
      const currentInventory = { ...product.inventory };

      Object.keys(changes).forEach((key) => {
        if (currentInventory[key] !== undefined) {
          currentInventory[key] = Math.max(
            0,
            currentInventory[key] + changes[key]
          );
        }
      });

      const availableStock = currentInventory[variantKey] || 0;

      if (availableStock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${availableStock} items available.`,
          availableStock,
        });
      }

      res.json({
        success: true,
        message: "Stock available",
        availableStock,
        requestedQuantity: quantity,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update inventory
  async updateInventory(productId, selectedVariants, quantity) {
    try {
      const products = await fileService.readProducts();
      const product = products.find((p) => p.id === productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const variantKey = selectedVariants.join("-");
      const changes = demoInventoryChanges[productId] || {};
      const originalStock = product.inventory[variantKey] || 0;
      const currentChange = changes[variantKey] || 0;
      const currentStock = originalStock + currentChange;

      if (currentStock < quantity) {
        throw new Error("Insufficient stock");
      }

      if (!demoInventoryChanges[productId]) {
        demoInventoryChanges[productId] = {};
      }

      demoInventoryChanges[productId][variantKey] = currentChange - quantity;

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get current inventory status
  async getInventoryStatus(req, res, next) {
    try {
      const products = await fileService.readProducts();

      const inventoryStatus = products.map((product) => {
        const changes = demoInventoryChanges[product.id] || {};
        const currentInventory = { ...product.inventory };

        Object.keys(changes).forEach((variantKey) => {
          if (currentInventory[variantKey] !== undefined) {
            currentInventory[variantKey] = Math.max(
              0,
              currentInventory[variantKey] + changes[variantKey]
            );
          }
        });

        return {
          id: product.id,
          title: product.title,
          originalInventory: product.inventory,
          currentInventory: currentInventory,
        };
      });

      res.json({
        success: true,
        data: inventoryStatus,
      });
    } catch (error) {
      next(error);
    }
  }

  // Reset inventory to original state
  async resetInventory(req, res, next) {
    try {
      demoInventoryChanges = {
        1: {
          "Black-Regular": -2,
          "White-Regular": -1,
        },
        2: {
          "Silver-Sport": -1,
        },
      };

      res.json({
        success: true,
        message: "Inventory reset to original state",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
