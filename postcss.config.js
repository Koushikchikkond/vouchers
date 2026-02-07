export default {
    plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {}, // Autoprefixer is optional in v4 often, but good to keep? v4 handles prefixing mostly. But docs say create postcss config with @tailwindcss/postcss.
    },
}
