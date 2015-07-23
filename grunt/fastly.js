module.exports = {
  options: {
    key: '<%= secret.fastly_api_key %>'
  },

  production: {
    options: {
      purgeAll: true,
      serviceId: '<%= secret.fastly_service_id %>'
    }
  },

  staging: {
    options: {
      purgeAll: true,
      serviceId: '<%= secret.fastly_service_id %>'
    }
  }
};
