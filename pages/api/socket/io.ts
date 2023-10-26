import { NextApiResponseWithSocket } from "@/types";
import { NextApiRequest } from "next";
import { Server } from "socket.io";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket?.server?.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Client connected ", socket.id);
    });

    io.on("disconnect", (socket) => {
      console.log("Client disconnected ", socket.id);
    });

    res.socket.server.io = io;
  }
  res.end();
}
