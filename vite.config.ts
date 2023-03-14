/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { VitePWA } from 'vite-plugin-pwa'

import type { UserConfigExport as VitestUserConfigInterface } from 'vitest/config'

const vitestConfig: VitestUserConfigInterface = {
    test: {
        // vitest config, with helpful vitest typing :)
        globals: true,
        environment: 'happy-dom',
    },
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA({ registerType: 'autoUpdate' })],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    test: vitestConfig.test,
})
