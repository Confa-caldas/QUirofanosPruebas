//******************para produccion */

export const environment = {
  production: true,
};
export const _site = {
  recaptcha: {
    sitekey: "6LcH86UUAAAAAEE6Lj5a3l1Zpu5xqzr9YHfsiYG5",
    secretkey: "6LcH86UUAAAAACAiPlxX5oPwVCVbtXbZfcAN2z23",
  },
  url: "https://app.confa.co:8321/",
  confaUrl: "https://confa.co/",
};
const generalApi = "https://app.confa.co:8322";
export const api = {
  urlHealth: generalApi + "/citasMedicasWS/rest/",
  // rutas de produccion balanceador
  authConfa: "https://alojamiento.confa.co/ingresoConfaWSS/rest",
  acommodation: "https://alojamiento.confa.co/alojamientoWS/rest/alojamiento",
  // ------------------------------------------
  payments: generalApi + ":8876/pagosPasarelaWS/rest/pagos",
};
const eventsApi = "https://app.confa.co:8876";
export const pathEvents = {
  urlHealth: eventsApi + "/eventoConfaWSS/rest/evento",
};
export const parameters = {

  first: "ZTM4ZDcwNDRlODcyNzZDX0FQUCoyMDE4JA==",
  second: "QXBwX0NvbmZhODRkZGZiMzQxMjZmYzNhNDhl",
};

//******************* para test */
//  export const environment = {
//    production: true
//  };
//  export const _site = {
//    recaptcha: {
//      sitekey: '6LcH86UUAAAAAEE6Lj5a3l1Zpu5xqzr9YHfsiYG5',
//      secretkey: '6LcH86UUAAAAACAiPlxX5oPwVCVbtXbZfcAN2z23'
//    },
//    url: "https://app.confa.co:8323/",
//    confaUrl: "https://bvq.0bc.myftpupload.com/"
//  }
//  const generalApi = 'https://app.confa.co';
//  export const api = {
//    urlHealth: generalApi + ':8320/citasMedicasWS/rest/',
//    authConfa: generalApi + ':8687/ingresoConfaWSSpruebas/rest',
//    acommodation: generalApi + ':8687/alojamientoWS/rest/alojamiento',
//    payments: generalApi + ':8687/pagosPasarelaWS/rest/pagos'
//  }
//  const eventsApi = 'https://app.confa.co:8876';
//  export const pathEvents = {
//    urlHealth: eventsApi + '/eventoConfaWSS/rest/evento'
//  }
//  export const parameters = {
//    first: "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
//    second: "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND"
//  }
