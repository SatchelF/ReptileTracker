import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useApi } from "../../../utils/use_api";

export const EditReptileModal = ({ show, onHide, reptile, setReptile }) => {
  const [updateReptileName, setUpdateReptileName] = useState(reptile?.name);
  const [updateReptileSpecies, setUpdateReptileSpecies] = useState(
    reptile?.species
  );
  const [updateReptileSex, setUpdateReptileSex] = useState(reptile?.sex);
  const { reptileId } = useParams();
  const api = useApi();

  useEffect(() => {
    if (reptile) {
      setUpdateReptileName(reptile?.name);
      setUpdateReptileSpecies(reptile?.species);
      setUpdateReptileSex(reptile?.sex);
    }
  }, [reptile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedReptile = {
        name: updateReptileName,
        species: updateReptileSpecies,
        sex: updateReptileSex,
      };
      const res = await api.put(`/reptiles/${reptileId}`, updatedReptile);
      if (res.reptile) {
        setReptile(res.reptile);
      }
      onHide();
    } catch (error) {
      console.error("Failed to update reptile:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="edit-reptile-modal"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="edit-reptile-modal">
            Edit Reptile Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Reptile Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={updateReptileName}
              onChange={(e) => setUpdateReptileName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              as="select"
              name="sex"
              value={updateReptileSex}
              onChange={(e) => setUpdateReptileSex(e.target.value)}
              required
            >
              <option value="m">Male</option>
              <option value="f">Female</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Species</Form.Label>
            <Form.Control
              as="select"
              name="species"
              value={updateReptileSpecies}
              onChange={(e) => setUpdateReptileSpecies(e.target.value)}
              required
            >
              <option value="ball_python">Ball Python</option>
              <option value="king_snake">King Snake</option>
              <option value="corn_snake">Corn Snake</option>
              <option value="redtail_boa">Redtail Boa</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
