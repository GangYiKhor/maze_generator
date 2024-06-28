import { ThemeToggle } from "@/components/theme-toggle";
import { useStream } from "@/hooks/use-stream";
import { GreenButtonClass } from "@/utils/tailwind-class/buttons";
import {
	LabelLeftClass,
	TextBoxRightClass,
} from "@/utils/tailwind-class/inputs";
import { containerClass, layoutClass } from "@/utils/tailwind-class/layouts";
import clsx from "clsx";
import { ArrowBigDown } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useGet } from "../hooks/use-get";
import { GenerateMazeDto } from "../utils/dto/maze";
import { GenerateMazeResponse } from "../utils/responses/maze";

const cellClass = (border: boolean[]) =>
	clsx(
		"border-black",
		"dark:border-white",
		border[0] && "border-t-2",
		border[1] && "border-r-2",
		border[2] && "border-b-2",
		border[3] && "border-l-2",
		"w-6",
		"h-6"
	);
const minSize = 5;
const maxSize = 80;
const backendPath = "/api/generate-maze";

export default function Home() {
	const [size, setSize] = useState(10);
	const [stream, setStream] = useState(true);
	const [maze, setMaze] = useState<GenerateMazeResponse>();
	const [error, setError] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [mazeSize, setMazeSize] = useState(0);
	const getMaze = useGet<GenerateMazeDto, GenerateMazeResponse>(backendPath);
	const getMazeStream = useStream<GenerateMazeDto>(backendPath);

	const onChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
		setSize(parseInt(e.currentTarget.value));
		setError(false);
	};

	const onChangeStream = (e: ChangeEvent<HTMLInputElement>) => {
		setStream(e.currentTarget.checked);
	};

	const onClickGenerate = () => {
		setCompleted(false);
		if (size > maxSize) {
			setSize(maxSize);
			setMazeSize(maxSize);
			setError(true);
			generateMaze(maxSize);
		} else if (size < minSize) {
			setSize(minSize);
			setMazeSize(minSize);
			setError(true);
			generateMaze(minSize);
		} else {
			setMazeSize(size);
			setError(false);
			generateMaze(size);
		}
	};

	const streamUpdateMaze = (updates: [[number, number], number][]) => {
		for (const update of updates) {
			const [coord, direction] = update;
			setMaze((state) => {
				if (state?.board) {
					state.board[coord[0]][coord[1]][direction] = false;
					return { ...state };
				}
				return state;
			});
		}
	};

	const generateMaze = async (size: number) => {
		if (!stream) {
			const data = await getMaze({ size });
			setMaze(data);
			setCompleted(true);
		} else {
			const defaultValue = [true, true, true, true];
			const board: boolean[][][] = new Array(size)
				.fill(null)
				.map(() => new Array(size).fill(null).map(() => [...defaultValue]));
			setMaze({ board });
			getMazeStream(
				{ size, stream: true },
				streamUpdateMaze,
				() => setCompleted(true),
				20
			);
		}
	};

	return (
		<main className={layoutClass}>
			<div className={clsx(containerClass, "mx-4", "mt-6")}>
				<table>
					<thead>
						<tr>
							<td className="h-8">{completed ? <ArrowBigDown /> : null}</td>
						</tr>
					</thead>
					<tbody>
						{maze?.board.map((value, index) => (
							<tr key={`row-${index}` /* NOSONAR */}>
								{value.map((value, index) => (
									<td
										key={`col-${index}` /* NOSONAR */}
										className={cellClass(value)}
									>
										{" "}
									</td>
								))}
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={mazeSize} className="h-8">
								{completed ? (
									<div className="flex justify-end">
										<ArrowBigDown />
									</div>
								) : null}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div className={containerClass}>
				<label htmlFor="size" className={LabelLeftClass}>
					Maze Size:
				</label>

				<input
					id="size"
					type="number"
					min={minSize}
					max={maxSize}
					step={1}
					value={size}
					onChange={onChangeSize}
					className={TextBoxRightClass}
				/>

				<p
					className={clsx(
						"text-red-600",
						"font-bold",
						error ? "error" : "hidden"
					)}
				>
					Size must be between: {minSize} - {maxSize}
				</p>
			</div>

			<div className={containerClass}>
				<input
					id="stream"
					type="checkbox"
					checked={stream}
					onChange={onChangeStream}
					className={TextBoxRightClass}
				/>
				<label htmlFor="stream" className={LabelLeftClass}>
					View Generation Process
				</label>
			</div>

			<div className={containerClass}>
				<button className={GreenButtonClass} onClick={onClickGenerate}>
					Generate Maze
				</button>
			</div>

			<div className={containerClass}>
				<ThemeToggle />
			</div>
		</main>
	);
}
