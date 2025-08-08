export const API_URLS = {
  LOGIN: {
    POST_LOGIN: 'api/login/',
    POST_FORGOT_PASSWORD: 'api/forgot-password/',
    POST_REGISTRATION: 'api/register/',
  },

  USERS: {
    GET_USERS: 'api/users/',
    PATCH_USER_BY_UUID: uuid => `api/users/${uuid}/status/`,
  },

  ROLES: {
    GET_ROLES: 'api/roles/',
  },

  HR: {
    POST_HR: 'api/hr/',
    GET_HR: 'api/hr/',
    PATCH_HR: id => `api/hr/${id}/`,
    DELETE_HR: id => `api/hr/${id}/`,
  },

  PERSONAL_DETAILS: {
    POST_PERSONAL_DETAILS: '/api/personal-details/create/',
    PATCH_PERSONAL_DETAILS: uuid => `api/personal-details/${uuid}/`,
    GET_PERSONAL_DETAILS: uuid => `api/personal-details/${uuid}/`,
  },

  ONBOARDING: {
    GET_ONBOARDING_APPLICATIONS: 'api/onboarding-applications/',
  },

  RESIGNATION: {
    GET_RESIGNATIONS: 'api/resignation/user/',
    GET_RESIGNATIONS_BY_UUID:uuid=>`api/resignations/user/${uuid}/`,
    DELETE_RESIGNATION_BY_UUID: uuid => `api/resignation/${uuid}/delete/`,
    RESIGNATION_STATUS_UPDATE_BY_UUID: uuid =>
      `api/resignation/${uuid}/status/`,
  },
};
