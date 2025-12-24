const ENVIRONMENTS = process.env;

export const PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete'
}

const ADMIN_ACCESS = Object.values(PERMISSIONS);
const USER_ACCESS = [PERMISSIONS.READ, PERMISSIONS.UPDATE];


export const SERVER_CONFIG = {
  PORT: ENVIRONMENTS?.PORT ?? 8000,
  MONGO_URL: ENVIRONMENTS?.MONGOOSE_URL,
  SECRET_KEY: ENVIRONMENTS.SECRET_KEY,
  NODE_ENV: ENVIRONMENTS?.ENVIRONMENT ?? 'development',
  roles: {
    admin: {
      access: ADMIN_ACCESS,
    },
    user: {
      access: USER_ACCESS,
    },
  },

};
