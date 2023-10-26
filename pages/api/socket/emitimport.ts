import { NextApiResponseWithSocket } from "@/types";
import { NextApiRequest } from "next";
import { Server } from "socket.io";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  const io: Server = res?.socket?.server.io;

  if (req.method === "GET") {
    const { processed } = req.query;
    io.emit("import_progress", processed);
  }

  res.end();
}
