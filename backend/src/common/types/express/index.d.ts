import { JwtPayload } from "../../types/interfaces/jwt-payload.interface";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
