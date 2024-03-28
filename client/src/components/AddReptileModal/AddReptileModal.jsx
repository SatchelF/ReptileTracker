import React, { useState } from 'react'; // Corrected import to include useState
import './AddReptileModal.css'; // Import your custom CSS here
import { Modal, Button, Form } from 'react-bootstrap';

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
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add New Reptile
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label htmlFor="reptileName">Reptile Name</Form.Label>
            <Form.Control
              type="text"
              id="reptileName"
              placeholder="Enter reptile's name"
              value={newReptileName}
              onChange={(e) => setNewReptileName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="reptileSex">Sex</Form.Label>
            <Form.Control
              as="select"
              id="reptileSex"
              value={newReptileSex}
              onChange={(e) => setNewReptileSex(e.target.value)}
            >
              <option value="m">Male</option>
              <option value="f">Female</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="reptileSpecies">Species</Form.Label>
            <Form.Control
              as="select"
              id="reptileSpecies"
              value={newReptileSpecies}
              onChange={(e) => setNewReptileSpecies(e.target.value)}
            >
              <option value="ball_python">Ball Python</option>
              <option value="king_snake">King Snake</option>
              <option value="corn_snake">Corn Snake</option>
              <option value="redtail_boa">Redtail Boa</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Create Reptile</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddReptileModal;
