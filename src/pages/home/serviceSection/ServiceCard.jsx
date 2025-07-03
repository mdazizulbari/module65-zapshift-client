const ServiceCard = ({ service }) => {
  const { icon, title, description } = service;
  return (
    <div className="card bg-base-300 shadow-xl p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:bg-base-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-base-800 mb-2">{title}</h3>
      <p className="dark:text-gray-400 text-gray-700">{description}</p>
    </div>
  );
};

export default ServiceCard;
