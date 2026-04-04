import React from 'react';
import '../Styles/AboutUsDetails.css'

const AboutUsDetails = () => {
  const teamMembers = [
    { role: 'Leader', name: 'Pratigya Luitel' },
    { role: 'Member', name: 'Mohammad Owhid' },
    { role: 'Member', name: 'Sakshi Joshi' },
    { role: 'Member', name: 'Bibek Tamang' },
    { role: 'Member', name: 'Niraj Krishna Shrestha' },
    { role: 'Member', name: 'Dipisha Maharjan' },
    { role: 'Member', name: 'Sanil Maharjan' },
  ];

  return (
    <div className="about-container">
      <h2 className="about-heading">About ServiceMitra</h2>
      <p className="about-description">
        ServiceMitra is a freelancing app providing a variety of services such as plumbing, painting, and more.
        Our mission is to connect skilled professionals with customers efficiently and reliably.
      </p>

      <h3 className="team-heading">Meet Our Team</h3>
      <div className="team-cards">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="member-avatar">{member.name.charAt(0)}</div>
            <div className="member-info">
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsDetails;