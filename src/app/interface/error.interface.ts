export type TErrorSources = {
  field: number | string;
  message: string;
}[];

export type TgenericRerrorResponse = {
  statusCode: number;
  message: string;
  errorDetails: TErrorSources;
};
