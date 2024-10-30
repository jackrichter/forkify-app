import { TIMEOUT_SEC } from "./config.js";

// Use this to race with fetch. Whichever resolves first wins. Thus, ensuring a time out if fetch takes too long
const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

export const getJSON = async function (url) {
	try {
		const fetchRequest = fetch(url);

		const res = await Promise.race([fetchRequest, timeout(TIMEOUT_SEC)]);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

		return data;
		// End try
	} catch (err) {
		throw err;
	}
};

// POST request with 'fetch'
export const sendJSON = async function (url, uploadData) {
	try {
		const fetchRequest = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(uploadData)
		});

		const res = await Promise.race([fetchRequest, timeout(TIMEOUT_SEC)]);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

		return data;
		// End try
	} catch (err) {
		throw err;
	}
};
