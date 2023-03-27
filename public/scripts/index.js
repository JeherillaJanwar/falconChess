/* global io */
/* eslint-disable no-unused-vars */

// getting elements from html
const roomNameInput = document.getElementById("roomName");
// const createRoomButton = document.getElementById('createRoomButton');

// opening socket
const socket = io();

// if the user doesn't have a name and a room name, can't create a room
function createRoom(type) {
  console.log(type);
  if (
    document.getElementById("userName").checkValidity() &&
    document.getElementById("roomName").checkValidity()
  ) {
    switch (type) {
      case "single":
        if (
          document.getElementById("Depth").checkValidity() &&
          document.getElementById("Time").checkValidity()
        ) {
          console.log("creating room: ", roomNameInput.value);
          // notify the server about new room
          const depth = Number(document.getElementById("Depth").value);
          const time = Number(document.getElementById("Time").value);
          socket.emit("create_room", type, roomNameInput.value, depth, time);
        }
        break;
      case "multi":
        socket.emit("create_room", type, roomNameInput.value);
        break;
      default:
        console.log("error: trying to create room with unknown type");
        break;
    }
  }
}

// the user needs a name to join a room
function joinRoom(roomName) {
  console.log("joining room: ", roomName);
  if (document.getElementById("userName").checkValidity()) {
    // console.log("moving to chess-page.html with roomName: ", roomName);

    // setting room name to pass it with form to chess-page.html
    roomNameInput.value = roomName;
    // submit form
    document.getElementById("formMulti").submit();
  } else {
    document.getElementById("userName").focus();
  }
}

// handle room_list event by creating a table with joinable rooms
socket.on("room_list", (roomListServer) => {
  // removing old rows
  document.getElementById("rows").textContent = "";

  // for each room add a row to the table
  for (let i = 0; i < roomListServer.length; i += 1) {
    // get the room
    const room = roomListServer[i];

    // create a new row with room name, white player name,
    // black player name, spectators number and join button
    const roomRow = document.createElement("tr");
    const roomName = document.createElement("td");
    roomName.innerText = room.name;
    const roomWhite = document.createElement("td");
    roomWhite.innerText = room.white.name ? room.white.name : "";
    const roomBlack = document.createElement("td");
    roomBlack.innerText = room.black.name ? room.black.name : "";
    const roomSpecators = document.createElement("td");
    roomSpecators.innerText = room.spectators.length;
    
    const hr = document.createElement("hr");

    // creating join room button
    const roomButton = document.createElement("td");
    const roomJoinButton = document.createElement("button");
    roomJoinButton.textContent = "Join";
    roomJoinButton.addEventListener("click", () => {
      joinRoom(room.name);
    });

    // adding button to its cell
    roomButton.appendChild(roomJoinButton);

    // adding elements to row
    roomRow.appendChild(roomName);
    roomRow.appendChild(hr);
    roomRow.appendChild(roomWhite);
    roomRow.appendChild(hr);
    roomRow.appendChild(roomBlack);
    roomRow.appendChild(hr);
    roomRow.appendChild(roomSpecators);
    roomRow.appendChild(hr);
    roomRow.appendChild(roomButton);

    // adding row to table
    document.getElementById("rows").appendChild(roomRow);
    // roomList.appendChild(roomItem);
  }
});
