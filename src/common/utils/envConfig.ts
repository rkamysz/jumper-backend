import dotenv from 'dotenv';
import { bool, CleanedEnv, cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export type Config = CleanedEnv<any> & {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  CORS_ORIGIN: string;
  COMMON_RATE_LIMIT_MAX_REQUESTS: number;
  COMMON_RATE_LIMIT_WINDOW_MS: number;
  ETHERSCAN_IO_API_KEY?: string;
  LIST_TOKENS_CHUNK_SIZE: number;
  ALCHEMY_API_KEY: string;
  ALCHEMY_NETWORK: string;
  USE_CACHE: boolean;
  MONGO_DB_NAME?: string;
  MONGO_HOSTS?: string;
  MONGO_PORTS?: number;
  MONGO_USER?: string;
  MONGO_PASSWORD?: string;
};

export const env: Config = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  ETHERSCAN_IO_API_KEY: str({ devDefault: testOnly('') }),
  ALCHEMY_API_KEY: str({ devDefault: testOnly('') }),
  ALCHEMY_NETWORK: str({ devDefault: testOnly('eth-testnet') }),
  LIST_TOKENS_CHUNK_SIZE: num({ default: 100 }),
  USE_CACHE: bool({ default: true }),
});
