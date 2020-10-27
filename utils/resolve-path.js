const fs = require("fs");
const path = require("path");

let localOptions;

/** calculates resolvedPath & pathParams in bubbleServ
 * @param {request} req
 * @returns {void} */
module.exports = function (req, options) {
  localOptions = options;
  const httpMethod = _extractHttpMethod(req);
  const requestedPath = req.bubbleServ.requestedPath;
  const requestedPathChunks = requestedPath.split(/[\/\\]/);
  const root = req.bubbleServ.apiAbsRoot;

  req.bubbleServ.pathParams = [];
  let remainingChunks = [...requestedPathChunks];
  let curPath;
  let resolvedScript = "";

  for (let i = 0; i < requestedPathChunks.length; i++) {
    curPath = remainingChunks.join("/");
    resolvedScript = findIncFile(root + curPath, httpMethod, options);

    if (resolvedScript) {
      req.bubbleServ.resolvedScript = resolvedScript;
      return;
    } else {
      // move last basePath chunk from basePath to pathParams
      req.bubbleServ.pathParams.unshift(remainingChunks.pop());
    }
  }

  // basePath wasn't resolved
  throw new Error(`Path "${req.method} ${req.bubbleServ.requestedPath}" wasn't resolved`);
};

function _extractHttpMethod(req) {
  let method;
  if (req.method === "OPTIONS") {
    method = req.header("Access-Control-Request-Method");
    return method ? method.toLowerCase() : "get";
  }
  return req.method.toLowerCase();
}

function findIncFile(basePath, httpMethod, options) {
  basePath = basePath.replace(/[\/\\]$/, ""); // remove slash at the end

  let file = path.resolve(`${basePath}/index.${httpMethod}.js`);
  trace(file);
  if (fs.existsSync(file)) return file;

  file = path.resolve(`${basePath}/index.${httpMethod}.json`);
  trace(file);
  if (fs.existsSync(file)) return file;

  file = path.resolve(`${basePath}.${httpMethod}.js`);
  trace(file);
  if (fs.existsSync(file)) return file;

  file = path.resolve(`${basePath}.${httpMethod}.json`);
  trace(file);
  if (fs.existsSync(file)) return file;

  file = path.resolve(`${basePath}/index.js`);
  trace(file);
  if (fs.existsSync(file)) return file;

  file = path.resolve(`${basePath}/index.json`);
  trace(file);
  if (fs.existsSync(file)) return file;

  file = path.resolve(`${basePath}.js`);
  trace(file);
  if (fs.existsSync(file)) return file;

  file = path.resolve(`${basePath}.json`);
  trace(file);
  if (fs.existsSync(file)) return file;

  return null;
}

function trace(file, options) {
  if (!localOptions.traceLabel) return;
  if (!localOptions.traceScriptResolving) return;
  console.log(localOptions.traceLabel + " CHECKING FILE: " + file);
}
