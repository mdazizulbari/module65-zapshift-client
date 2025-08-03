import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaTrashAlt, FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure(`/parcels?email=${user.email}`);
      return res.data;
    },
  });
  console.log(parcels);

  const handleView = (parcel) => {
    Swal.fire({
      title: "📦 Parcel Details",
      html: `<pre style="text-align:left;font-size:14px;">${JSON.stringify(
        parcel,
        null,
        2
      )}</pre>`,
      width: 600,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/parcels/${id}`);
        console.log("server delete response", res.data);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Parcel has been removed.", "success");
        } else {
          Swal.fire("Not Found", "Parcel was not deleted", "warning");
        }
      }
    });
  };

  const handlePay = (parcel) => {
    Swal.fire({
      title: "💳 Proceed to Payment",
      html: `Pay ৳<b>${parcel.deliveryCost}</b> for parcel <code>${parcel.tracking_id}</code>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Pay Now",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
    }).then(async (result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/payment/${parcel._id}`);
        // await axiosSecure.patch(`/parcels/pay/${parcel._id}`, {
        //   payment_status: "paid",
        // });
        // refetch();
        // Swal.fire("✅ Paid!", "Parcel marked as paid.", "success");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">
        📦 My Parcels <span className="">({parcels.length})</span>
      </h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th>Type</th>
              <th>Tracking ID</th>
              <th>Created At</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td className="font-semibold">{parcel.parcelName}</td>
                <td>
                  <span
                  // className={`btn btn-active cursor-default leading-3 px-2 rounded-xl ${
                  //   parcel.type === "Document"
                  //     ? "btn-primary text-black"
                  //     : "btn-secondary"
                  // }`}
                  >
                    {parcel.type}
                  </span>
                </td>
                <td className="font-mono text-xs">{parcel.tracking_id}</td>
                <td>
                  {new Date(parcel.creation_date).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="font-bold text-green-600">
                  ৳{parcel.deliveryCost}
                </td>
                <td>
                  <span
                    className={`badge ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleView(parcel)}
                    className="btn btn-sm btn-info btn-outline"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="btn btn-sm btn-error btn-outline"
                  >
                    <FaTrashAlt />
                  </button>
                  {parcel.payment_status !== "paid" && (
                    <button
                      onClick={() => handlePay(parcel)}
                      className="btn btn-sm btn-success btn-outline"
                    >
                      <FaCreditCard />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 py-6">
                  No parcels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
