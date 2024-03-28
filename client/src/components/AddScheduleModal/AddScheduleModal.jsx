import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useApi } from "../../../utils/use_api"; // Adjusted import based on your folder structure

const AddScheduleModal = ({ show, onHide, setSchedules }) => {
    const { reptileId } = useParams();
  const api = useApi();

  const [newSchedule, setNewSchedule] = useState({
    reptileId: 0,
    type: 'feed',
    description: '',
    days: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    }
  });

  const handleDayChange = (day) => {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      days: {
        ...prevSchedule.days,
        [day]: !prevSchedule.days[day],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const scheduleData = {
            reptileId: parseInt(reptileId, 10), // Assuming reptileId comes from useParams and is a string
            type: newSchedule.type,
            description: newSchedule.description,
            ...newSchedule.days,
          };
      const res = await api.post(`/schedules`, scheduleData);
      if (res.schedule) {
        setSchedules((prev) => [...prev, res.schedule]);
      }
      onHide(); // Close modal on success
      // Reset state
        setNewSchedule({
            reptileId: 0,
            type: 'feed',
            description: '',
            days: {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            }
        });
    } catch (error) {
      console.error("Failed to create new schedule:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="add-schedule-modal" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="add-schedule-modal">Add New Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Schedule Type</Form.Label>
            <Form.Control as="select" value={newSchedule.type} onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}>
              <option value="feed">Feed</option>
              <option value="clean">Clean</option>
              <option value="record">Record</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" value={newSchedule.description} onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })} />
          </Form.Group>
          <fieldset>
            <Form.Group className="mb-3">
              <Form.Label>Days</Form.Label>
              <div>
                {Object.keys(newSchedule.days).map((day) => (
                  <Form.Check inline label={day.charAt(0).toUpperCase() + day.slice(1)} type="checkbox" id={`day-${day}`} checked={newSchedule.days[day]} onChange={() => handleDayChange(day)} key={day} />
                ))}
              </div>
            </Form.Group>
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary">Add Schedule</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddScheduleModal;
