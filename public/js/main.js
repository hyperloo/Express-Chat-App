const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

// Get username & Room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Join Chat Room
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message form the form on submit
  const message = e.target.elements.msg.value;

  //Emitting a message to the server
  socket.emit("chatMessage", message);

  //Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage({ username, time, text }) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${username} <span>${time}</span></p><p class="text">${text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
