import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import "./rooms.css";

const ADD_MEETING = gql`
  mutation Meeting(
    $id: Int!
    $title: String!
    $date: String!
    $startTime: String!
    $endTime: String!
    $meetingRoomId: Int!
  ) {
    Meeting(
      id: $id
      title: $title
      date: $date
      startTime: $startTime
      endTime: $endTime
      meetingRoomId: $meetingRoomId
    ) {
      id
    }
  }
`;

function checkIfRoomIsAvailabe(
  meetings,
  date,
  selectedStartTime,
  selectedEndTime
) {
  for (let i = 0; i < meetings.length; i++) {
    const room = meetings[i];
    if (room.date !== date) return true;
    const startTime = moment(room.startTime, "HH:mm");
    const endTime = moment(room.endTime, "HH:mm");

    if (
      selectedStartTime.isBetween(startTime, endTime) ||
      selectedEndTime.isBetween(startTime, endTime) ||
      (startTime.isBefore(selectedStartTime) &&
        endTime.isAfter(selectedEndTime)) ||
      (selectedStartTime.isBefore(startTime) &&
        selectedEndTime.isAfter(endTime))
    )
      return false;
    return true;
  }
}

function SelectMeetingRoom() {
  const [addMeeting, { data, loading, error }] = useMutation(ADD_MEETING);

  const location = useLocation();
  const { date, endTime, startTime, title, completeData, selectedBuilding } =
    location.state;
  const [bookingRoomList, setBookingRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({});

  useEffect(() => {
    let filterData = {};
    completeData.forEach((building) => {
      if (Number(selectedBuilding) === Number(building.id)) {
        filterData = building;
      }
    });

    const selectedDate = moment(date).format("DD/MM/YYYY");
    const selectedStartTime = moment(startTime, "HH:mm");
    const selectedEndTime = moment(endTime, "HH:mm");

    const filterList = filterData.meetingRooms.map((item) => {
      let status = checkIfRoomIsAvailabe(
        item.meetings,
        selectedDate,
        selectedStartTime,
        selectedEndTime
      );
      if (status) {
        return {
          buildingId: filterData.id,
          buildingName: filterData.name,
          ...item,
        };
      } else {
        return "";
      }
    });
    setBookingRoomList(filterList);
  }, [completeData, date, endTime, location, selectedBuilding, startTime]);

  if (loading) return <div> sumiting you form </div>;
  if (error) return <div> {`error while sumbiting ${error}`} </div>;

  function handleOnList(room) {
    setSelectedRoom(room);
  }

  function handleSaveMeeting() {
    addMeeting({
      variables: {
        id: Number(selectedRoom.buildingId),
        title: title,
        date: moment(date).format("DD/MM/YYYY"),
        startTime: startTime,
        endTime: endTime,
        meetingRoomId: selectedRoom.id,
      },
    });
  }

  return (
    <div className="main">
      <div>
        {bookingRoomList.length &&
          bookingRoomList.map((room) => {
            return (
              <div
                className="room_div"
                key={room.id}
                onClick={() => handleOnList(room)}
                style={{
                  backgroundColor:
                    room.id === selectedRoom?.id ? "#efefef" : "white",
                }}
              >
                <div>{room.buildingName}</div>
                <div>{room.name}</div>
              </div>
            );
          })}
      </div>
      <div style={{ margin: "20px" }}>
        <button onClick={handleSaveMeeting}>Save</button>
      </div>
    </div>
  );
}

export default SelectMeetingRoom;
