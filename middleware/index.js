/*
 * Middleware factory
 *
 * {urlParams, bodyParams, pathParams}
 */
const url = require("url");
const chalk = require("chalk");
const numerize = require("./numerize");

const ProjRoot = process.cwd() + "/";
// const setCorsHeaders = require("./utils/set-cors-headers");
const resolvePath = require("./resolve-path");

function JservFactory(options){
	options = Object.assign({
		numerizeGetParams: false,
		numerizePathParams: false,
		traceLabel: "BUBBLE SERV",
		traceScriptResolving: false,
		apiRoot: "./", // relative to project root for API files
		extractPath: null,
		mapError: null, // format error
		mapResult: null, // format response
	}, options);

	const apiRoot    = options.apiRoot;
	const apiAbsRoot = ProjRoot + options.apiRoot;


	return function(req, res, next){
		try {
			// if (options.cors) { setCorsHeaders(req, res); }

			// precalculate some server params
			req.bubbleServ = {apiRoot, apiAbsRoot};
			req.bubbleServ.queryParams = options.numerizeGetParams? numerize(req.query) : req.query;
			req.bubbleServ.parsedUrl = url.parse(req.url);
			if (req.body) req.bubbleServ.bodyParams = req.body; // proxy parsed body to bubbleServ obj

			if (options.traceLabel) console.log(chalk.blue(options.traceLabel + ` ${req.method}: <- ${req.bubbleServ.parsedUrl.href}`));

			// path to script fetched from request
			req.bubbleServ.requestedPath = options.extractPath ? options.extractPath(req) : _extractPath(req);
			// resolve abs path to script and fetch path params
			resolvePath(req, options);
			if (options.numerizePathParams) req.bubbleServ.pathParams = numerize(req.bubbleServ.pathParams);
			if (options.traceLabel) console.log(chalk.gray(options.traceLabel + ` ${req.method} RESOLVED TO: ${req.bubbleServ.resolvedScript}`));

			// calculate result
			const apiMethod = require(req.bubbleServ.resolvedScript);
			req.bubbleServ.result = typeof apiMethod === "function" ?
				apiMethod(req.bubbleServ, req, res) :
				apiMethod;

			// format response
			let response = typeof options.mapResult === "function" ?
				options.mapResult(req.bubbleServ.result, req, res) :
				req.bubbleServ.result;
			if(typeof response !== "string") response = JSON.stringify(response);

			res.send( response );
			if (options.traceLabel) {
				let maxLength = 200;
				let respStr = String(response);
				if (respStr.length > maxLength + 20) respStr = respStr.substr(0, maxLength) + ` ... +${respStr.length - maxLength} chars` ;
				console.log(chalk.green(options.traceLabel + ` ${req.method}: -> ${respStr}`));
			}

		} catch(e) {
			// if(!options.cors || req.method !== "OPTIONS") res.status( e.httpStatus || 500 );
			// format error
			let response = typeof options.mapError === "function" ?
				options.mapError(e, req, res) :
				{error: e.name, message: e.message};
			if(typeof response !== "string") response = JSON.stringify(response);

			res.send( response );
			if(options.traceLabel) console.error(chalk.red(options.traceLabel + ` ERROR: -> ${e.message}`, `FOR REQUEST: ${decodeURI(req.url)}`));
		}

		next();
	}
}

function _extractPath(req){
	let path = req.bubbleServ.parsedUrl.pathname;
	if(!path) throw new Error("Can not extract path from request");

	return path.replace(/[\/\\]$/,"");
}



module.exports = JservFactory;


