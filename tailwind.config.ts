import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/utils/tailwind-class/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {},
	plugins: [],
};
export default config;
