import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
      <p className="text-gray-600"><strong>Proficient At:</strong> {user.skillsProficientAt.join(", ")}</p>
      <p className="text-gray-600"><strong>Wants to Learn:</strong> {user.skillsToLearn.join(", ")}</p>
      <p className="text-gray-700 font-medium"><strong>Match Score:</strong> {user.matchScore}</p>
    </div>
  );
};

export default UserCard;