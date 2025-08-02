import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentForm = () => {
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const { parcelId } = useParams();
  console.log(parcelId);

  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return "...loading";
  }
  console.log(parcelInfo);
  const amount = parcelInfo.deliveryCost;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    // step-1 validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log("error", error);
      setError(error.message);
    } else {
      setError("");
      console.log("paymentMethod", paymentMethod);

      // step-2: create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;
      console.log("🔑 Client Secret from backend:", clientSecret);
      console.log("Full response from backend:", res);

      // step-3 confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        console.log(result.error.message);
        setError(`Payment failed: ${result.error.message}`);
        setProcessing(false);
      } else {
        console.log(result);
        if (result.paymentIntent.status === "succeeded") {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
          console.log("Payment Succeeded");
          // step-4 mark parcel paid also create payment history
          const paymentData = {
            parcelId,
            email: user.email,
            amount,
            transactionId: result.paymentIntent.id,
            paymentMethod: result.paymentIntent.payment_method_types,
          };

          const paymentRes = await axiosSecure.post("/payments", paymentData);
          if (paymentRes.data.insertedId) {
            const transactionId = paymentData.transactionId;
            Swal.fire({
              title: "✅ Payment Successful!",
              text: `Transaction ID: ${transactionId}`,
              icon: "success",
              confirmButtonText: "Go to My Parcels",
              customClass: {
                popup: "text-left", // Optional: aligns text to left
              },
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/dashboard/myParcels");
              }
            });
          }
        }
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        action=""
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          className="btn text-black btn-primary w-full"
          type="submit"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>
        {error && <p className="text-error">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
