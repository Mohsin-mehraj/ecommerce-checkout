import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Redux
import {
  createOrder,
  selectOrderSubmitting,
  selectOrderError,
  selectValidationErrors,
  selectLastOrderNumber,
  clearError,
  clearValidationErrors,
  clearCurrentOrder,
  clearCustomerSession,
} from "../store/slices/orderSlice";
import {
  selectCartSummary,
  selectIsValidSelection,
} from "../store/slices/cartSlice";

// Components
import OrderSummary from "../components/Cart/OrderSummary.jsx";
import LoadingSpinner from "../components/UI/LoadingSpinner.jsx";
import FormInput from "../components/Forms/FormInput";

// Icons
import {
  CreditCardIcon,
  UserIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const cartSummary = useSelector(selectCartSummary);
  const isValidSelection = useSelector(selectIsValidSelection);
  const submitting = useSelector(selectOrderSubmitting);
  const orderError = useSelector(selectOrderError);
  const validationErrors = useSelector(selectValidationErrors);
  const lastOrderNumber = useSelector(selectLastOrderNumber);

  // Local state
  const [cardPreview, setCardPreview] = useState("");

  // Form setup - ALWAYS start with empty form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Watch card number for preview
  const cardNumber = watch("cardNumber");

  // Clear everything when component mounts
  useEffect(() => {
    // Clear all Redux state
    dispatch(clearError());
    dispatch(clearValidationErrors());
    dispatch(clearCurrentOrder());
    dispatch(clearCustomerSession());

    // Reset form to completely empty state
    const emptyForm = {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    };

    reset(emptyForm);
    setCardPreview("");

    // Double reset to ensure form is completely cleared
    setTimeout(() => {
      reset(emptyForm);
    }, 100);
  }, []); // Only run on mount

  // Redirect if no valid cart selection
  useEffect(() => {
    if (!isValidSelection) {
      toast.error("Please select a product first");
      navigate("/");
    }
  }, [isValidSelection, navigate]);

  // Handle successful order
  useEffect(() => {
    if (lastOrderNumber) {
      navigate(`/thank-you/${lastOrderNumber}`);
    }
  }, [lastOrderNumber, navigate]);

  // Update card preview
  useEffect(() => {
    if (cardNumber) {
      const cleaned = cardNumber.replace(/\D/g, "");
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardPreview(formatted);
    } else {
      setCardPreview("");
    }
  }, [cardNumber]);

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      // Prepare order data
      const orderData = {
        // Customer information
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,

        // Payment information
        cardNumber: formData.cardNumber.replace(/\D/g, ""), // Remove spaces
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,

        // Product information
        productId: cartSummary.product.id,
        selectedVariants: cartSummary.variants,
        quantity: cartSummary.quantity,
      };

      // Dispatch create order
      const result = await dispatch(createOrder(orderData));

      if (createOrder.fulfilled.match(result)) {
        toast.success("Order submitted successfully!");
      } else {
        toast.error("Order submission failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Format card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const formatted = value.substring(0, 16); // Limit to 16 digits
    setValue("cardNumber", formatted);
  };

  // Format expiry date input
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setValue("expiryDate", value);
  };

  // Get field error (from validation or server)
  const getFieldError = (fieldName) => {
    // Client-side validation error
    if (errors[fieldName]) {
      return errors[fieldName].message;
    }

    // Server-side validation error
    const serverError = validationErrors.find(
      (error) => error.field === fieldName
    );
    return serverError?.message;
  };

  if (!isValidSelection) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-2">
                Complete your order details below
              </p>
            </div>

            {/* Error Display */}
            {orderError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{orderError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Customer Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Full Name"
                      {...register("fullName", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      error={getFieldError("fullName")}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <FormInput
                    label="Email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    error={getFieldError("email")}
                    placeholder="your@email.com"
                  />

                  <FormInput
                    label="Phone Number"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    error={getFieldError("phone")}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <MapPinIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <FormInput
                    label="Address"
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 5,
                        message: "Address must be at least 5 characters",
                      },
                    })}
                    error={getFieldError("address")}
                    placeholder="123 Main Street"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="City"
                      {...register("city", {
                        required: "City is required",
                        minLength: {
                          value: 2,
                          message: "City must be at least 2 characters",
                        },
                      })}
                      error={getFieldError("city")}
                      placeholder="New York"
                    />

                    <FormInput
                      label="State"
                      {...register("state", {
                        required: "State is required",
                        minLength: {
                          value: 2,
                          message: "State must be at least 2 characters",
                        },
                      })}
                      error={getFieldError("state")}
                      placeholder="NY"
                    />

                    <FormInput
                      label="Zip Code"
                      {...register("zipCode", {
                        required: "Zip code is required",
                        pattern: {
                          value: /^[0-9]{5}(-[0-9]{4})?$/,
                          message: "Invalid zip code",
                        },
                      })}
                      error={getFieldError("zipCode")}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <CreditCardIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <FormInput
                      label="Card Number"
                      {...register("cardNumber", {
                        required: "Card number is required",
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message: "Card number must be 16 digits",
                        },
                      })}
                      error={getFieldError("cardNumber")}
                      placeholder="1234 5678 9012 3456"
                      onChange={handleCardNumberChange}
                      maxLength={16}
                    />
                    {cardPreview && (
                      <p className="text-sm text-gray-600 mt-1">
                        Preview: {cardPreview}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Expiry Date"
                      {...register("expiryDate", {
                        required: "Expiry date is required",
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: "Format: MM/YY",
                        },
                      })}
                      error={getFieldError("expiryDate")}
                      placeholder="MM/YY"
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />

                    <FormInput
                      label="CVV"
                      {...register("cvv", {
                        required: "CVV is required",
                        pattern: {
                          value: /^[0-9]{3}$/,
                          message: "CVV must be 3 digits",
                        },
                      })}
                      error={getFieldError("cvv")}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    submitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <LoadingSpinner size="small" />
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    `Complete Order - $${cartSummary.total.toFixed(2)}`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <OrderSummary cartSummary={cartSummary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
