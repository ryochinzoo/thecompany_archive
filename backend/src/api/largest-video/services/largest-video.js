'use strict';

/**
 * largest-video service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::largest-video.largest-video');
