'use strict';

/**
 * happening service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::happening.happening');
