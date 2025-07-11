import { Server } from "socket.io";

let onlineUsers: { [userId: string]: { socketId:string;email:string } } = {};

export function initSocketIO(io: Server) {
  io.on("connection", (socket) => {
    let userId: string | null = null;

    socket.on("user-online", ({userId:id,email}:{userId:string;email:string}) => {
      userId = id;
      if (userId) {
        onlineUsers[userId] = { socketId: socket.id, email };
        io.emit("online-users", Object.entries(onlineUsers).map(([userId, { email }]) => ({
          userId,
          email,
        }))
       )
      }
     }
  );

    socket.on("disconnect", () => {
      if (userId && onlineUsers[userId]?.socketId === socket.id) {    
        delete onlineUsers[userId];
        io.emit("online-users", Object.entries(onlineUsers).map(([userId,{email}]) => ({
          userId,
          email,
        }))
      );
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