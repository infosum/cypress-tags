import { defineConfig } from 'cypress';

import { tagify } from './dist';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', tagify(config));
    },
  },
});
