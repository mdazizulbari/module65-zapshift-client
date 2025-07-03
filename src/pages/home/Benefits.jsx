import React from "react";

const Benefits = () => {
  const benefits = [
    {
      title: "Live Parcel Tracking",
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
      image: "/src/assets/live-tracking.png",
    },
    {
      title: "100% Safe Delivery",
      description:
        "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
      image: "/src/assets/safe-delivery.png",
    },
    {
      title: "24/7 Call Center Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
      image: "/src/assets/safe-delivery.png",
    },
  ];

  return (
    <div className="flex flex-col w-full my-10">
      {benefits.map((benefit, index) => (
        <div key={index} className="card w-full bg-base-200 hover:bg-base-100 shadow-lg mb-8">
          <div className="card-body flex flex-row items-center justify-start p-6">
            <div className="w-32 h-32">
              <img
                src={benefit.image}
                alt={benefit.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="divider divider-horizontal mx-4"></div>
            <div className="flex-1">
              <h3 className="card-title text-2xl font-bold text-base-content mb-2">
                {benefit.title}
              </h3>
              <p className="text-base-content">{benefit.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Benefits;
