// types/express-flash.d.ts
import { Request, Response, NextFunction } from 'express';
import {Server} from "socket.io";
declare module 'express-flash' {
  export default function flash(): (req: Request, res: Response, next: NextFunction) => void;
}

declare global {
  namespace Express {
    interface Request {
      flash(type: string, message: string): void; // Định nghĩa hàm flash
    }
  }
  var _io: Server;
}
