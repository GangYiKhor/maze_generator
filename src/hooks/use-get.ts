import axios, { AxiosResponse } from "axios";

export function useGet<T = any, Res = any>(url: string) {
	return async (
		params?: T,
		path?: string | number
	): Promise<Res | undefined> => {
		try {
			let curUrl = url;

			if (path) {
				if (curUrl.endsWith("/")) {
					curUrl += path;
				} else {
					curUrl += "/" + path;
				}
			}

			const { data, status } = await axios.get<T, AxiosResponse<Res>>(curUrl, {
				params,
			});

			if (status === 400) {
				console.error("Invalid Request!");
			} else if (status === 405) {
				console.error("Get Request Not Expected!");
			} else {
				return data;
			}

			return undefined;
		} catch (err) {
			console.error("Unknown Error occured");
			return undefined;
		}
	};
}
