import Marquee from 'react-fast-marquee';

const logos = [
  { src: '/src/assets/brands/amazon.png', alt: 'Amazon' },
  { src: '/src/assets/brands/casio.png', alt: 'Casio' },
  { src: '/src/assets/brands/moonstar.png', alt: 'Moonstar' },
  { src: '/src/assets/brands/randstad.png', alt: 'Randstad' },
  { src: '/src/assets/brands/start-people 1.png', alt: 'Start People' },
  { src: '/src/assets/brands/amazon.png', alt: 'Start' },
];

const LogoMarquee = () => {
  return (
    <section className="py-8 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          Our Trusted Partners
        </h2>
        <Marquee
          speed={30}
          direction="right"
          pauseOnHover={true}
        //   gradient={true}
        //   gradientColor="white"
        //   gradientWidth={100}
          autoFill={true}
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className="mx-24 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-24 w-auto max-w-[150px] object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default LogoMarquee;