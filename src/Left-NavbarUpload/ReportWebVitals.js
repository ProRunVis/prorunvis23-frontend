/**
 * Function to measure and report web-vital-values.
 * Important metrics for a good user experience.
 * @param {Function} onPerfEntry - A callback function that gets called to report measured performance.
 * */
const ReportWebVitals = onPerfEntry => {
  // Checks if callback function was provided and if it is a function.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Loads in web-vitals module dynamically
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Calls the different web-vitals-functions and passes on the callback function.
      // Cumulative Layout Shift (CLS) measures stability of the layout.
      getCLS(onPerfEntry);
      // First Input Delay (FID) measures the time it takes the application to react after provided user input.
      getFID(onPerfEntry);
      // First Contentful Paint (FCP) measures the time before the first sign of content is loaded in.
      getFCP(onPerfEntry);
      // Largest Contentful Paint (LCP) measures loading time of biggest content.
      getLCP(onPerfEntry);
      // Time to First Byte (TTFB) measures the time until the first byte is received.
      getTTFB(onPerfEntry);
    });
  }
};

export default ReportWebVitals; // Export reportWebVitals function.
