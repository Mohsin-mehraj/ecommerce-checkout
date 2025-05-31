import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Redux
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../store/slices/productSlice";
import {
  setSelectedProduct,
  setSelectedVariants,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  selectCartSummary,
  selectIsValidSelection,
} from "../store/slices/cartSlice";

// Components
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import ProductCard from "../components/Product/ProductCard";
import VariantSelector from "../components/Product/VariantSelector";
import QuantitySelector from "../components/Product/QuantitySelector";
import OrderSummary from "../components/Cart/OrderSummary";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const cartSummary = useSelector(selectCartSummary);
  const isValidSelection = useSelector(selectIsValidSelection);

  // Local state
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Load products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Set first product as selected when products load
  useEffect(() => {
    if (products.length > 0 && !cartSummary.product) {
      handleProductSelect(products[0], 0);
    }
  }, [products, cartSummary.product]);

  // Handle product selection
  const handleProductSelect = (product, index) => {
    setSelectedProductIndex(index);
    dispatch(setSelectedProduct(product));
    dispatch(setQuantity(1));
    setShowOrderSummary(false);
  };

  // Handle variant selection
  const handleVariantChange = (variantType, value) => {
    const product = cartSummary.product;
    if (!product) return;

    // Get current variants
    const currentVariants = [...cartSummary.variants];

    // Find the index of this variant type
    const variantTypeIndex = product.variants.findIndex(
      (v) => v.type === variantType
    );

    if (variantTypeIndex !== -1) {
      currentVariants[variantTypeIndex] = value;
      dispatch(setSelectedVariants(currentVariants));
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (newQuantity) => {
    dispatch(setQuantity(newQuantity));
  };

  const handleIncrement = () => {
    dispatch(incrementQuantity());
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity());
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!isValidSelection) {
      toast.error("Please select all product options");
      return;
    }

    if (cartSummary.quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    // Show order summary first
    setShowOrderSummary(true);

    // Scroll to order summary
    setTimeout(() => {
      const summaryElement = document.getElementById("order-summary");
      if (summaryElement) {
        summaryElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    toast.success("Proceeding to checkout...");
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchProducts())}
        />
      </div>
    );
  }

  const currentProduct = cartSummary.product;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Premium Products
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Discover quality items with exceptional craftsmanship
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Choose Your Product
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProductIndex === index}
                onClick={() => handleProductSelect(product, index)}
              />
            ))}
          </div>
        </div>

        {/* Product Details and Configuration */}
        {currentProduct && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image and Info */}
              <div className="space-y-6">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.title}
                    className="w-full h-96 object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentProduct.title}
                  </h3>
                  <p className="text-3xl font-bold text-primary-600 mb-4">
                    ${currentProduct.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>
              </div>

              {/* Configuration Panel */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Customize Your Order
                  </h4>

                  {/* Variant Selectors */}
                  {currentProduct.variants?.map((variant, index) => (
                    <div key={variant.type} className="mb-4">
                      <VariantSelector
                        variant={variant}
                        selectedValue={cartSummary.variants[index] || ""}
                        onChange={(value) =>
                          handleVariantChange(variant.type, value)
                        }
                      />
                    </div>
                  ))}

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <QuantitySelector
                      quantity={cartSummary.quantity}
                      onQuantityChange={handleQuantityChange}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      max={10}
                    />
                  </div>

                  {/* Price Display */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold">
                        ${cartSummary.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                      <span>Tax (8%):</span>
                      <span>${cartSummary.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">
                          ${cartSummary.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    disabled={!isValidSelection}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                      isValidSelection
                        ? "bg-primary-600 hover:bg-primary-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {!isValidSelection ? "Select All Options" : "Buy Now"}
                  </button>

                  {!isValidSelection && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      Please select all product options to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        {showOrderSummary && isValidSelection && (
          <div id="order-summary" className="mt-12">
            <OrderSummary
              cartSummary={cartSummary}
              onProceedToCheckout={handleProceedToCheckout}
              showCheckoutButton={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
