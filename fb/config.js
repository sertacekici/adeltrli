const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const {
  BANAME,
  BAPASS,
  NGUSERCODE,
  NGPASSWORD,
  NGMSGHEADER,
  JWT_SECRET,
  SERVICESTATUS,
  GATEWAY_USERNAME,
  GATEWAY_PASSWORD,
} = process.env;

assert(BANAME, "BANAME is not defined");
assert(BAPASS, "BAPASS is not defined");
assert(NGUSERCODE, "NGUSERCODE is not defined");
assert(NGPASSWORD, "NGPASSWORD is not defined");
assert(NGMSGHEADER, "NGMSGHEADER is not defined");
assert(JWT_SECRET, "JWT_SECRET is not defined");
assert(SERVICESTATUS, "SERVICESTATUS is not defined");
assert(GATEWAY_USERNAME, "GATEWAY_USERNAME is not defined");
assert(GATEWAY_PASSWORD, "GATEWAY_PASSWORD is not defined");

module.exports = {
  baname: BANAME,
  bapass: BAPASS,
  usercode: NGUSERCODE,
  userpass: NGPASSWORD,
  msgheader: NGMSGHEADER,
  jwtp: JWT_SECRET,
  serviceStatus: SERVICESTATUS,
  gatewayUsername: GATEWAY_USERNAME,
  gatewayPassword: GATEWAY_PASSWORD,
};
