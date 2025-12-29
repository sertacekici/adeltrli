const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const { BANAME, BAPASS, NGUSERCODE, NGPASSWORD, NGMSGHEADER } = process.env;

assert(BANAME, "BANAME is required");
assert(BAPASS, "BANAME is required");
assert(NGUSERCODE, "NGUSERCODE is required");
assert(NGPASSWORD, "NGPASSWORD is required");
assert(NGMSGHEADER, "NGMSGHEADER is required");

module.exports = {
  baname: BANAME,
  bapass: BAPASS,
  usercode: NGUSERCODE,
  userpass: NGPASSWORD,
  msgheader: NGMSGHEADER,
};
