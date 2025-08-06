import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const modalRef = useRef();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    isPending,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/riders/${id}/approve`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pending-riders"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/riders/${id}/reject`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pending-riders"] }),
  });

  const confirmApprove = (id) => {
    Swal.fire({
      title: "Approve this rider?",
      text: "They will be marked as active.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(id);
        Swal.fire("✅ Approved!", "The rider has been approved.", "success");
      }
    });
  };

  const confirmReject = (id) => {
    Swal.fire({
      title: "Reject this application?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate(id);
        Swal.fire("🗑️ Rejected", "The application has been rejected.", "success");
      }
    });
  };

  const openDetails = (rider) => {
    setSelectedRider(rider);
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.close();
    setSelectedRider(null);
  };

  if (isPending) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pending Rider Applications</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Age</th>
              <th>Region</th>
              <th>District</th>
              <th>Phone</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((r, idx) => (
              <tr key={r._id}>
                <td>{idx + 1}</td>
                <td>{r.name}</td>
                <td>{r.age}</td>
                <td>{r.region}</td>
                <td>{r.district}</td>
                <td>{r.phone}</td>
                <td>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => openDetails(r)}
                      className="btn btn-sm btn-info btn-outline"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => confirmApprove(r._id)}
                      className="btn btn-sm btn-success btn-outline"
                      disabled={approveMutation.isPending}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => confirmReject(r._id)}
                      className="btn btn-sm btn-error btn-outline"
                      disabled={rejectMutation.isPending}
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {riders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No pending riders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedRider && (
        <dialog ref={modalRef} className="modal">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Rider: {selectedRider.name}
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <b>Age:</b> {selectedRider.age}
              </p>
              <p>
                <b>Region:</b> {selectedRider.region}
              </p>
              <p>
                <b>District:</b> {selectedRider.district}
              </p>
              <p>
                <b>Phone:</b> {selectedRider.phone}
              </p>
              <p>
                <b>NID:</b> {selectedRider.nid}
              </p>
              <p>
                <b>Bike Brand:</b> {selectedRider.bike_brand}
              </p>
              <p>
                <b>Bike Registration:</b> {selectedRider.bike_registration}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span className="capitalize">{selectedRider.status}</span>
              </p>
            </div>
            <div className="modal-action">
              <button onClick={closeModal} className="btn">
                Close
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
