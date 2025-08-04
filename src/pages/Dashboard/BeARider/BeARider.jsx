import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch service centers
  useEffect(() => {
    axiosSecure("/service-centers").then((res) => setServiceCenters(res.data));
  }, [axiosSecure]);

  const regions = [...new Set(serviceCenters.map((c) => c.region))];
  const districts = serviceCenters
    .filter((c) => c.region === selectedRegion)
    .map((c) => c.district);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      name: user.displayName,
      email: user.email,
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/rider-applications", payload);
      if (res.data.insertedId) {
        Swal.fire("✅ Success", "Application submitted", "success");
        reset();
      }
    } catch (err) {
      Swal.fire("❌ Error", err.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">🚴 Be a Rider</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            defaultValue={user.displayName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Age</label>
          <input
            type="number"
            {...register("age", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter your age"
          />
          {errors.age && <p className="text-error text-sm">Age is required</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Region</label>
            <select
              className="select select-bordered w-full"
              {...register("region", { required: true })}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">Select Region</option>
              {regions.map((region, i) => (
                <option key={i} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="text-error text-sm">Region is required</p>
            )}
          </div>

          <div>
            <label className="label">District</label>
            <select
              className="select select-bordered w-full"
              {...register("district", { required: true })}
              disabled={!selectedRegion}
            >
              <option value="">Select District</option>
              {districts.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-error text-sm">District is required</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            className="input input-bordered w-full"
            placeholder="01XXXXXXXXX"
          />
        </div>

        <div>
          <label className="label">National ID Number</label>
          <input
            type="text"
            {...register("nid", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter NID"
          />
        </div>

        <div>
          <label className="label">Bike Brand</label>
          <input
            type="text"
            {...register("bike_brand", { required: true })}
            className="input input-bordered w-full"
            placeholder="Ex: Honda, Yamaha"
          />
        </div>

        <div>
          <label className="label">Bike Registration Number</label>
          <input
            type="text"
            {...register("bike_registration", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter Registration No."
          />
        </div>

        <div className="pt-4">
          <button className="btn text-black btn-primary w-full" type="submit">
            Submit Application 🚀
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
