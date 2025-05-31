import React from "react";
import { ArrowRightIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const OrderSummary = ({
  cartSummary,
  onProceedToCheckout,
  showCheckoutButton = false,
}) => {
  const { product, variants, quantity, subtotal, tax, total } = cartSummary;

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No items in cart</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
        <h3 className="text-lg font-semibold text-primary-900 flex items-center">
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Order Summary
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Product Details */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0">
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 truncate">
              {product.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              ${product.price.toFixed(2)} each
            </p>

            {/* Selected Variants */}
            {variants.length > 0 && (
              <div className="mt-2 space-y-1">
                {product.variants?.map((variantType, index) => (
                  <div key={variantType.type} className="text-sm">
                    <span className="text-gray-600">{variantType.label}:</span>
                    <span className="ml-1 font-medium text-gray-900">
                      {variants[index] || "Not selected"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 text-sm">
              <span className="text-gray-600">Quantity:</span>
              <span className="ml-1 font-medium text-gray-900">{quantity}</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="text-gray-600">Tax (8%):</span>
            <span className="text-gray-900">${tax.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total:</span>
              <span className="text-primary-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && (
          <div className="mt-6">
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure checkout • Your information is protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
