import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaBan } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Fetch active riders
  const {
    data: riders = [],
    isPending,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  // Mutation to deactivate rider
  const deactivateMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/riders/${id}/deactivate`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["active-riders"] }),
  });

  const confirmDeactivate = (id) => {
    Swal.fire({
      title: "Deactivate this rider?",
      text: "They will no longer be able to take rides.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, deactivate",
    }).then((result) => {
      if (result.isConfirmed) {
        deactivateMutation.mutate(id);
        Swal.fire("🚫 Deactivated", "The rider has been deactivated.", "success");
      }
    });
  };

  // Filter riders by search
  const filteredRiders = riders.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isPending) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by rider name..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table */}
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
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((r, idx) => (
              <tr key={r._id}>
                <td>{idx + 1}</td>
                <td>{r.name}</td>
                <td>{r.age}</td>
                <td>{r.region}</td>
                <td>{r.district}</td>
                <td>{r.phone}</td>
                <td className="capitalize">{r.status}</td>
                <td className="text-center">
                  <button
                    onClick={() => confirmDeactivate(r._id)}
                    className="btn btn-sm btn-error btn-outline"
                    disabled={deactivateMutation.isPending}
                  >
                    <FaBan />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No active riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;
