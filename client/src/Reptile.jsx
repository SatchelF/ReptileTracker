import { useState, useEffect } from "react";
import { useApi } from "../utils/use_api";
import { useNavigate, useParams } from "react-router-dom";
import { EditReptileModal } from "./components/EditReptileModal/EditReptileModal";
import { AddFeedingModal } from "./components/AddFeedingModal/AddFeedingModal";
import "./Reptile.css";
import { AddHusbandryRecordModal } from "./components/AddHusbandryRecordModal/AddHusbandryRecordModal";
import AddScheduleModal from "./components/AddScheduleModal/AddScheduleModal";

export const Reptile = () => {
  const { reptileId } = useParams(); // Assuming you're using react-router and reptileId is in the URL
  const navigate = useNavigate();
  const api = useApi();

  const [reptile, setReptile] = useState(null);
  const [isUpdatingReptile, setIsUpdatingReptile] = useState(false);

  const [feedings, setFeedings] = useState([]);
  const [isCreatingFeeding, setIsCreatingFeeding] = useState(false);

  const [husbandryRecords, setHusbandryRecords] = useState([]);
  const [isCreatingHusbandryRecord, setIsCreatingHusbandryRecord] =
    useState(false);

  const [schedules, setSchedules] = useState([]);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);


  const formatSpeciesName = (speciesName) => {
    return speciesName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to convert 'm' or 'f' to 'Male' or 'Female'
  const formatSex = (sex) => {
    return sex === 'm' ? 'Male' : sex === 'f' ? 'Female' : sex;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long', // "Monday"
      year: 'numeric', // "2024"
      month: 'long', // "March"
      day: 'numeric', // "31"
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit', // "01"
      minute: '2-digit', // "58"
      second: '2-digit', // "31"
      hour12: true, // "AM" or "PM"
    });
    return `${formattedDate} at ${formattedTime}`;
  }

  useEffect(() => {
    if (!api.token)
    {
      navigate("/login");
    }
  });

  // Fetch reptile details and related data
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
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <h1>Reptile Details</h1>
              {/* Edit Reptile Details Button */}
              <button
                onClick={() => setIsUpdatingReptile(true)}
                className="btn btn-primary mb-3"
              >
                Edit Reptile Details
              </button>
              {/* Display reptile details */}
              {reptile && (
                <div>
                  <p>Name: {reptile.name}</p>
                  <p>Sex: {formatSex(reptile.sex)}</p>
                  <p>Species: {formatSpeciesName(reptile.species)}</p>
                  {/* Add more reptile details as needed */}
                </div>
              )}

              {/* Update Reptile Details Form */}
              <EditReptileModal
                show={isUpdatingReptile}
                onHide={() => setIsUpdatingReptile(false)}
                reptile={reptile}
                setReptile={setReptile}
              />
            </div>
            <div className="col-md-3">
              <h2>Feedings</h2>
              <AddFeedingModal
                show={isCreatingFeeding}
                onHide={() => setIsCreatingFeeding(false)}
                setFeedings={setFeedings}
              />
              <button
                onClick={() => setIsCreatingFeeding(true)}
                className="btn btn-primary"
              >
                Add New Feeding
              </button>

              <ul>
                {feedings &&
                  feedings.map((feeding) => (
                    <li key={feeding.id}>
                      Food: {feeding.foodItem} - Date: {formatDate(feeding.createdAt)}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-3">
              <h2>Husbandry Records</h2>
              <AddHusbandryRecordModal show={isCreatingHusbandryRecord} onHide={() => setIsCreatingHusbandryRecord(false)} setHusbandryRecords={setHusbandryRecords}/>
                <button
                  onClick={() => setIsCreatingHusbandryRecord(true)}
                  className="btn btn-primary"
                >
                  Add New Husbandry Record
                </button>
              <ul>
                {husbandryRecords &&
                  husbandryRecords.map((record) => (
                    <li key={record.id}>
                      Length: {record.length} - Weight: {record.weight} - Temp:{" "}
                      {record.temperature} - Humidity: {record.humidity}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-3">
              <h2>Schedules</h2>
              <AddScheduleModal show={isCreatingSchedule} onHide={() => setIsCreatingSchedule(false)} setSchedules={setSchedules} />
                <button
                  onClick={() => setIsCreatingSchedule(true)}
                  className="btn btn-primary"
                >
                  Add New Schedule
                </button>
                <div className="scrollable-container">
              <ul>
                {schedules &&
                  schedules.map((schedule) => {
                    // Extracting only the days that are true and joining them into a string
                    const activeDays = Object.entries(schedule)
                      .filter(
                        ([key, value]) =>
                          value === true &&
                          [
                            "monday",
                            "tuesday",
                            "wednesday",
                            "thursday",
                            "friday",
                            "saturday",
                            "sunday",
                          ].includes(key)
                      )
                      .map(
                        ([key]) => key.charAt(0).toUpperCase() + key.slice(1)
                      ) // Capitalize the first letter of each day
                      .join(", ");

                    return (
                      <li key={schedule.id}>
                        Type: {schedule.type} - Description:{" "}
                        {schedule.description} - Days: {activeDays}
                      </li>
                    );
                  })}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
