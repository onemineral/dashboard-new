import path from "path"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    [
                        'formatjs',
                        {
                            idInterpolationPattern: '[sha512:contenthash:base64:6]',
                            ast: true,
                        },
                    ],
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@sdk": path.resolve(__dirname, "./sdk/js-sdk/src")
        },
    },
    server: {
        port: 3000,
        allowedHosts: true
    }
})