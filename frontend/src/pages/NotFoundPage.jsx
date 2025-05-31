import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary-600 mb-2">404</div>
          <ShoppingBagIcon className="h-20 w-20 text-gray-400 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved,
          deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>

          <p className="text-sm text-gray-500">or try refreshing the page</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
