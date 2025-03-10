import "dotenv/config";

export const host = `http://${process.env.NEXT_PUBLIC_IP}:`;
export const port = process.env.NEXT_PUBLIC_PORT;

export const baseUrl = `${host}${port}/api/`;
