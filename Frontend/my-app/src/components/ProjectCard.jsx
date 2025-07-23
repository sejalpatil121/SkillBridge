
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px', borderRadius: '8px' }}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p>Goal: ${project.fundingGoal}</p>
      <p>Raised: ${project.amountRaised}</p>
      <Link to={`/projects/${project._id}`}>View Details</Link>
    </div>
  );
};

export default ProjectCard;