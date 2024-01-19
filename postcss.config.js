import tailwindcss from "tailwindcss";
import tailwindNesting from "tailwindcss/nesting/index.js";

export default {
	plugins: [tailwindNesting("postcss-nesting"), tailwindcss()],
};
