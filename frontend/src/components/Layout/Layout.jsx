import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Different layouts for different pages
  const isCheckoutPage = currentPath === "/checkout";
  const isThankYouPage = currentPath.startsWith("/thank-you");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer - Hide on checkout and thank you pages for cleaner UX */}
      {!isCheckoutPage && !isThankYouPage && <Footer />}
    </div>
  );
};

export default Layout;
