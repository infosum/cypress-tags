import { defineConfig } from 'cypress';

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
import { tagify } from './dist';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', tagify(config));
    },
  },
});
