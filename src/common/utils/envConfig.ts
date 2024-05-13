import dotenv from 'dotenv';
import { CleanedEnv, cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export type Config = CleanedEnv<any> & {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  CORS_ORIGIN: string;
  COMMON_RATE_LIMIT_MAX_REQUESTS: number;
  COMMON_RATE_LIMIT_WINDOW_MS: number;
  ETHERSCAN_IO_API_KEY: string;
  ETHERSCAN_IO_LIST_TOKENS_OFFSET: number;
};

export const env: Config = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  ETHERSCAN_IO_API_KEY: str({ devDefault: testOnly('') }),
  ETHERSCAN_IO_LIST_TOKENS_OFFSET: num({ default: 100 }),
});
