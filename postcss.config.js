import tailwindcss from "tailwindcss";
import tailwindNesting from "tailwindcss/nesting";

export default {
	plugins: [tailwindNesting("postcss-nesting"), tailwindcss()],
};
