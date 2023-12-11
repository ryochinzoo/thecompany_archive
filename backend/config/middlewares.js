module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  //'strapi::body',
  {
    name: "strapi::body",
    config: {
      formLimit: "1024mb", // modify form body
      jsonLimit: "1024mb", // modify JSON body
      textLimit: "1024mb", // modify text body
      formidable: {
        maxFileSize: 1200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
      settings: {
        cache: {
          enabled: true,
        }
      }
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
