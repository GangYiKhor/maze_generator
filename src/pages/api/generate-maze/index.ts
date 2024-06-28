import { NextApiRequest, NextApiResponse } from "next";
import { generateMazeServices } from "./generate-maze-services";
import { generateMazeStreamServices } from "./generate-maze-stream-services";
import { parseQuery } from "./utils";

async function generateMazeHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			const size = parseQuery(req);
			if (req.query.stream === "true") {
				res.setHeader("Connection", "keep-alive");
				res.setHeader("Content-Encoding", "none");
				res.setHeader("Cache-Control", "no-cache, no-transform");
				res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
				generateMazeStreamServices(size, res);
				res.status(200).end();
			} else {
				const result = generateMazeServices(size);
				res.status(200).json(result);
			}
		} catch (err) {
			if (process.env.NODE_ENV === "development") {
				console.error(err);
			}
			if (err instanceof TypeError) {
				res.status(400).end();
			} else {
				res.status(500).end();
			}
		}
	} else {
		res.status(405).end();
	}
}

export default generateMazeHandler;
