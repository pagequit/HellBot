export type HttpJsonOk = {
  data: unknown;
};

export type HttpJsonError = {
  errors: unknown[];
};

export type HttpJsonResponse = HttpJsonOk | HttpJsonError;
