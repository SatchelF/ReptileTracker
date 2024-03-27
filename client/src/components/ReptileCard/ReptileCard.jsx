import React from 'react';
import './ReptileCard.css';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ReptileCard = ({ reptile, onSelect, onDelete }) => {
  return (
    <div className="col-md-4 mb-3 reptile-card">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="card-title mb-3">Name: {reptile.name}</h3>
              <h6 className="card-subtitle mb-2">Species: {reptile.species}</h6>
              <p className="card-text mb-3">Sex: {reptile.sex}</p>
            </div>
            <div className="date-info text-end"> {/* Text alignment to the right */}
              <h6 className="card-subtitle mb-1 gray">Created: {formatDate(reptile.createdAt)}</h6>
              <h6 className="card-subtitle  gray ">Updated: {formatDate(reptile.updatedAt)}</h6>
            </div>
          </div>
          <div className="card-actions mt-auto"> {/* Push actions to the bottom */}
            <button className="btn btn-primary me-2" onClick={() => onSelect(reptile.id)}>
              View
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(reptile.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReptileCard;
