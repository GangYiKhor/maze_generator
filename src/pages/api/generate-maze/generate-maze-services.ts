import { GenerateMazeResponse } from "../../../utils/responses/maze";
import {
	N,
	S,
	checkWallBreak,
	pairEdges,
	randomiseArray,
	sequenceToGrid,
} from "./utils";

export function generateMazeServices(size: number): GenerateMazeResponse {
	// Create board as a sequence
	// Each element is an array of walls in 4 direction [true, true, true, true], [N, E, S, W]
	const defaultValue = [true, true, true, true];
	const boardSequence: boolean[][] = new Array(size * size)
		.fill(null)
		.map(() => [...defaultValue]);

	// edge: [index, index, horizontal]
	const edges = pairEdges(size);
	randomiseArray(edges);

	const passed = new Set<number>();
	const regions: Set<number>[] = [];
	while (edges.length > 0) {
		breakWallDirectly(
			boardSequence,
			edges.pop() as [number, number, boolean],
			passed,
			regions
		);
	}

	const board = sequenceToGrid(boardSequence, size);

	// Break for entrance and exit
	board[0][0][N] = false;
	board[size - 1][size - 1][S] = false;

	return { board };
}

function breakWallDirectly(
	board: boolean[][],
	edge: [number, number, boolean],
	passed: Set<number>,
	regions: Set<number>[]
) {
	const wallBroken = checkWallBreak(edge, passed, regions);
	if (wallBroken) {
		for (const [index, direction] of wallBroken) {
			board[index][direction] = false;
		}
	}
}
