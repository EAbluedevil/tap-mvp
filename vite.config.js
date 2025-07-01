// © 2025 Waking Digital Solutions. All rights reserved.
// This source code is proprietary and confidential.
// Unauthorized copying, distribution, modification, or use is strictly prohibited.

// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
  '/api': 'http://localhost:3000',
},
  },
});