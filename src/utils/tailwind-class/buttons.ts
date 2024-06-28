import clsx from "clsx";

export const DefaultButtonClass = clsx("hover:cursor-pointer", "select-none");
export const ButtonSmallClass = clsx("py-2", "px-4", "rounded-lg");

export const GreenButtonClass = clsx(
	"text-white",
	"bg-[rgb(25,135,84)]",
	"hover:bg-[rgb(21,115,71)]",
	"active:bg-[rgb(20,108,67)]",
	"hover:shadow-lg",
	"transition-colors",
	"duration-200",
	DefaultButtonClass,
	ButtonSmallClass
);
