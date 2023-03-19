module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'c7575b551b68d5e142e281b5048adc03'),
  },
});
