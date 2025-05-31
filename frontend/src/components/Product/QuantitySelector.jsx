import React from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  onIncrement,
  onDecrement,
  min = 1,
  max = 10,
}) => {
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Quantity
      </label>

      <div className="flex items-center space-x-3">
        {/* Decrease Button */}
        <button
          onClick={onDecrement}
          disabled={quantity <= min}
          className={`p-2 rounded-md border transition-colors ${
            quantity <= min
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          <MinusIcon className="h-4 w-4" />
        </button>

        {/* Quantity Input */}
        <div className="flex-1 max-w-20">
          <input
            type="number"
            min={min}
            max={max}
            value={quantity}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Increase Button */}
        <button
          onClick={onIncrement}
          disabled={quantity >= max}
          className={`p-2 rounded-md border transition-colors ${
            quantity >= max
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Min: {min}, Max: {max}
      </p>
    </div>
  );
};

export default QuantitySelector;
