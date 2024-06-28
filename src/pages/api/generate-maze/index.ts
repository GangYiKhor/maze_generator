import { NextApiRequest, NextApiResponse } from "next";
import { generateMazeServices } from "./generate-maze-services";

async function completeImageHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			const result = generateMazeServices(req);
			res.status(200).json(result);
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

export default completeImageHandler;
