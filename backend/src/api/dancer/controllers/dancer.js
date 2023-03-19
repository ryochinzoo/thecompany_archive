'use strict';

/**
 *  dancer controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::dancer.dancer');
