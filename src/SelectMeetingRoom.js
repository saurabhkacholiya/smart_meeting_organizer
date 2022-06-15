import { useLocation } from "react-router-dom";

function SelectMeetingRoom() {
  const location = useLocation();
  const { date, endTime, startTime, title } = location.state;

  return (
    <div>
      <div>{date}</div>
      <div>{endTime}</div>
      <div>{startTime}</div>
      <div>{title}</div>
    </div>
  );
}

export default SelectMeetingRoom;
