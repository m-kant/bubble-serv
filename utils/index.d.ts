declare namespace JsonServ {

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

  export interface ServParams {
    apiAbsRoot: string;
    
    apiRoot: string;
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
    extractPath: function|null;
    delay: number|null // network delay simulation - number or function
    mapError: function|null; // format error
    mapResult: function|null; // format response
  }
}
