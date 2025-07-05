import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const locationData = useLoaderData(); // fetched from router
  const [deliveryCost, setDeliveryCost] = useState(null);

  const onSubmit = (data) => {
    const cost = calculateCost(data);
    setDeliveryCost(cost);

    toast(
      <div>
        <p className="font-bold">Estimated Delivery Cost: ৳{cost}</p>
        <button
          className="btn btn-sm mt-2 btn-success"
          onClick={() => handleConfirm(data, cost)}
        >
          Confirm
        </button>
      </div>
    );
  };

  const handleConfirm = (data, cost) => {
    const parcelInfo = {
      ...data,
      deliveryCost: cost,
      creation_date: new Date().toISOString(),
    };
    console.log("Saved:", parcelInfo);
    toast.success("Parcel info saved ✅");
    // Send this to your database here
  };

  const calculateCost = (data) => {
    const base = data.type === "Document" ? 30 : 50;
    const weightCost = data.parcelWeight
      ? parseFloat(data.parcelWeight) * 10
      : 0;
    return base + weightCost;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl p-6">
        <h1 className="text-4xl font-bold text-center">Add Parcel</h1>
        <hr className="my-4" />

        <h2 className="text-xl font-semibold mb-2">
          Enter your parcel details
        </h2>

        {/* Parcel Type */}
        <div className="flex gap-6 mb-4">
          <label className="label cursor-pointer">
            <input
              {...register("type", { required: true })}
              type="radio"
              name="type"
              value="Document"
              className="radio"
            />
            <span className="label-text ml-2">Document</span>
          </label>
          <label className="label cursor-pointer">
            <input
              {...register("type", { required: true })}
              type="radio"
              name="type"
              value="Not-Document"
              className="radio"
            />
            <span className="label-text ml-2">Not-document</span>
          </label>
        </div>

        {/* Parcel Name & Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="label">Parcel Name</label>
            <input
              {...register("parcelName", { required: true })}
              type="text"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Parcel Weight (kg)</label>
            <input
              {...register("parcelWeight")}
              type="number"
              step="0.01"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <hr className="my-6" />

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender */}
          <div>
            <h3 className="font-bold text-lg mb-2">Sender Details</h3>
            <SenderReceiverFields
              prefix="sender"
              register={register}
              errors={errors}
              locationData={locationData}
            />
          </div>

          {/* Receiver */}
          <div>
            <h3 className="font-bold text-lg mb-2">Receiver Details</h3>
            <SenderReceiverFields
              prefix="receiver"
              register={register}
              errors={errors}
              locationData={locationData}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            className="btn btn-primary px-8 text-black"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const SenderReceiverFields = ({ prefix, register, errors, locationData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="label capitalize">{prefix} name</label>
      <input
        {...register(`${prefix}Name`, { required: true })}
        type="text"
        className="input input-bordered w-full"
      />
    </div>
    <div>
      <label className="label capitalize">{prefix} address</label>
      <input
        {...register(`${prefix}Address`, { required: true })}
        type="text"
        className="input input-bordered w-full"
      />
    </div>
    <div>
      <label className="label capitalize">{prefix} contact no.</label>
      <input
        {...register(`${prefix}Contact`, { required: true })}
        type="tel"
        className="input input-bordered w-full"
      />
    </div>
    <div>
      <label className="label capitalize">{prefix} warehouse</label>
      <select
        {...register(`${prefix}Warehouse`, { required: true })}
        className="select select-bordered w-full"
      >
        <option disabled selected>
          Choose a warehouse
        </option>
        {locationData.map((item, idx) => (
          <option key={idx} value={item.city}>
            {item.city}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="label capitalize">{prefix} region</label>
      <select
        {...register(`${prefix}Region`, { required: true })}
        className="select select-bordered w-full"
      >
        <option disabled selected>
          Choose region
        </option>
        {[...new Set(locationData.map((item) => item.region))].map(
          (region, idx) => (
            <option key={idx} value={region}>
              {region}
            </option>
          )
        )}
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="label capitalize">{prefix} instructions</label>
      <textarea
        {...register(`${prefix}Instructions`, { required: true })}
        className="textarea textarea-bordered w-full"
        rows={3}
      />
    </div>
  </div>
);

export default SendParcel;
