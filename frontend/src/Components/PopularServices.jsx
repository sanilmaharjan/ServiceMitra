import servicesData from "../Data/services.json";
import "../Styles/PopularServices.css";

const PopularServices = () => {
  return (
    <section className="services-section">
      <div className="container px-4 px-xl-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ color: "#143d59" }}>
            Popular Services
          </h2>
          <p className="text-muted">
            Choose from our most requested local services
          </p>
        </div>
        <div className="row g-4">
          {servicesData.map((service) => (
            <div className="col-12 col-md-6 col-lg-3" key={service.id}>
              <div className="service-card h-100 d-flex flex-column">
                <div style={{ overflow: "hidden" }}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="service-card-img"
                  />
                </div>
                <div className="service-card-body d-flex flex-column flex-grow-1">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="text-muted small mb-0 flex-grow-1">
                    {service.description}
                  </p>
                  <div className="mt-3">
                    <span className="service-link">
                      Post a Job
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PopularServices;
