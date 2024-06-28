import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider attribute="class">
			<Head>
				<title>Maze Generator</title>
				<link rel="icon" href="./icon.ico" />
			</Head>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
