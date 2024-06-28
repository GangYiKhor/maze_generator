import { NextApiRequest } from "next";

export const [N, E, S, W] = [0, 1, 2, 3];

export function parseQuery(req: NextApiRequest) {
	const { size: sizeQuery } = req.query;
	const size = parseFloat(sizeQuery as string);

	if (isNaN(size)) {
		throw new TypeError();
	}

	return size;
}

export function pairEdges(size: number) {
	// [index, index, horizontal]
	const edges: [number, number, boolean][] = [];
	for (let row = 0; row < size * size; row += size) {
		for (let col = row; col < row + size; col++) {
			// Horizontal edge
			if (col + 1 < row + size) {
				edges.push([col, col + 1, true]);
			}

			// Vertical edge
			if (row + size < size * size) {
				edges.push([col, col + size, false]);
			}
		}
	}
	return edges;
}

export function randomiseArray(array: any[]) {
	// Randomise array
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export function checkWallBreak(
	edge: [number, number, boolean],
	passed: Set<number>,
	regions: Set<number>[]
): [number, number][] | undefined {
	const [elem1, elem2, horizontal] = edge;
	let wallBreaked = false;

	// If two cell is not connected, break the wall
	// If two cell is connected, do nothing
	// This ensure that every two cell connected with one and only one path
	if (!passed.has(elem1) && !passed.has(elem2)) {
		regions.push(new Set<number>([elem1, elem2]));
		wallBreaked = true;
	} else if (passed.has(elem1) && passed.has(elem2)) {
		let [elem1Region, elem2Region] = findRegionIndex(regions, elem1, elem2);

		if (elem1Region === elem2Region) {
			return;
		}

		// Combine region
		regions[elem1Region] = new Set([
			...Array.from(regions[elem1Region]),
			...Array.from(regions[elem2Region]),
		]);
		regions[elem2Region] = regions[regions.length - 1];
		regions.pop();
		wallBreaked = true;
	} else {
		addToRegion(regions, elem1, elem2);
		wallBreaked = true;
	}

	passed.add(elem1);
	passed.add(elem2);

	if (!wallBreaked) {
		return;
	}

	if (horizontal) {
		return [
			[elem1, E],
			[elem2, W],
		];
	} else {
		return [
			[elem1, S],
			[elem2, N],
		];
	}
}

export function findRegionIndex(
	regions: Set<number>[],
	elem1: number,
	elem2: number
) {
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

	return [elem1Region, elem2Region];
}

export function addToRegion(
	regions: Set<number>[],
	elem1: number,
	elem2: number
) {
	for (const region of regions) {
		if (region.has(elem1) || region.has(elem2)) {
			region.add(elem1);
			region.add(elem2);
			break;
		}
	}
}

export function sequenceToGrid(board: boolean[][], size: number) {
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
