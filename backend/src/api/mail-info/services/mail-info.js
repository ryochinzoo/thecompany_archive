'use strict';

/**
 * mail-info service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mail-info.mail-info');
