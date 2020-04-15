declare namespace BubbleServ {

  export interface Context {
    apiAbsRoot: string;

    apiRoot: string; // relative to project root for API files
    bodyParams: object;
    parsedUrl: ParsedUrl;
    pathParams: string[];
    queryParams: string | object;
    requestedPath: string;
    resolvedScript: string;
    result: any;
  }

  export interface options {
    traceLabel: string;
    apiRoot: string
    delay: number|null; // network delay simulation - number or function
    // extractPath: function|null;
    // mapError: function|null; // format error
    // mapResult: function|null; // format response
  }

  export interface ParsedUrl {
    protocol?: string;
    slashes?: string;
    auth?: string;
    host?: string;
    port?: string;
    hostname?: string;
    hash?: string;
    search: string;
    query: string;
    pathname: string;
    path: string;
    href: string;
  }

}
