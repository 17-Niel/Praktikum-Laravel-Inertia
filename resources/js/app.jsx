import '../css/app.css';
import './bootstrap';

// Import Trix
import 'trix/dist/trix.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
    const page = pages[`./pages/${name}.jsx`];
    
    // // Debugging: log untuk memastikan module ditemukan
    // console.log('Resolving page:', name, page);
    
    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }
    
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});