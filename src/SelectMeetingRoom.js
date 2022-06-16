import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function SelectMeetingRoom() {
  const location = useLocation();
  const { date, endTime, startTime, title, completeData, selectedBuilding } =
    location.state;

  useEffect(() => {
    const filterData = completeData.filter(
      (building) => Number(selectedBuilding) === Number(building.id)
    );

    console.log(filterData);
  }, [completeData, location, selectedBuilding]);

  console.log("completed data ", completeData);

  return (
    <div>
      <div>{title}</div>
      <div>{date}</div>
      <div>{startTime}</div>
      <div>{endTime}</div>
      <div>{selectedBuilding}</div>
    </div>
  );
}

export default SelectMeetingRoom;
