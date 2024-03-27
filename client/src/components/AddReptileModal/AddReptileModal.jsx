import React, { useState } from 'react'; // Corrected import to include useState
import './AddReptileModal.css'; // Import your custom CSS here

const AddReptileModal = ({ show, onClose, onCreateReptile }) => {
  const [newReptileName, setNewReptileName] = useState('');
  const [newReptileSex, setNewReptileSex] = useState('m');
  const [newReptileSpecies, setNewReptileSpecies] = useState('ball_python');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateReptile({
      name: newReptileName,
      sex: newReptileSex,
      species: newReptileSpecies,
    });

    // Reset the form fields after submission
    setNewReptileName("");
    setNewReptileSex("m");
    setNewReptileSpecies("ball_python");
    onClose(); // Close the modal
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-custom" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Reptile</h5>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="reptileName">Reptile Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="reptileName"
                  placeholder="Enter reptile's name"
                  value={newReptileName}
                  onChange={(e) => setNewReptileName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reptileSex">Sex</label>
                <select
                  className="form-control"
                  id="reptileSex"
                  value={newReptileSex}
                  onChange={(e) => setNewReptileSex(e.target.value)}
                >
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="reptileSpecies">Species</label>
                <select
                  className="form-control"
                  id="reptileSpecies"
                  value={newReptileSpecies}
                  onChange={(e) => setNewReptileSpecies(e.target.value)}
                >
                  <option value="ball_python">Ball Python</option>
                  <option value="king_snake">King Snake</option>
                  <option value="corn_snake">Corn Snake</option>
                  <option value="redtail_boa">Redtail Boa</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Reptile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReptileModal;
