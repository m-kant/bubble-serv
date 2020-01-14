# bubble-serv

Express middleware for fast prototyping JSON server (JSON-based REST api). Mainly intended for mock servers, tests, prototypes.

Just put `authorized.json` file into `user/` folder, and you will get `user/authorized` method in your API wich returns content of file. Add `authorized.post.json` for separate response on POST request. You can use `.js` instead of `.json` for more complex response, if you want take into consideration query params, body content or path params.

## Installation

```Bash
npm install bubble-serv
```

## Usage

```JavaScript
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // is not a part of this bundle
var bubbleServ = require("bubble-serv");

app.use(bodyParser.json());

app.use( bubbleServ({apiRoot: "api-files",}) );

// start server
app.listen(3000);
```

Put file `info.json` into `api-files/` folder. Open with browser URI: `localhost:3000/info` - you will get content of `info.json`.

## POST, PUT, etc

Add prefix to file extension with http method name in lower case, and file will be served only for this http method. `info.post.json` will be served only to `POST localhost:3000/info`. Files without http-method prefix are used to any kind of http methods.

## Resolving file path

When bubble-serv gets request `POST user/info` it try to find file by following sequence:

1. `user/info/index.post.js`
1. `user/info/index.post.json`
1. `user/info.post.js`
1. `user/info.post.json`
1. `user/info/index.js`
1. `user/info/index.json`
1. `user/info.js`
1. `user/info.json`

## Bubbling

If nothing is found it bubbles up in folder tree. It creates path param `"info"` and goes up to folder `user/`, trying to find `user/index.post.js` with regular algorythm, etc.

Thus, if we have one file `index.js` in folder `user`, all request like `user/id/some-params/and-more` will be delegated to this `user/index.js`. Bubble-serv generates `pathParams` for it: `["id", "some-params", "and-more"]`.

## Using .js file to handle params. Context

To handle request parameters you have to export callback function from your .js file, for example `user/index.js`:

```JavaScript
module.exports = function(context, request, response){
    return JSON.stringify({...context});
}
```

`request` and `response` are regular express request/response objects. In `request` object `bubbleServ` property contains `context` data, which is used as a first argument for callback.

## Context

Context is an object with data, useful to handle request:

<table>
    <tr>
        <td>queryParams</td>
        <td>string|object</td>
        <td>Parsed query params - url encoded params after "?" sign</td>
    </tr>
    <tr>
        <td>bodyParams</td>
        <td>object</td>
        <td>If <a href="https://www.npmjs.com/package/body-parser">body-parser</a> middleware is installed, request.body property will be copied here</td>
    </tr>
    <tr>
        <td>pathParams</td>
        <td>string[]</td>
        <td>Array of folder names generated during bubblind. If you have "user/index.js" file and request was "user/10/address/city". pathParams = ["10", "address", "city"] for file "user/index.js".</td>
    </tr>
</table>

Some additional data:

<table>
    <tr>
        <td>apiRoot</td>
        <td>string</td>
        <td>Folder name with API files, according to express project root</td>
    </tr>
    <tr>
        <td>apiAbsRoot</td>
        <td>string</td>
        <td>Absolute path to API root</td>
    </tr>
    <tr>
        <td>parsedUrl</td>
        <td>ParsedUrl</td>
        <td>
            {
                protocol,
                slashes,
                auth,
                host,
                port,
                hostname,
                hash,
                search,
                query,
                pathname,
                path,
                href
            }
        </td>
    </tr>
    <tr>
        <td>requestedPath</td>
        <td>string</td>
        <td></td>
    </tr>
    <tr>
        <td>resolvedScript</td>
        <td>string</td>
        <td>Absolute path to script which is resolved to handle current request (current file absolute path)</td>
    </tr>
</table>

## Options

<table>
    <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>apiRoot</td>
        <td>string</td>
        <td>"./"</td>
        <td>Folder name with API files, according to express project root</td>
    </tr>
    <tr>
        <td>traceLabel</td>
        <td>string</td>
        <td>"BUBBLE&nbsp;SERV"</td>
        <td>Prefix for console messages. If NULL or empty string, no messages will be printed to console</td>
    </tr>
    <tr>
        <td>extractPath</td>
        <td>function(req) => string</td>
        <td>null</td>
        <td>Must return string - path to api method. If Null - URI path will be taken. Can be useful if RPC is used instead of REST</td>
    </tr>
    <!-- <tr>
        <td>delay</td>
        <td>number|null</td>
        <td>null</td>
        <td>network delay simulation - number or function</td>
    </tr> -->
    <tr>
        <td>mapError</td>
        <td>function(error, req, res) => any</td>
        <td>null</td>
        <td>Format error function. Default error format is: {error: string, message: string}</td>
    </tr>
    <tr>
        <td>mapResult:</td>
        <td>function(result, req, res)</td>
        <td>null</td>
        <td>Format response function. Default is pure result (content of file) in JSON format. Useful for common wrappers, transports as JSON-RPC 2.0 wrapper</td>
    </tr>
</table>
