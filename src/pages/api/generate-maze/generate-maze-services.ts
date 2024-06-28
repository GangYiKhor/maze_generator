import { NextApiRequest } from "next";
import { GenerateMazeResponse } from "../../../utils/responses/maze";

const [N, E, S, W] = [0, 1, 2, 3];

export function generateMazeServices(
	request: NextApiRequest
): GenerateMazeResponse {
	const { size: sizeQuery } = request.query;
	const size = parseFloat(sizeQuery as string);

	if (isNaN(size)) {
		throw new TypeError();
	}

	// Create board as a sequence
	// Each element is an array of walls in 4 direction [true, true, true, true], [N, E, S, W]
	const defaultValue = [true, true, true, true];
	const boardSequence: boolean[][] = new Array(size * size)
		.fill(null)
		.map((value) => [...defaultValue]);

	// [index, index, horizontal]
	const edges = pairEdges(boardSequence, size);
	randomiseArray(edges);
	breakWalls(boardSequence, edges);

	const board = sequenceToGrid(boardSequence, size);

	// Break for entrance and exit
	board[0][0][N] = false;
	board[size - 1][size - 1][E] = false;

	return { board };
}

function pairEdges(array: any[], size: number) {
	// [index, index, horizontal]
	const edges: [number, number, boolean][] = [];
	for (let row = 0; row < array.length; row += size) {
		for (let col = row; col < row + size; col++) {
			// Horizontal edge
			if (col + 1 < row + size) {
				edges.push([col, col + 1, true]);
			}

			// Vertical edge
			if (row + size < array.length) {
				edges.push([col, col + size, false]);
			}
		}
	}
	return edges;
}

function randomiseArray(array: any[]) {
	// Randomise array
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function breakWalls(board: boolean[][], edges: [number, number, boolean][]) {
	const passed = new Set<number>();
	const regions: Set<number>[] = [];

	while (edges.length > 0) {
		const edge = edges.pop();
		if (!edge) {
			break;
		}
		const [elem1, elem2, horizontal] = edge;
		let wallBreaked = false;

		if (!passed.has(elem1) && !passed.has(elem2)) {
			passed.add(elem1);
			passed.add(elem2);
			regions.push(new Set<number>([elem1, elem2]));
			wallBreaked = true;
		} else if (passed.has(elem1) && passed.has(elem2)) {
			let elem1Region = -1;
			let elem2Region = -1;

			for (let i = 0; i < regions.length; i++) {
				if (regions[i].has(elem1)) {
					elem1Region = i;
				}
				if (regions[i].has(elem2)) {
					elem2Region = i;
				}
				if (elem1Region > -1 && elem2Region > -1) {
					break;
				}
			}

			if (elem1Region === elem2Region) {
				continue;
			} else {
				regions[elem1Region] = new Set([
					...Array.from(regions[elem1Region]),
					...Array.from(regions[elem2Region]),
				]);
				regions[elem2Region] = regions[regions.length - 1];
				regions.pop();
				wallBreaked = true;
			}
		} else {
			passed.add(elem1);
			passed.add(elem2);

			for (const region of regions) {
				if (region.has(elem1) || region.has(elem2)) {
					region.add(elem1);
					region.add(elem2);
					break;
				}
			}
			wallBreaked = true;
		}

		if (!wallBreaked) {
			continue;
		}

		if (horizontal) {
			board[elem1][E] = false;
			board[elem2][W] = false;
		} else {
			board[elem1][S] = false;
			board[elem2][N] = false;
		}
	}
}

function sequenceToGrid(board: boolean[][], size: number) {
	const grid: boolean[][][] = [];
	for (let row = 0; row < size * size; row += size) {
		const curRow: boolean[][] = [];
		for (let col = row; col < row + size; col++) {
			curRow.push(board[col]);
		}
		grid.push(curRow);
	}
	return grid;
}
