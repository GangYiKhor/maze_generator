import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<React.Fragment>
			<Head>
				<title>Maze Generator</title>
			</Head>
			<body>
				<Component {...pageProps} />
			</body>
		</React.Fragment>
	);
}

export default MyApp;
