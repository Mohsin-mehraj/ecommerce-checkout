import React, { useState, useEffect } from "react";
import { ExclamationTriangleIcon, HomeIcon } from "@heroicons/react/24/outline";

const ErrorFallback = ({ error, resetError }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please refresh the page or return
          to the homepage.
        </p>

        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Go Home
          </button>
        </div>

        {import.meta.env.DEV && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);

      // Log error to console in development
      if (import.meta.env.DEV) {
        console.error("Error caught by boundary:", error);
      }
    };

    const handleUnhandledRejection = (event) => {
      handleError(event.reason);
    };

    const handleErrorEvent = (event) => {
      handleError(event.error);
    };

    // Add global error listeners
    window.addEventListener("error", handleErrorEvent);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleErrorEvent);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError) {
    return <ErrorFallback error={error} resetError={resetError} />;
  }

  return children;
};

export default ErrorBoundary;
