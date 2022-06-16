import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

function Dropdown({ title, list, value, onChange }) {
  return (
    <>
      <label className="col m-10">
        {title}
        <select className="input_type m-10" value={value} onChange={onChange}>
          {list.map((item, idx) => {
            return (
              <option key={`${item.id}_${idx}`} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </select>
      </label>
    </>
  );
}

function AddMeetingRoom() {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");

  const [list, setList] = useState([]);
  const [completeData, setCompleteData] = useState(null);

  useEffect(() => {
    const list = location.state.buildingList;
    const data = location.state.completeData;
    setList([{ id: 0, name: "Select Building" }, ...list]);
    setCompleteData(data);
  }, [location]);

  function handleDateChange(e) {
    console.log("in date ", e.target.value);
    setDate(e.target.value);
  }

  function handleStartTime(e) {
    console.log("setStartTime date ", e.target.value);
    setStartTime(e.target.value);
  }

  function handleEndTime(e) {
    console.log("setEndTime date ", e.target.value);
    setEndTime(e.target.value);
  }

  function handleTitle(e) {
    console.log("handleTitle ", e.target.value);
    setTitle(e.target.value);
  }

  function handleSelectBuilding(e) {
    console.log("setSelectedBuilding ", e.target.value);
    setSelectedBuilding(e.target.value);
  }

  function handleNavigate() {
    navigate("/rooms", {
      state: {
        title,
        date,
        startTime,
        endTime,
        completeData,
        selectedBuilding,
      },
    });
  }

  return (
    <div className="main">
      <div className="card_item">
        <div className="m-10">Title</div>
        <div className="m-10">
          <input
            placeholder="Please select meeting title"
            type="text"
            value={title}
            onChange={handleTitle}
            className="input_type"
          />
        </div>
      </div>

      <div className="card_item">
        <div className="m-10">Date</div>
        <input
          className="input_type"
          type={"date"}
          onChange={handleDateChange}
          value={date}
        />
      </div>

      <div className="card_item">
        <div className="m-10">Start Time</div>
        <input
          className="input_type"
          type={"time"}
          onChange={handleStartTime}
          value={startTime}
        />
      </div>

      <div className="card_item">
        <div>End Time</div>
        <input
          className="input_type"
          type={"time"}
          onChange={handleEndTime}
          value={endTime}
        />
      </div>

      <div className="card_item">
        <Dropdown
          value={selectedBuilding}
          onChange={handleSelectBuilding}
          list={list}
          title="SelectBuilding"
        />
      </div>
      <button className="button" onClick={handleNavigate}>
        Next
      </button>
    </div>
  );
}

export default AddMeetingRoom;
