import "../Styles/Global.css";

export default function Contact() {
  const contactInfo = [
    { title: "Call Us", details: "+977-1-4444444", sub: "Mon - Sat, 9am - 6pm" },
    { title: "Email Us", details: "info@servicemitra.com", sub: "24/7 online support" },
    { title: "Visit Us", details: "Baneshwor, Kathmandu", sub: "Nepal, 44600" },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 animate-fade">
      <main className="flex-grow-1">
        <section className="sm-section text-center" style={{ background: "var(--sm-navy)", color: "#fff", padding: "5rem 1rem" }}>
          <div className="sm-container">
            <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1.5rem" }}>Contact<span> Us</span></h1>
            <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", opacity: 0.9 }}>
              Have questions or need assistance? Our team is here to help you connect with
              the best service providers in town.
            </p>
          </div>
        </section>

        <section className="sm-section sm-container">
          <div className="sm-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            {contactInfo.map((info, i) => (
              <div key={i} className="sm-card text-center" style={{ padding: "3rem 1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--sm-navy)", margin: "0 0 0.5rem" }}>{info.title}</h3>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--sm-orange)", marginBottom: "0.25rem" }}>{info.details}</div>
                <p style={{ color: "var(--sm-text-light)", fontSize: "0.85rem", margin: 0 }}>{info.sub}</p>
              </div>
            ))}
          </div>

          <div className="sm-card" style={{ padding: "0", overflow: "hidden", height: "450px" }}>
            <iframe
              title="ServiceMitra HQ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.9270351296!2d85.3312!3d27.6913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199a0d1e1e17%3A0x67ef69383616013a!2sBaneshwor%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1712217122171!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
}
