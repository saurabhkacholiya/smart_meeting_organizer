import { useNavigate } from "react-router-dom";

function AddMeetingRoom() {
  const navigate = useNavigate();

  function handleNavigate() {
    const title = "Booked3";
    const date = "13/02/2019";
    const startTime = "21:00";
    const endTime = "22:00";
    navigate("/rooms", { state: { title, date, startTime, endTime } });
  }

  return (
    <div>
      <div>You are in add meeting room</div>
      <button onClick={handleNavigate}>Next</button>
    </div>
  );
}

export default AddMeetingRoom;
