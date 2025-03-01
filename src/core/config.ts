import 'dotenv/config';
import { get } from 'env-var';

export const env = {
 PORT: get('PORT').required().asPortNumber(),
 NODE_ENV: get('NODE_ENV').default('development').asString()
};