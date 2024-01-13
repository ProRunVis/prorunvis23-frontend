/**
 * Funktion zum Messen und Berichten von Web-Vitalwerten.
 * Web-Vitals sind wichtige Metriken für eine gute Nutzererfahrung im Web.
 *
 * @param {Function} onPerfEntry - Eine Callback-Funktion, die aufgerufen wird, um Leistungseinträge zu melden.
 */
const reportWebVitals = onPerfEntry => {
  // Überprüft, ob eine Callback-Funktion bereitgestellt wurde und ob es sich um eine Funktion handelt.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Lädt das Modul 'web-vitals' dynamisch.
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Ruft die verschiedenen Web-Vitals-Funktionen auf und übergibt die Callback-Funktion.
      // Diese Funktionen messen unterschiedliche Leistungsaspekte der Anwendung:
      getCLS(onPerfEntry); // Cumulative Layout Shift (CLS) misst die Stabilität des Layouts.
      getFID(onPerfEntry); // First Input Delay (FID) misst die Reaktionsfähigkeit auf Benutzerinteraktionen.
      getFCP(onPerfEntry); // First Contentful Paint (FCP) misst die Zeit bis zum ersten Zeichen des Inhalts.
      getLCP(onPerfEntry); // Largest Contentful Paint (LCP) misst die Ladezeit des größten Inhalts.
      getTTFB(onPerfEntry); // Time to First Byte (TTFB) misst die Zeit bis zum ersten empfangenen Byte.
    });
  }
};

export default reportWebVitals; // Exportiert die reportWebVitals Funktion.
