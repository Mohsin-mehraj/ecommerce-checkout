import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const VariantSelector = ({ variant, selectedValue, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {variant.label}
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative">
        <select
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white ${
            selectedValue
              ? "border-gray-300 text-gray-900"
              : "border-red-300 text-gray-400"
          }`}
        >
          <option value="">Select {variant.label.toLowerCase()}...</option>
          {variant.options.map((option) => (
            <option key={option} value={option} className="text-gray-900">
              {option}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Validation message */}
      {!selectedValue && (
        <p className="text-xs text-red-600">
          Please select a {variant.label.toLowerCase()}
        </p>
      )}
    </div>
  );
};

export default VariantSelector;
