const io = require("socket.io")(8900, {
  cors: {
    origin: ["http://localhost:3000", "exp://192.168.2.113:8081"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("users connection :>>>", users);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      console.log("dit me", { senderId, receiverId, text });
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });
  socket.on("uploadMessage", ({ message, receiverId }) => {
    const data = JSON.parse(message)
    console.log(data)
    // coi ở đây có chưa 
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("updateMessage", {
          senderId: data.senderid,
          message: JSON.stringify(data),
        });
      }
    
  });

  //send and get message
  socket.on("sendMessageIngroup", ({ senderId, receiverId, text, avatar, username }) => {

    //coi ở đây có chưa 
    receiverId.forEach(element => {
      const user = getUser(element);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
          avatar,
          username
        });
      }
    });
  });
  socket.on("uploadMessageIngroup", ({ message, receiverId, avatar, username }) => {
    const data = JSON.parse(message)
    console.log(data)
    // coi ở đây có chưa 
    receiverId.forEach(element => {
      const user = getUser(element);
      if (user) {
        io.to(user.socketId).emit("updateMessage", {
          senderId: data.senderid,
          message: JSON.stringify(data),
          avatar,
          username
        });
      }
    });
  });


  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
