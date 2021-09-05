// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED = Boolean(process.env.DEBUG_INFO_ENABLED);
export const SERVER_API_URL = process.env.SERVER_API_URL ?? '';
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;
export const SALT = window.crypto.getRandomValues(new Uint8Array(16));
export const IV = window.crypto.getRandomValues(new Uint8Array(12));
export const MASTER_SECRET = "cGFzc3dvcmQxMjMkJA=="; // TODO need to replace with user password

