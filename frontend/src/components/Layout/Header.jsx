import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBagIcon, HomeIcon } from "@heroicons/react/24/outline";
import { selectTotal, selectQuantity } from "../../store/slices/cartSlice";

const Header = () => {
  const location = useLocation();
  const total = useSelector(selectTotal);
  const quantity = useSelector(selectQuantity);

  const isCheckoutPage = location.pathname === "/checkout";
  const isThankYouPage = location.pathname.startsWith("/thank-you");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBagIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                E-Commerce Store
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Info - Show on checkout page */}
            {isCheckoutPage && total > 0 && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  {quantity} {quantity === 1 ? "item" : "items"}
                </span>
                <span className="font-semibold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
            )}

            {/* Home Navigation */}
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {/* Back to Products - Show only on checkout page */}
            {isCheckoutPage && (
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                ← Back to Products
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Show only on mobile when needed */}
          <div className="md:hidden">
            {!isThankYouPage && (
              <Link
                to="/"
                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                <HomeIcon className="h-4 w-4" />
                <span className="text-xs">Home</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Info Bar - Show only when relevant */}
      {!isThankYouPage && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Mobile Cart Info - Show only on checkout */}
              {isCheckoutPage && total > 0 && (
                <>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">
                      {quantity} {quantity === 1 ? "item" : "items"}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${total.toFixed(2)}
                    </div>
                  </div>

                  <Link
                    to="/"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </Link>
                </>
              )}

              {/* Mobile Home Page - Show nothing extra */}
              {!isCheckoutPage && (
                <div className="w-full text-center">
                  <span className="text-xs text-gray-500">
                    Select a product to get started
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
