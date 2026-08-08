import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  redirect(
    301,
    `https://docs.google.com/forms/d/e/1FAIpQLSevT-ypyq_yG_db7Kor9CIrq0clnY8KHzL7mpviBDMbz_3djw/viewform`,
  );
};

// tap
