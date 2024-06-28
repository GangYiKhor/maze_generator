import { NextApiResponse } from "next";
import { N, S, checkWallBreak, pairEdges, randomiseArray } from "./utils";

export function generateMazeStreamServices(
	size: number,
	res: NextApiResponse
): void {
	// edge: [index, index, horizontal]
	const edges = pairEdges(size);
	randomiseArray(edges);

	const passed = new Set<number>();
	const regions: Set<number>[] = [];

	const encoder = new TextEncoder();
	while (edges.length > 0) {
		const edge = edges.pop();
		const wallBroke = breakWall(
			edge as [number, number, boolean],
			passed,
			regions,
			size
		);
		if (wallBroke) {
			res.write(encoder.encode(JSON.stringify(wallBroke) + ";"));
			res.uncork();
		}
	}

	const exit = [
		[[0, 0], N],
		[[size - 1, size - 1], S],
	];
	res.write(encoder.encode(JSON.stringify(exit) + ";"));
}

function breakWall(
	edge: [number, number, boolean],
	passed: Set<number>,
	regions: Set<number>[],
	size: number
) {
	const wallBroken = checkWallBreak(edge, passed, regions);
	if (wallBroken) {
		const returnArray = [];
		for (const [index, direction] of wallBroken) {
			returnArray.push([[Math.floor(index / size), index % size], direction]);
		}
		return returnArray;
	}
}
