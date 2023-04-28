"use strict";

const xss = require("xss");

const checkXSS = (cfg) => {
  if (typeof cfg === "object" && Object.keys(cfg).length > 0) {
    const config = JSON.stringify(cfg);
    const sanitizedConfig = xss(config);
    return JSON.parse(sanitizedConfig);
  }
  return xss(cfg);
};

module.exports = checkXSS;
