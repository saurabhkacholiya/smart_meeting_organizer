import moment from "moment";
import "./App.css";
import { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const FETCH_ALL_BUILDINGS = gql`
  query FetchAllBuildings {
    Buildings {
      id
      name
      meetingRooms {
        id
        name
        meetings {
          title
          date
          startTime
          endTime
        }
      }
    }
  }
`;

// function getRoomStatusIsFreeForCurrentTime(
//   currentDateObj,
//   meetingDate,
//   startTime,
//   endTime
// ) {
//   if (currentDateObj.format("DD/MM/YYYY") !== meetingDate) return true;
//   return !currentDateObj.isBetween(startTime, endTime);
// }

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
  let totalFreeRoomsNow = 0;
  let totalNoMeetingGoingOnToday = 0;
  let totalMeetingGoingOnNow = 0;
  let totalRooms = 0;
  let totalBuildings = data?.Buildings.length;

  data?.Buildings?.forEach((building) => {
    totalRooms += building.meetingRooms.length;
    building?.meetingRooms?.forEach((room) => {
      let isCurrentRoomFree = true;
      room?.meetings?.forEach((meeting) => {
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

        isCurrentRoomFree = isCurrentRoomFree && !isMeetingGoingOnNow;

        if (isMeetingGoingOnNow) totalMeetingGoingOnNow += 1;
        if (isMeetingGoingOnToday) totalNoMeetingGoingOnToday += 1;
      });
      if (isCurrentRoomFree) totalFreeRoomsNow += 1;
    });
  });

  return {
    totalFreeRoomsNow,
    totalNoMeetingGoingOnToday,
    totalMeetingGoingOnNow,
    totalRooms,
    totalBuildings,
  };
}

function App() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(FETCH_ALL_BUILDINGS);
  const {
    totalFreeRoomsNow,
    totalNoMeetingGoingOnToday,
    totalMeetingGoingOnNow,
    totalRooms,
    totalBuildings,
  } = useMemo(() => {
    if (!data) return {};
    return getRoomAndMeetingDetails(data);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {`${error}`}</p>;

  function handleNavigation() {
    const buildingList = data.Buildings.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    navigate("/add_meeting", {
      state: {
        buildingList,
        completeData: data.Buildings,
      },
    });
  }

  return (
    <>
      <div>{`Total buildings ${totalBuildings}`} </div>
      <div>
        <div>Rooms</div>
        <div>{`Total Rooms ${totalRooms}`}</div>
        <div>{`Free now ${totalFreeRoomsNow}`}</div>
      </div>
      <div>
        <div>Meetings</div>
        <div>{`Total ${totalNoMeetingGoingOnToday}`}</div>
        <div>{`Total ${totalMeetingGoingOnNow} Going On`}</div>
      </div>
      <button className="button" onClick={handleNavigation}>
        Add meeting
      </button>
    </>
  );
}

export default App;
