import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useApi } from "../../../utils/use_api"; // Corrected import path

export const AddHusbandryRecordModal = ({
  show,
  onHide,
  setHusbandryRecords,
}) => {
  const { reptileId } = useParams();
  const api = useApi();

  const [newLength, setNewLength] = useState(0);
  const [newWeight, setNewWeight] = useState(0);
  const [newTemperature, setNewTemperature] = useState(0);
  const [newHumidity, setNewHumidity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const husbandryRecord = {
        reptileId,
        length: parseFloat(newLength),
        weight: parseFloat(newWeight),
        temperature: parseFloat(newTemperature),
        humidity: parseFloat(newHumidity),
      };
      const res = await api.post(`/husbandry-records`, husbandryRecord);
      if (res.husbandryRecord) {
        setHusbandryRecords((prev) => [res.husbandryRecord, ...prev]);
      }
      onHide(); // Close modal on success
      setNewLength(0);
      setNewWeight(0);
      setNewTemperature(0);
      setNewHumidity(0);
    } catch (error) {
      console.error("Failed to create new husbandry record:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="add-husbandry-record-modal"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="add-husbandry-record-modal">
            Add New Husbandry Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Length</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={newLength}
              onChange={(e) => setNewLength(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Temperature</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={newTemperature}
              onChange={(e) => setNewTemperature(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Humidity (%)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={newHumidity}
              onChange={(e) => setNewHumidity(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Record
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
