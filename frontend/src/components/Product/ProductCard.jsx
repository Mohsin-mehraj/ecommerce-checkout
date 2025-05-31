import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

const ProductCard = ({ product, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-primary-500 shadow-lg transform scale-105"
          : "hover:shadow-md hover:transform hover:scale-102"
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-primary-500 rounded-full p-1">
            <CheckIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-w-1 aspect-h-1 bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover object-center"
        />
      </div>

      {/* Product Info */}
      <div className="bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-lg font-bold text-primary-600">
          ${product.price.toFixed(2)}
        </p>

        {/* Variant Count */}
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <span>
            {product.variants?.length > 0
              ? `${product.variants.length} options available`
              : "Standard version"}
          </span>
        </div>

        {/* Selection Indicator Text */}
        <div
          className={`mt-2 text-xs font-medium ${
            isSelected ? "text-primary-600" : "text-gray-400"
          }`}
        >
          {isSelected ? "✓ Selected" : "Click to select"}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
