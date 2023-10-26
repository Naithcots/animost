"use client";
import { createContext, useContext, useEffect, useState } from "react";
import socketio, { Socket } from "socket.io-client";

interface SockerProviderProps {
  socket: Socket | null;
  isConnected: boolean;
}

const defaultValues: SockerProviderProps = {
  socket: null,
  isConnected: false,
};

const socketProviderContext = createContext(defaultValues);
export const useSocket = () => useContext(socketProviderContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const io = socketio(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);

    io.on("connect", () => {
      setSocket(io);
      setIsConnected(true);
    });

    io.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
    });
  }, []);

  return (
    <socketProviderContext.Provider value={{ socket, isConnected }}>
      {children}
    </socketProviderContext.Provider>
  );
};

export default socketProviderContext;
