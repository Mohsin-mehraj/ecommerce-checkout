import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store";

// Pages
import LandingPage from "./pages/LandingPage.jsx";
import CheckoutPage from "./pages/CheckOutPage.jsx";
import ThankYouPage from "./pages/ThankyouPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Components
import Layout from "./components/Layout/Layout";
import ErrorBoundary from "./components/UI/ErrorBoundary";

// Styles
import "./index.css";

function App() {
  useEffect(() => {
    // Set page title
    document.title = "E-Commerce Store";

    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Premium products with fast delivery"
      );
    }
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Layout>
              <Routes>
                {/* Landing Page - Product Display */}
                <Route path="/" element={<LandingPage />} />

                {/* Checkout Page - Order Form */}
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Thank You Page - Order Confirmation */}
                <Route
                  path="/thank-you/:orderNumber"
                  element={<ThankYouPage />}
                />

                {/* Redirect /thank-you without order number */}
                <Route
                  path="/thank-you"
                  element={<Navigate to="/" replace />}
                />

                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Define default options
                className: "",
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                // Default options for specific types
                success: {
                  duration: 3000,
                  theme: {
                    primary: "green",
                    secondary: "black",
                  },
                },
                error: {
                  duration: 5000,
                  theme: {
                    primary: "red",
                    secondary: "black",
                  },
                },
              }}
            />
          </div>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
