import React from "react";
import SkillMatchingForm from "../components/SkillMatchingForm";

const Recommend = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Collaborators</h1>
      <SkillMatchingForm />
    </div>
  );
};

export default Recommend;