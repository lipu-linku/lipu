import { redirect } from "@sveltejs/kit";

export const load = async () => {
	redirect(301, `https://gatech.co1.qualtrics.com/jfe/form/SV_dhbb8EDjcSfp9CS`);
};
