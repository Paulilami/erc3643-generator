import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@contracts': path.resolve(__dirname, '../artifacts/contracts'),
            '@typechain': path.resolve(__dirname, '../typechain-types'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    define: {
        'process.env': {},
    },
});
