import clsx from "clsx";

export const LabelLeftClass = clsx(
	"text-right",
	"py-1",
	"px-0.5",
	"ml-2",
	"mr-1"
);

export const TextBoxClass = clsx(
	"py-1",
	"px-2",
	"border-2",
	"border-gray-300",
	"hover:border-gray-500",
	"bg-gray-100",
	"focus:bg-white",
	"transition-[border-color]",
	"rounded-md"
);

export const TextBoxRightClass = clsx(TextBoxClass, "ml-1", "mr-2");
