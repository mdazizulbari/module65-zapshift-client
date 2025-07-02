import ServiceCard from "./ServiceCard";
import {
  FaRocket,
  FaTruck,
  FaBox,
  FaMoneyBillWave,
  FaWarehouse,
  FaUndo,
} from "react-icons/fa";

const servicesData = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: <FaRocket className="text-4xl text-blue-500" />,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: <FaTruck className="text-4xl text-green-500" />,
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: <FaBox className="text-4xl text-purple-500" />,
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    icon: <FaMoneyBillWave className="text-4xl text-yellow-500" />,
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    icon: <FaWarehouse className="text-4xl text-red-500" />,
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    icon: <FaUndo className="text-4xl text-teal-500" />,
  },
];

const OurServices = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        {/* Heading and Paragraph */}
        <h2 className="text-4xl font-bold text-center text-base-800 mb-4">
          Our Services
        </h2>
        <p className="text-lg text-center text-base-600 mb-12 max-w-2xl mx-auto">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard service={service} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
