'use strict';

/**
 * happening router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::happening.happening');
