'use strict';

/**
 * dancer service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dancer.dancer');
