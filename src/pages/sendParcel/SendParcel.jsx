import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const locationData = useLoaderData();
  const selectedType = watch("type"); // 😊 used to conditionally show weight
  const [deliveryCost, setDeliveryCost] = useState(null);
  const { user } = useAuth();

  const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
  };

  const handleConfirm = (data, cost) => {
    const parcelInfo = {
      ...data,
      deliveryCost: cost,
      userEmail: user?.email || "anonymous",
      creation_date: new Date().toISOString(),
      delivery_status: "not_collected",
      payment_status: "unpaid",
      tracking_id: generateTrackingID(),
    };
    console.log("Saved:", parcelInfo);
    Swal.fire({
      icon: "success",
      title: "Parcel Confirmed",
      text: "Your parcel has been saved successfully!",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const onSubmit = (data) => {
    const isDocument = data.type === "Document";
    const weight = Number(data.parcelWeight) || 0;

    const sameDistrict =
      data.senderRegion === data.receiverRegion &&
      data.senderWarehouse === data.receiverWarehouse;

    let baseCost,
      extraWeightCost = 0,
      extraOutsideCost = 0;

    if (isDocument) {
      baseCost = sameDistrict ? 60 : 80;
    } else {
      baseCost = sameDistrict ? 110 : 150;
      if (weight > 3) {
        extraWeightCost = Math.ceil(weight - 3) * 40;
        if (!sameDistrict) {
          extraOutsideCost = 40; // Fixed extra if outside district and >3kg
        }
      }
    }

    const total = baseCost + extraWeightCost + extraOutsideCost;

    const breakdownHTML = `
    <div style="font-size: 1rem; text-align: left;">
      <b>Parcel Type:</b> ${isDocument ? "Document" : "Non-Document"}<br/>
      <b>Distance:</b> ${
        sameDistrict ? "Within District" : "Outside District"
      }<br/>
      ${!isDocument ? `<b>Weight:</b> ${weight} kg<br/>` : ""}
      <hr style="margin: 10px 0"/>
      <b>Base Cost:</b> ৳${baseCost}<br/>
      ${
        extraWeightCost
          ? `<b>Extra Weight (৳40/kg over 3kg):</b> ৳${extraWeightCost}<br/>`
          : ""
      }
      ${
        extraOutsideCost
          ? `<b>Outside District Fee:</b> ৳${extraOutsideCost}<br/>`
          : ""
      }
      <hr style="margin: 10px 0"/>
      <b>Total Estimated Cost:</b> ৳${total}
      <br/><br/>
      <div style="font-size: 0.9rem; background: #f9fafb; padding: 8px; border-left: 4px solid #3b82f6;">
        <b>Cost Policy:</b><br/>
        • Document parcels cost ৳60 (within district) or ৳80 (outside).<br/>
        • Non-docs up to 3kg cost ৳110 (within) or ৳150 (outside).<br/>
        • Over 3kg adds ৳40 per extra kg.<br/>
        • Outside district non-docs with >3kg add an extra ৳40.
      </div>
    </div>
  `;

    Swal.fire({
      title: "📦 Review Parcel Cost",
      html: breakdownHTML,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "✅ Confirm",
      cancelButtonText: "✏️ Edit",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      focusCancel: true,
      width: 600,
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirm(data, total);
      }
    });
  };

  const calculateCost = (data) => {
    const isDocument = data.type === "Document";
    const weight = Number(data.parcelWeight) || 0;

    const sameDistrict =
      data.senderRegion === data.receiverRegion &&
      data.senderWarehouse === data.receiverWarehouse;

    if (isDocument) {
      return sameDistrict ? 60 : 80;
    }

    // Non-document base cost
    let cost = sameDistrict ? 110 : 150;

    if (weight > 3) {
      cost += Math.ceil(weight - 3) * 40;
      if (!sameDistrict) cost += 40; // extra for outside district heavy items
    }

    return cost;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl p-6">
        <h1 className="text-4xl font-bold text-center">Add Parcel</h1>
        <hr className="my-4 border-base-300" />{" "}
        {/* Changed to border-base-300 */}
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

          {/* 🧠 Only show weight when non-document */}
          {selectedType === "Not-Document" && (
            <div>
              <label className="label">Parcel Weight (kg)</label>
              <input
                {...register("parcelWeight")}
                type="number"
                step="0.01"
                className="input input-bordered w-full"
              />
            </div>
          )}
        </div>
        <hr className="my-6 border-base-300" /> {/* Changed as above */}
        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Sender Details</h3>
            <SenderReceiverFields
              prefix="sender"
              register={register}
              errors={errors}
              locationData={locationData}
            />
          </div>

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
            className="btn btn-primary px-8 text-black" // 🖤 black text
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const SenderReceiverFields = ({ prefix, register, errors, locationData }) => {
  const [region, setRegion] = useState(""); // 🗺 track region change

  return (
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

      {/* 🗺 Region dropdown appears before warehouse */}
      <div>
        <label className="label capitalize">{prefix} region</label>
        <select
          {...register(`${prefix}Region`, { required: true })}
          className="select select-bordered w-full"
          onChange={(e) => setRegion(e.target.value)}
        >
          <option disabled selected>
            Choose region
          </option>
          {[...new Set(locationData.map((i) => i.region))].map((reg, i) => (
            <option key={i} value={reg}>
              {reg}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label capitalize">{prefix} warehouse</label>
        <select
          {...register(`${prefix}Warehouse`, { required: true })}
          className="select select-bordered w-full"
          disabled={!region} // 🧩 disable until region chosen
        >
          <option disabled selected>
            Choose warehouse
          </option>
          {locationData
            .filter((item) => item.region === region) // 🎯 filter based on region
            .map((item, i) => (
              <option key={i} value={item.city}>
                {item.city}
              </option>
            ))}
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
};

export default SendParcel;
