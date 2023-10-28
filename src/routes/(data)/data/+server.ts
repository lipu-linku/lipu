import { json } from "@sveltejs/kit";

export const GET = async () => {
	const data = await fetch("https://linku.la/jasima/data.json").then((r) => r.json());

	return json(data);
};
