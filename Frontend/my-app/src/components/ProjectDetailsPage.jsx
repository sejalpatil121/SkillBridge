import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ContributeForm from '../components/ContributeForm';

const stripePromise = loadStripe('your_stripe_publishable_key');

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProject();
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>Goal: ${project.fundingGoal}</p>
      <p>Raised: ${project.amountRaised}</p>
      <Elements stripe={stripePromise}>
        <ContributeForm projectId={project._id} />
      </Elements>
    </div>
  );
};

export default ProjectDetailsPage;