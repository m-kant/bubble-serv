const fs = require('fs');

/** calculates resolvedPath & pathParams in bubbleServ 
 * @param {request} req 
 * @returns {void} */
module.exports = function(req){
	const httpMethod = _extractHttpMethod(req);
	const requestedPath = req.bubbleServ.requestedPath;
	const requestedPathChunks = requestedPath.split(/[\/\\]/);
	const root = req.bubbleServ.apiAbsRoot;
	
	req.bubbleServ.pathParams = [];
	let remainingChunks = [...requestedPathChunks];
	let curPath;
	let resolvedScript = "";
	
	for(let i=0; i < requestedPathChunks.length; i++){
		curPath = remainingChunks.join("/");
		resolvedScript = findIncFile(root + curPath, httpMethod);
		
		if(resolvedScript){
			req.bubbleServ.resolvedScript = resolvedScript;
			return;
		} else {
			// move last path chunk from path to pathParams
			req.bubbleServ.pathParams.unshift( remainingChunks.pop() );
		}
	}
	
	// path wasn't resolved
	throw new Error(`Path "${req.method} ${req.bubbleServ.requestedPath}" wasn't resolved`);
};

function _extractHttpMethod(req) {
	let method;
	if (req.method === "OPTIONS") {
		method = req.header("Access-Control-Request-Method");
		return method ? method.toLowerCase() : 'get';
	}
	return req.method.toLowerCase();
};


function findIncFile(path, httpMethod){
	path = path.replace(/[\/\\]$/,""); // remove slash at the end
	
    let file = path + `/index.${httpMethod}.js`;
    if(fs.existsSync(file)) return file;

    file = path + `/index.${httpMethod}.json`;
    if(fs.existsSync(file)) return file;

    file = path + `.${httpMethod}.js`;
    if(fs.existsSync(file)) return file;

    file = path + `.${httpMethod}.json`;
    if(fs.existsSync(file)) return file;
	
    file = path + `/index.js`;
    if(fs.existsSync(file)) return file;

    file = path + `/index.json`;
    if(fs.existsSync(file)) return file;

    file = path + `.js`;
    if(fs.existsSync(file)) return file;

    file = path + `.json`;
    if(fs.existsSync(file)) return file;
	
	return null;
}