import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// 🕒 Format ISO date string to readable local date & time
const formatDateTime = (isoDateString) => {
  return new Date(isoDateString).toLocaleString();
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">💳 Payment History</h2>

      {isPending ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Parcel ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td className="font-mono text-xs">{payment.parcelId}</td>
                  <td className="font-mono text-xs">{payment.transactionId}</td>
                  <td>${(payment.amount / 100).toFixed(2)}</td>
                  <td>{formatDateTime(payment.paid_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
