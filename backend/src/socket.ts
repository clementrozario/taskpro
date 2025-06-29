import { Server } from "socket.io";

let onlineUsers: { [userId: string]: string } = {};

export function initSocketIO(io: Server) {
  io.on("connection", (socket) => {
    let userId: string | null = null;

    socket.on("user-online", (id: string) => {
      userId = id;
      onlineUsers[userId] = socket.id;
      io.emit("online-users", Object.keys(onlineUsers));
    });

    socket.on("disconnect", () => {
      if (userId && onlineUsers[userId] === socket.id) {    
        delete onlineUsers[userId];
        io.emit("online-users", Object.keys(onlineUsers));
      }
    });

    socket.on("editing-tasks", ({ taskId }) => {
      if (userId) {
        socket.broadcast.emit("editing-tasks", { taskId, userId });
      }
    });

    socket.on("stop-editing-task", ({ taskId }) => {
      if (userId) {
        socket.broadcast.emit("stop-editing-task", { taskId, userId });
      }
    });
  });
}