// Import necessary hooks and components
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../utils/use_api";
import { EditReptileModal } from "./components/EditReptileModal/EditReptileModal";
import { AddFeedingModal } from "./components/AddFeedingModal/AddFeedingModal";
import "./Reptile.css";
import { AddHusbandryRecordModal } from "./components/AddHusbandryRecordModal/AddHusbandryRecordModal";
import AddScheduleModal from "./components/AddScheduleModal/AddScheduleModal";

export const Reptile = () => {
  const { reptileId } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [reptile, setReptile] = useState(null);
  const [isUpdatingReptile, setIsUpdatingReptile] = useState(false);

  const [feedings, setFeedings] = useState([]);
  const [isCreatingFeeding, setIsCreatingFeeding] = useState(false);

  const [husbandryRecords, setHusbandryRecords] = useState([]);
  const [isCreatingHusbandryRecord, setIsCreatingHusbandryRecord] = useState(false);

  const [schedules, setSchedules] = useState([]);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);

  const formatSpeciesName = (speciesName) => {
    return speciesName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatSex = (sex) => {
    return sex === 'm' ? 'Male' : sex === 'f' ? 'Female' : sex;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  useEffect(() => {
    if (!api.token) {
      navigate("/login");
    }
  }, [navigate, api.token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reptileData = await api.get(`/reptiles/${reptileId}`);
        setReptile(reptileData.reptile);

        const feedingData = await api.get(`/feedings/${reptileId}`);
        setFeedings(feedingData.feedings);

        const husbandryData = await api.get(`/husbandry-records/${reptileId}`);
        setHusbandryRecords(husbandryData.husbandryRecords);

        const scheduleData = await api.get(`/schedules/reptile/${reptileId}`);
        setSchedules(scheduleData.schedules);
      } catch (error) {
        console.error("Failed to fetch reptile data:", error);
      }
    };

    fetchData();
  }, [api, reptileId]);

  return (
    <>
      <div className="reptile-container">
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-3">
              <h1>Reptile Details</h1>
              <button
                onClick={() => setIsUpdatingReptile(true)}
                className="btn btn-primary mb-3"
              >
                Edit Reptile Details
              </button>
              {reptile && (
                <div>
                  <p>Name: {reptile.name}</p>
                  <p>Sex: {formatSex(reptile.sex)}</p>
                  <p>Species: {formatSpeciesName(reptile.species)}</p>
                </div>
              )}
              <EditReptileModal
                show={isUpdatingReptile}
                onHide={() => setIsUpdatingReptile(false)}
                reptile={reptile}
                setReptile={setReptile}
              />
            </div>
            <div className="col-md-3">
              <h2>Feedings</h2>
              <button
                onClick={() => setIsCreatingFeeding(true)}
                className="btn btn-primary mb-2"
              >
                Add New Feeding
              </button>
              <div className="scrollable-list">
                <ul className="list-group">
                  {feedings.map((feeding) => (
                    <li key={feeding.id} className="list-group-item">
                      Food: {feeding.foodItem} - Date: {formatDate(feeding.createdAt)}
                    </li>
                  ))}
                </ul>
              </div>
              <AddFeedingModal
                show={isCreatingFeeding}
                onHide={() => setIsCreatingFeeding(false)}
                setFeedings={setFeedings}
              />
            </div>
            <div className="col-md-3">
              <h2>Husbandry Records</h2>
              <button
                onClick={() => setIsCreatingHusbandryRecord(true)}
                className="btn btn-primary mb-2"
              >
                Add New Husbandry Record
              </button>
              <div className="scrollable-list">
                <ul className="list-group">
                  {husbandryRecords.map((record) => (
                    <li key={record.id} className="list-group-item">
                      Length: {record.length} - Weight: {record.weight} - Temp: {record.temperature} - Humidity: {record.humidity}
                    </li>
                  ))}
                </ul>
              </div>
              <AddHusbandryRecordModal
                show={isCreatingHusbandryRecord}
                onHide={() => setIsCreatingHusbandryRecord(false)}
                setHusbandryRecords={setHusbandryRecords}
              />
            </div>
            <div className="col-md-3">
              <h2>Schedules</h2>
              <button
                onClick={() => setIsCreatingSchedule(true)}
                className="btn btn-primary mb-2"
              >
                Add New Schedule
              </button>
              <div className="scrollable-list">
                <ul className="list-group">
                  {schedules.map((schedule) => (
                    <li key={schedule.id} className="list-group-item">
                      Type: {schedule.type} - Description: {schedule.description}
                      {/* Days and other details can be formatted and added here */}
                    </li>
                  ))}
                </ul>
              </div>
              <AddScheduleModal
                show={isCreatingSchedule}
                onHide={() => setIsCreatingSchedule(false)}
                setSchedules={setSchedules}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
