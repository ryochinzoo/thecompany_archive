'use strict';

/**
 * dancer router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::dancer.dancer');
