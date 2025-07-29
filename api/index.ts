import { createServer } from "../server/index";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const server = createServer();

export default (req: VercelRequest, res: VercelResponse) => {
  return server(req, res);
};
