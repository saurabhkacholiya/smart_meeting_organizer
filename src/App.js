import moment from "moment";
import "./App.css";
import { useState, useEffect } from "react";

const data = {
  Buildings: [
    {
      name: "Building 8",
      meetingRooms: [
        {
          name: "Punjab",
          meetings: [
            {
              title: "Booked for Interview",
              date: "16/06/2022",
              startTime: "00:00",
              endTime: "02:00",
            },
          ],
        },
      ],
    },
    {
      name: "Building 4",
      meetingRooms: [],
    },
    {
      name: "Building 6",
      meetingRooms: [],
    },
  ],
};

function getTotatMeeting(data) {
  let totalBuildings = data.Buildings.length;
  return totalBuildings;
}

function getTotalRooms(data) {
  let totalRoom = 0;
  data.Buildings.forEach((building) => {
    totalRoom += building.meetingRooms.length;
  });
  return totalRoom;
}

function getRoomStatusIsFreeForCurrentTime(
  currentDateObj,
  meetingDate,
  startTime,
  endTime
) {
  if (currentDateObj.format("DD/MM/YYYY") !== meetingDate) return true;
  return !currentDateObj.isBetween(startTime, endTime);
}

function getIsMeetingGoingOnTodayStatus(currentDateObj, meetingDate) {
  return currentDateObj.format("DD/MM/YYYY") === meetingDate;
}

function getIsMeetingGoingOnNowStatus(
  currentDateObj,
  meetingDate,
  startTime,
  endTime
) {
  return (
    getIsMeetingGoingOnTodayStatus(currentDateObj, meetingDate) &&
    currentDateObj.isBetween(startTime, endTime)
  );
}

function getRoomAndMeetingDetails(data) {
  let totalFreeRoomNow = 0;
  let totalNoMeetingGoingOnToday = 0;
  let totalMeetingGoingOnNow = 0;

  data.Buildings.forEach((building) => {
    building.meetingRooms.forEach((room) => {
      room.meetings.forEach((meeting) => {
        const currentDateObj = moment();
        const meetingDate = moment(meeting.date, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        );

        const startTime = moment(meeting.startTime, "HH:mm");
        const endTime = moment(meeting.endTime, "HH:mm");

        const isMeetingGoingOnToday = getIsMeetingGoingOnTodayStatus(
          currentDateObj,
          meetingDate
        );

        const isMeetingGoingOnNow = getIsMeetingGoingOnNowStatus(
          currentDateObj,
          meetingDate,
          startTime,
          endTime
        );

        const isCurrentRoomFree = getRoomStatusIsFreeForCurrentTime(
          currentDateObj,
          meetingDate,
          meeting.startTime,
          meeting.endTime
        );

        if (isMeetingGoingOnNow) totalMeetingGoingOnNow += 1;
        if (isMeetingGoingOnToday) totalNoMeetingGoingOnToday += 1;
        if (isCurrentRoomFree) totalFreeRoomNow += 1;
      });
    });
  });

  return {
    totalFreeRoomNow,
    totalNoMeetingGoingOnToday,
    totalMeetingGoingOnNow,
  };
}

function App() {
  const [totalBuildings, setTotalBuildings] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [freeRoomsNow, setFreeRoomsNow] = useState(0);
  const [totalMeetingsToday, setTotalMeetingsToday] = useState(0);
  const [onGoingMeetingsNow, setOnGoingMeetingsNow] = useState(0);

  useEffect(() => {
    setTotalBuildings(getTotatMeeting(data));
    setTotalRooms(getTotalRooms(data));
    const {
      totalFreeRoomNow,
      totalNoMeetingGoingOnToday,
      totalMeetingGoingOnNow,
    } = getRoomAndMeetingDetails(data);
    setFreeRoomsNow(totalFreeRoomNow);
    setTotalMeetingsToday(totalNoMeetingGoingOnToday);
    setOnGoingMeetingsNow(totalMeetingGoingOnNow);
  }, [data]);

  return (
    <>
      <div>{`Total buildings ${totalBuildings}`} </div>
      <div>
        <div>Rooms</div>
        <div>{`Total Rooms ${totalRooms}`}</div>
        <div>{`Free now ${freeRoomsNow}`}</div>
      </div>
      <div>
        <div>Meetings</div>
        <div>{`Total ${totalMeetingsToday}`}</div>
        <div>{`Total ${onGoingMeetingsNow} Going On`}</div>
      </div>
      <button className="button">Add meeting</button>
    </>
  );
}

export default App;
