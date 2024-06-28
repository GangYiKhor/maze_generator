import { GreenButtonClass } from "@/utils/tailwind-class/buttons";
import {
	LabelLeftClass,
	TextBoxRightClass,
} from "@/utils/tailwind-class/inputs";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { useGet } from "../hooks/use-get";
import { GenerateMazeDto } from "../utils/dto/maze";
import { GenerateMazeResponse } from "../utils/responses/maze";

const layoutClass = clsx("flex", "flex-col", "gap-4");
const containerClass = clsx("w-full", "flex", "justify-center");
const cellClass = (border: boolean[]) =>
	clsx(
		"border-black",
		border[0] && "border-t-2",
		border[1] && "border-r-2",
		border[2] && "border-b-2",
		border[3] && "border-l-2",
		"w-6",
		"h-6"
	);
const maxSize = 70;

export default function Home() {
	const [size, setSize] = useState(10);
	const [maze, setMaze] = useState<GenerateMazeResponse>();
	const getMaze = useGet<GenerateMazeDto, GenerateMazeResponse>(
		"/api/generate-maze"
	);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSize(parseInt(e.currentTarget.value));
	};

	const onClick = () => {
		if (size > maxSize) {
			setSize(maxSize);
			generateMaze(maxSize);
		}
		generateMaze(size);
	};

	const generateMaze = async (size: number) => {
		const data = await getMaze({ size });
		setMaze(data);
	};

	return (
		<main className={layoutClass}>
			<div className={clsx(containerClass, "mx-4", "mt-6")}>
				<table className="">
					{maze?.board.map((value, index) => (
						<tr key={`row-${index}`}>
							{value.map((value, index) => (
								<td key={`col-${index}`} className={cellClass(value)}>
									{" "}
								</td>
							))}
						</tr>
					))}
				</table>
			</div>
			<div className={containerClass}>
				<div>
					<label htmlFor="size" className={LabelLeftClass}>
						Maze Size:
					</label>
					<input
						id="size"
						type="number"
						min={3}
						max={100}
						step={1}
						value={size}
						onChange={onChange}
						className={TextBoxRightClass}
					/>
				</div>
			</div>

			<div className={containerClass}>
				<button className={GreenButtonClass} onClick={onClick}>
					Generate Maze
				</button>
			</div>
		</main>
	);
}
