import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useApi } from "../../../utils/use_api";

export const AddFeedingModal = ({ show, onHide, setFeedings }) => {
  const { reptileId } = useParams(); // Assuming reptileId is in the URL
  const api = useApi();

  const [newFeedingFoodItem, setNewFeedingFoodItem] = React.useState("");
  const [newFeedingDate, setNewFeedingDate] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const feedingInfo = {
        reptileId,
        foodItem: newFeedingFoodItem,
        date: newFeedingDate,
      };
      const res = await api.post(`/feedings`, feedingInfo);
      if (res.feeding) {
        setFeedings((prev) => [ res.feeding, ...prev]);
      }
      onHide(); // Close modal on success
      // Optionally reset state or fetch updated data here
      setNewFeedingFoodItem("");
      setNewFeedingDate("");
    } catch (error) {
      console.error("Failed to create new feeding:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="add-feeding-modal"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="add-feeding-modal">Add New Feeding</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Food Item</Form.Label>
            <Form.Control
              type="text"
              value={newFeedingFoodItem}
              onChange={(e) => setNewFeedingFoodItem(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Feeding Date</Form.Label>
            <Form.Control
              type="date"
              value={newFeedingDate}
              onChange={(e) => setNewFeedingDate(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Feeding
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddFeedingModal;
