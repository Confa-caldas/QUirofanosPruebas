// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};
export const _site = {
  recaptcha: {
    sitekey: "6LcH86UUAAAAAEE6Lj5a3l1Zpu5xqzr9YHfsiYG5",
    secretkey: "6LcH86UUAAAAACAiPlxX5oPwVCVbtXbZfcAN2z23",
  },
  url: "https://app.confa.co:8323/",

  confaUrl: "https://confa.co/",
};

//const generalApi = "https://alojamiento.confa.co";
//const generalApi = "http://localhost:8080";
const generalApi = "https://app.confa.co:8687";
const apiIngresoConfa = "https://app.confa.co";
export const api = {
  urlHealth: generalApi + "/citasMedicasWS/rest/",
  authConfa: apiIngresoConfa + ":8687/ingresoConfaWSSpruebas/rest",
  acommodation: generalApi + ":8687/alojamientoWS/rest/alojamiento",
  //prueba:'https://alojamiento.confa.co/ingresoConfaWSS/rest',

  // nodo prueba
  // authConfa:  'https://10.130.48.174:28181/ingresoConfaWSS/rest',
  // acommodation: 'https://10.130.48.174:28181/alojamientoWS/rest/alojamiento',

  payments: generalApi + ":8687/pagosPasarelaWS/rest/pagos",
};
const eventsApi = "https://app.confa.co:8687";
export const pathEvents = {
  urlHealth: eventsApi + "/CineConfaWS/rest/evento",
};
export const parameters = {
  first: "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
  second: "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
