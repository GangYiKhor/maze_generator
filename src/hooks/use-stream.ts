import axios, { AxiosResponse } from "axios";

export function useStream<T = any>(url: string) {
	const headers = { Accept: "text/event-stream" };
	const responseType = "stream";
	const adapter = "fetch";

	return async (
		params?: T,
		cb?: CallableFunction,
		completeCb?: CallableFunction,
		delay = 5
	) => {
		const { data: stream } = await axios.get<T, AxiosResponse<ReadableStream>>(
			url,
			{ headers, responseType, adapter, params }
		);

		const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
		let leftover = "";

		while (true) {
			let { value, done } = await reader.read();
			if (done) {
				break;
			}

			// Leftover is used to handle situations where backend is forced to flush
			// incomplete data due to full buffer
			value = leftover + value;
			leftover = "";
			const values = value.split(";");
			if (values?.[values.length - 1]) {
				leftover = values.pop() ?? "";
			}

			for (const value of values) {
				value && cb?.(JSON.parse(value));
			}

			// Just to slow down for better visual
			await new Promise((r) => setTimeout(r, delay));
		}
		completeCb?.();
	};
}
