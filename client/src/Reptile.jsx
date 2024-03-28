import { useState, useEffect } from "react";
import { useApi } from "../utils/use_api";
import { useParams } from "react-router-dom";
import { EditReptileModal } from "./components/EditReptileModal/EditReptileModal";
import { AddFeedingModal } from "./components/AddFeedingModal/AddFeedingModal";
import "./Reptile.css";
import { AddHusbandryRecordModal } from "./components/AddHusbandryRecordModal/AddHusbandryRecordModal";
import AddScheduleModal from "./components/AddScheduleModal/AddScheduleModal";

export const Reptile = () => {
  const { reptileId } = useParams(); // Assuming you're using react-router and reptileId is in the URL
  const api = useApi();

  const [reptile, setReptile] = useState(null);
  const [isUpdatingReptile, setIsUpdatingReptile] = useState(false);

  const [feedings, setFeedings] = useState([]);
  const [isCreatingFeeding, setIsCreatingFeeding] = useState(false);

  const [husbandryRecords, setHusbandryRecords] = useState([]);
  const [isCreatingHusbandryRecord, setIsCreatingHusbandryRecord] =
    useState(false);
  // const [newLength, setNewLength] = useState(0);
  // const [newWeight, setNewWeight] = useState(0);
  // const [newTemperature, setNewTemperature] = useState(0);
  // const [newHumidity, setNewHumidity] = useState(0);

  const [schedules, setSchedules] = useState([]);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  // const [newScheduleType, setNewScheduleType] = useState("feed");
  // const [newDescription, setNewDescription] = useState("");
  // const [days, setDays] = useState({
  //   monday: false,
  //   tuesday: false,
  //   wednesday: false,
  //   thursday: false,
  //   friday: false,
  //   saturday: false,
  //   sunday: false,
  // });

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

  // const handleCreateSchedule = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const scheduleData = {
  //       reptileId: parseInt(reptileId, 10), // Assuming reptileId comes from useParams and is a string
  //       type: newScheduleType,
  //       description: newDescription,
  //       ...days,
  //     };
  //     const res = await api.post(`/schedules`, scheduleData);
  //     // Reset form state
  //     setIsCreatingSchedule(false);
  //     setNewScheduleType("feed");
  //     setNewDescription("");
  //     setDays({
  //       monday: false,
  //       tuesday: false,
  //       wednesday: false,
  //       thursday: false,
  //       friday: false,
  //       saturday: false,
  //       sunday: false,
  //     });
  //     if (res.schedule) {
  //       setSchedules((prev) => [...prev, res.schedule]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to create new schedule:", error);
  //   }
  // };

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
                  <p>Sex: {reptile.sex}</p>
                  <p>Species: {reptile.species}</p>
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
                      Food: {feeding.foodItem} - Date: {feeding.createdAt}
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
    </>
  );
};
