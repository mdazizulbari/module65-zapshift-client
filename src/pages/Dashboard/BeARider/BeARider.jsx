import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const locationData = useLoaderData(); // 👈 using loader for service centers
  const [region, setRegion] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const regions = [...new Set(locationData.map((item) => item.region))];
  const districts = locationData
    .filter((item) => item.region === region)
    .map((item) => item.city);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user.displayName,
      email: user.email,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    try {
      console.log(riderData);
      const res = await axiosSecure.post("/riders", riderData);
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
        {/* Name & Email */}
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            defaultValue={user.displayName}
            readOnly
            className="input input-bordered w-full cursor-not-allowed"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            readOnly
            className="input input-bordered w-full cursor-not-allowed"
          />
        </div>

        {/* Age */}
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

        {/* Region & District */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Region</label>
            <select
              {...register("region", { required: true })}
              className="select select-bordered w-full"
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="" disabled selected>
                Choose region
              </option>
              {regions.map((reg, i) => (
                <option key={i} value={reg}>
                  {reg}
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
              {...register("district", { required: true })}
              className="select select-bordered w-full"
              disabled={!region}
            >
              <option value="" disabled selected>
                Choose district
              </option>
              {districts.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-error text-sm">District is required</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            className="input input-bordered w-full"
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && (
            <p className="text-error text-sm">Phone number is required</p>
          )}
        </div>

        {/* NID */}
        <div>
          <label className="label">National ID Number</label>
          <input
            type="text"
            {...register("nid", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter NID"
          />
          {errors.nid && <p className="text-error text-sm">NID is required</p>}
        </div>

        {/* Bike Brand */}
        <div>
          <label className="label">Bike Brand</label>
          <input
            type="text"
            {...register("bike_brand", { required: true })}
            className="input input-bordered w-full"
            placeholder="Ex: Honda, Yamaha"
          />
          {errors.bike_brand && (
            <p className="text-error text-sm">Bike brand is required</p>
          )}
        </div>

        {/* Registration */}
        <div>
          <label className="label">Bike Registration Number</label>
          <input
            type="text"
            {...register("bike_registration", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter Registration No."
          />
          {errors.bike_registration && (
            <p className="text-error text-sm">
              Registration number is required
            </p>
          )}
        </div>

        {/* Submit */}
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
