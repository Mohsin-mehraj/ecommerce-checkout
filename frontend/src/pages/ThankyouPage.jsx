// import React, { useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import {
//   CheckCircleIcon,
//   XCircleIcon,
//   ExclamationTriangleIcon,
//   DocumentDuplicateIcon,
//   ShoppingBagIcon,
//   HomeIcon,
//   PrinterIcon,
//   EnvelopeIcon,
//   PhoneIcon,
// } from "@heroicons/react/24/solid";

// // Redux
// import {
//   fetchOrderByNumber,
//   selectCurrentOrder,
//   selectOrderLoading,
//   selectOrderError,
//   clearCustomerSession,
//   clearCurrentOrder,
//   clearError,
//   clearValidationErrors,
// } from "../store/slices/orderSlice";
// import {
//   startNewSession,
//   forceReset,
//   clearCartAfterOrder,
// } from "../store/slices/cartSlice";

// // Components
// import LoadingSpinner from "../components/UI/LoadingSpinner";
// import ErrorMessage from "../components/UI/ErrorMessage";

// const ThankYouPage = () => {
//   const { orderNumber } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux state
//   const order = useSelector(selectCurrentOrder);
//   const loading = useSelector(selectOrderLoading);
//   const error = useSelector(selectOrderError);

//   // Load order data
//   useEffect(() => {
//     if (orderNumber) {
//       console.log(`📋 Loading order details for: ${orderNumber}`);
//       dispatch(fetchOrderByNumber(orderNumber));
//     }
//   }, [orderNumber, dispatch]);

//   // Redirect if no order number
//   useEffect(() => {
//     if (!orderNumber) {
//       console.log("❌ No order number found, redirecting to home");
//       navigate("/");
//     }
//   }, [orderNumber, navigate]);

//   // Handle continue shopping - completely fresh start
//   const handleContinueShopping = () => {
//     console.log("🛒 Continue shopping clicked - starting complete cleanup");

//     // Step 1: Clear all Redux state
//     dispatch(clearCustomerSession());
//     dispatch(clearCurrentOrder());
//     dispatch(clearError());
//     dispatch(clearValidationErrors());

//     // Step 2: Force reset cart to completely fresh state
//     dispatch(forceReset());
//     dispatch(startNewSession());

//     // Step 3: Clear cart after order (backup)
//     dispatch(clearCartAfterOrder());

//     console.log("✅ All state cleared - starting fresh session");

//     toast.success("Starting fresh shopping session!", {
//       icon: "🛒",
//       duration: 2000,
//     });

//     // Step 4: Navigate to home
//     navigate("/");

//     // Step 5: Optional - force page refresh for absolute clean state
//     setTimeout(() => {
//       console.log("🔄 Force refreshing page for complete cleanup");
//       window.location.href = "/"; // Force complete page refresh
//     }, 1500);
//   };

//   // Copy order number to clipboard
//   const copyOrderNumber = async () => {
//     try {
//       await navigator.clipboard.writeText(orderNumber);
//       toast.success("Order number copied to clipboard!");
//     } catch (err) {
//       console.error("Failed to copy order number:", err);
//       toast.error("Failed to copy order number");
//     }
//   };

//   // Print order details
//   const printOrder = () => {
//     window.print();
//   };

//   // Get status icon and colors
//   const getStatusDisplay = (status) => {
//     switch (status) {
//       case "approved":
//         return {
//           icon: CheckCircleIcon,
//           iconColor: "text-green-500",
//           bgColor: "bg-green-50",
//           borderColor: "border-green-200",
//           title: "Order Confirmed!",
//           message:
//             "Your payment was successful and your order is being processed.",
//           emailMessage:
//             "📧 A confirmation email has been sent to your email address.",
//           nextSteps: [
//             "✅ Payment processed successfully",
//             "📦 Inventory has been updated",
//             "📧 Confirmation email sent",
//             "🚚 We'll prepare your order for shipping",
//             "📱 You'll receive tracking information via email",
//             "⏱️ Estimated delivery: 3-5 business days",
//           ],
//         };
//       case "declined":
//         return {
//           icon: XCircleIcon,
//           iconColor: "text-red-500",
//           bgColor: "bg-red-50",
//           borderColor: "border-red-200",
//           title: "Payment Declined",
//           message:
//             "Your payment could not be processed. Please try again with a different payment method.",
//           emailMessage:
//             "📧 An email with retry instructions has been sent to you.",
//           nextSteps: [
//             "❌ Payment was declined by your bank",
//             "🔄 No inventory changes were made",
//             "📧 Decline notification email sent",
//             "💳 Check your card details and try again",
//             "📞 Contact your bank to verify the transaction",
//             "🔧 Try using a different payment method",
//           ],
//         };
//       case "error":
//         return {
//           icon: ExclamationTriangleIcon,
//           iconColor: "text-orange-500",
//           bgColor: "bg-orange-50",
//           borderColor: "border-orange-200",
//           title: "Payment Error",
//           message:
//             "We encountered a technical error while processing your payment. Please try again later.",
//           emailMessage:
//             "📧 We've sent you an email with more information about this error.",
//           nextSteps: [
//             "⚠️ Technical error occurred during processing",
//             "🔄 No inventory changes were made",
//             "📧 Error notification email sent",
//             "🔧 Our technical team has been notified",
//             "⏱️ You can try placing the order again in a few minutes",
//             "💰 No charges have been made to your account",
//           ],
//         };
//       default:
//         return {
//           icon: ExclamationTriangleIcon,
//           iconColor: "text-gray-500",
//           bgColor: "bg-gray-50",
//           borderColor: "border-gray-200",
//           title: "Order Status Unknown",
//           message: "We're checking the status of your order.",
//           emailMessage: "",
//           nextSteps: [],
//         };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <LoadingSpinner size="large" />
//           <p className="mt-4 text-gray-600">Loading your order details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-md w-full">
//           <ErrorMessage
//             message="Unable to load order details"
//             onRetry={() => dispatch(fetchOrderByNumber(orderNumber))}
//           />
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleContinueShopping}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
//             >
//               <HomeIcon className="h-4 w-4 mr-2" />
//               Return Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-gray-600">Order not found</p>
//           <button
//             onClick={handleContinueShopping}
//             className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
//           >
//             <HomeIcon className="h-4 w-4 mr-2" />
//             Return Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const statusDisplay = getStatusDisplay(order.status);
//   const StatusIcon = statusDisplay.icon;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Status Header */}
//         <div
//           className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border rounded-lg p-8 mb-8 text-center animate-fade-in`}
//         >
//           <StatusIcon
//             className={`h-16 w-16 ${statusDisplay.iconColor} mx-auto mb-4`}
//           />
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {statusDisplay.title}
//           </h1>
//           <p className="text-lg text-gray-700 mb-4">{statusDisplay.message}</p>
//           {statusDisplay.emailMessage && (
//             <p className="text-sm text-gray-600">
//               {statusDisplay.emailMessage}
//             </p>
//           )}
//         </div>

//         {/* Session Status Notice */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <ShoppingBagIcon className="h-5 w-5 text-blue-400" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-blue-700">
//                 <strong>Order Complete!</strong> Click "Continue Shopping" below
//                 to start a fresh session with empty forms for your next order.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Order Details */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Order Information */}
//           <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//               <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-primary-600" />
//               Order Information
//             </h2>

//             <div className="space-y-4">
//               {/* Order Number */}
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
//                 <div>
//                   <span className="text-sm text-gray-600">Order Number</span>
//                   <p className="font-mono text-lg font-semibold text-gray-900">
//                     {order.orderNumber}
//                   </p>
//                 </div>
//                 <button
//                   onClick={copyOrderNumber}
//                   className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                   title="Copy order number"
//                 >
//                   <DocumentDuplicateIcon className="h-5 w-5" />
//                 </button>
//               </div>

//               {/* Order Date */}
//               <div>
//                 <span className="text-sm text-gray-600">Order Date</span>
//                 <p className="font-medium text-gray-900">
//                   {new Date(order.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>

//               {/* Transaction ID */}
//               {order.transaction?.transactionId && (
//                 <div>
//                   <span className="text-sm text-gray-600">Transaction ID</span>
//                   <p className="font-mono text-sm text-gray-900">
//                     {order.transaction.transactionId}
//                   </p>
//                 </div>
//               )}

//               {/* Status */}
//               <div>
//                 <span className="text-sm text-gray-600">Status</span>
//                 <p
//                   className={`font-medium capitalize ${
//                     order.status === "approved"
//                       ? "text-green-600"
//                       : order.status === "declined"
//                       ? "text-red-600"
//                       : "text-orange-600"
//                   }`}
//                 >
//                   {order.status}
//                 </p>
//               </div>

//               {/* Inventory Impact */}
//               <div className="p-3 bg-blue-50 rounded-md">
//                 <span className="text-sm text-blue-800 font-medium">
//                   Inventory Impact
//                 </span>
//                 <p
//                   className={`text-sm ${
//                     order.status === "approved"
//                       ? "text-green-700"
//                       : "text-blue-700"
//                   }`}
//                 >
//                   {order.status === "approved"
//                     ? "✅ Stock levels updated - items reserved for your order"
//                     : "🔄 No inventory changes - items remain available for purchase"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//               <ShoppingBagIcon className="h-5 w-5 mr-2 text-primary-600" />
//               Product Details
//             </h2>

//             <div className="flex items-start space-x-4">
//               <img
//                 src={order.productInfo.image}
//                 alt={order.productInfo.title}
//                 className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
//               />

//               <div className="flex-1 min-w-0">
//                 <h3 className="font-semibold text-gray-900 mb-2">
//                   {order.productInfo.title}
//                 </h3>

//                 <div className="space-y-1 text-sm text-gray-600">
//                   <p>
//                     <span className="font-medium">Price:</span> $
//                     {order.productInfo.price.toFixed(2)}
//                   </p>
//                   <p>
//                     <span className="font-medium">Quantity:</span>{" "}
//                     {order.productInfo.quantity}
//                   </p>

//                   {order.productInfo.selectedVariants?.length > 0 && (
//                     <div>
//                       <span className="font-medium">Selected Options:</span>
//                       <span className="ml-1">
//                         {order.productInfo.selectedVariants.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Customer Information */}
//           <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">
//               Customer Information
//             </h2>

//             <div className="space-y-3">
//               <div>
//                 <span className="text-sm text-gray-600">Name</span>
//                 <p className="font-medium text-gray-900">
//                   {order.customerInfo.fullName}
//                 </p>
//               </div>

//               <div>
//                 <span className="text-sm text-gray-600">Email</span>
//                 <p className="text-gray-900">{order.customerInfo.email}</p>
//               </div>

//               <div>
//                 <span className="text-sm text-gray-600">Phone</span>
//                 <p className="text-gray-900">{order.customerInfo.phone}</p>
//               </div>

//               <div>
//                 <span className="text-sm text-gray-600">Shipping Address</span>
//                 <div className="text-gray-900">
//                   <p>{order.customerInfo.address}</p>
//                   <p>
//                     {order.customerInfo.city}, {order.customerInfo.state}{" "}
//                     {order.customerInfo.zipCode}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">
//               Order Summary
//             </h2>

//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="text-gray-900">
//                   ${order.pricing.subtotal.toFixed(2)}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax (8%)</span>
//                 <span className="text-gray-900">
//                   ${order.pricing.tax.toFixed(2)}
//                 </span>
//               </div>

//               <div className="border-t border-gray-200 pt-3">
//                 <div className="flex justify-between">
//                   <span className="text-lg font-semibold text-gray-900">
//                     Total
//                   </span>
//                   <span className="text-lg font-bold text-primary-600">
//                     ${order.pricing.total.toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               {/* Payment Method */}
//               {order.paymentInfo?.cardNumber && (
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <span className="text-sm text-gray-600">Payment Method</span>
//                   <p className="text-gray-900 font-mono">
//                     Card ending in {order.paymentInfo.cardNumber.slice(-4)}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Next Steps */}
//         {statusDisplay.nextSteps.length > 0 && (
//           <div className="mt-8 bg-white rounded-lg shadow-sm p-6 animate-slide-up">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               What happened with your order?
//             </h2>
//             <ul className="space-y-2">
//               {statusDisplay.nextSteps.map((step, index) => (
//                 <li key={index} className="flex items-start">
//                   <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                     {index + 1}
//                   </span>
//                   <span className="text-gray-700">{step}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
//           <button
//             onClick={handleContinueShopping}
//             className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
//           >
//             <ShoppingBagIcon className="h-5 w-5 mr-2" />
//             Continue Shopping (Fresh Start)
//           </button>

//           {order.status === "declined" && (
//             <Link
//               to="/checkout"
//               className="inline-flex items-center justify-center px-6 py-3 border border-primary-300 text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors"
//             >
//               Try Payment Again
//             </Link>
//           )}

//           <button
//             onClick={printOrder}
//             className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors no-print"
//           >
//             <PrinterIcon className="h-5 w-5 mr-2" />
//             Print Order
//           </button>
//         </div>

//         {/* Help Section */}
//         <div className="mt-12 bg-white rounded-lg shadow-sm p-6 text-center no-print">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Need Help?
//           </h3>
//           <p className="text-gray-600 mb-4">
//             If you have any questions about your order, please don't hesitate to
//             contact us.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a
//               href="mailto:support@ecommerce.com"
//               className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
//             >
//               <EnvelopeIcon className="h-4 w-4 mr-2" />
//               support@ecommerce.com
//             </a>
//             <a
//               href="tel:+1-555-123-4567"
//               className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
//             >
//               <PhoneIcon className="h-4 w-4 mr-2" />
//               (555) 123-4567
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThankYouPage;

import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  ShoppingBagIcon,
  HomeIcon,
  PrinterIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

// Redux
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
  clearCustomerSession,
  clearCurrentOrder,
  clearError,
  clearValidationErrors,
} from "../store/slices/orderSlice";
import {
  startNewSession,
  forceReset,
  clearCartAfterOrder,
} from "../store/slices/cartSlice";

// Components
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";

const ThankYouPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  // Load order data
  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [orderNumber, dispatch]);

  // Redirect if no order number
  useEffect(() => {
    if (!orderNumber) {
      navigate("/");
    }
  }, [orderNumber, navigate]);

  // Handle continue shopping - completely fresh start
  const handleContinueShopping = () => {
    // Clear all Redux state
    dispatch(clearCustomerSession());
    dispatch(clearCurrentOrder());
    dispatch(clearError());
    dispatch(clearValidationErrors());
    dispatch(forceReset());
    dispatch(startNewSession());
    dispatch(clearCartAfterOrder());

    toast.success("Starting fresh shopping session!", {
      icon: "🛒",
      duration: 2000,
    });

    navigate("/");

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  // Copy order number to clipboard
  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      toast.success("Order number copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy order number:", err);
      toast.error("Failed to copy order number");
    }
  };

  // Print order details
  const printOrder = () => {
    window.print();
  };

  // Get status icon and colors
  const getStatusDisplay = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircleIcon,
          iconColor: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Order Confirmed!",
          message:
            "Your payment was successful and your order is being processed.",
          emailMessage:
            "📧 A confirmation email has been sent to your email address.",
          nextSteps: [
            "✅ Payment processed successfully",
            "📦 Inventory has been updated",
            "📧 Confirmation email sent",
            "🚚 We'll prepare your order for shipping",
            "📱 You'll receive tracking information via email",
            "⏱️ Estimated delivery: 3-5 business days",
          ],
        };
      case "declined":
        return {
          icon: XCircleIcon,
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Payment Declined",
          message:
            "Your payment could not be processed. Please try again with a different payment method.",
          emailMessage:
            "📧 An email with retry instructions has been sent to you.",
          nextSteps: [
            "❌ Payment was declined by your bank",
            "🔄 No inventory changes were made",
            "📧 Decline notification email sent",
            "💳 Check your card details and try again",
            "📞 Contact your bank to verify the transaction",
            "🔧 Try using a different payment method",
          ],
        };
      case "error":
        return {
          icon: ExclamationTriangleIcon,
          iconColor: "text-orange-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          title: "Payment Error",
          message:
            "We encountered a technical error while processing your payment. Please try again later.",
          emailMessage:
            "📧 We've sent you an email with more information about this error.",
          nextSteps: [
            "⚠️ Technical error occurred during processing",
            "🔄 No inventory changes were made",
            "📧 Error notification email sent",
            "🔧 Our technical team has been notified",
            "⏱️ You can try placing the order again in a few minutes",
            "💰 No charges have been made to your account",
          ],
        };
      default:
        return {
          icon: ExclamationTriangleIcon,
          iconColor: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          title: "Order Status Unknown",
          message: "We're checking the status of your order.",
          emailMessage: "",
          nextSteps: [],
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            message="Unable to load order details"
            onRetry={() => dispatch(fetchOrderByNumber(orderNumber))}
          />
          <div className="mt-6 text-center">
            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <button
            onClick={handleContinueShopping}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Header */}
        <div
          className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border rounded-lg p-8 mb-8 text-center animate-fade-in`}
        >
          <StatusIcon
            className={`h-16 w-16 ${statusDisplay.iconColor} mx-auto mb-4`}
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {statusDisplay.title}
          </h1>
          <p className="text-lg text-gray-700 mb-4">{statusDisplay.message}</p>
          {statusDisplay.emailMessage && (
            <p className="text-sm text-gray-600">
              {statusDisplay.emailMessage}
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DocumentDuplicateIcon className="h-5 w-5 mr-2 text-primary-600" />
              Order Information
            </h2>

            <div className="space-y-4">
              {/* Order Number */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <span className="text-sm text-gray-600">Order Number</span>
                  <p className="font-mono text-lg font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                </div>
                <button
                  onClick={copyOrderNumber}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy order number"
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Order Date */}
              <div>
                <span className="text-sm text-gray-600">Order Date</span>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Transaction ID */}
              {order.transaction?.transactionId && (
                <div>
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <p className="font-mono text-sm text-gray-900">
                    {order.transaction.transactionId}
                  </p>
                </div>
              )}

              {/* Status */}
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <p
                  className={`font-medium capitalize ${
                    order.status === "approved"
                      ? "text-green-600"
                      : order.status === "declined"
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ShoppingBagIcon className="h-5 w-5 mr-2 text-primary-600" />
              Product Details
            </h2>

            <div className="flex items-start space-x-4">
              <img
                src={order.productInfo.image}
                alt={order.productInfo.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {order.productInfo.title}
                </h3>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Price:</span> $
                    {order.productInfo.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Quantity:</span>{" "}
                    {order.productInfo.quantity}
                  </p>

                  {order.productInfo.selectedVariants?.length > 0 && (
                    <div>
                      <span className="font-medium">Selected Options:</span>
                      <span className="ml-1">
                        {order.productInfo.selectedVariants.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Customer Information
            </h2>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Name</span>
                <p className="font-medium text-gray-900">
                  {order.customerInfo.fullName}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Email</span>
                <p className="text-gray-900">{order.customerInfo.email}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Phone</span>
                <p className="text-gray-900">{order.customerInfo.phone}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Shipping Address</span>
                <div className="text-gray-900">
                  <p>{order.customerInfo.address}</p>
                  <p>
                    {order.customerInfo.city}, {order.customerInfo.state}{" "}
                    {order.customerInfo.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  ${order.pricing.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="text-gray-900">
                  ${order.pricing.tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    ${order.pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              {order.paymentInfo?.cardNumber && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <p className="text-gray-900 font-mono">
                    Card ending in {order.paymentInfo.cardNumber.slice(-4)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {statusDisplay.nextSteps.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What happened with your order?
            </h2>
            <ul className="space-y-2">
              {statusDisplay.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinueShopping}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>

          {order.status === "declined" && (
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary-300 text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors"
            >
              Try Payment Again
            </Link>
          )}

          <button
            onClick={printOrder}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors no-print"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Order
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 text-center no-print">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please don't hesitate to
            contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@ecommerce.com"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              support@ecommerce.com
            </a>
            <a
              href="tel:+1-555-123-4567"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
