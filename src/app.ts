import {env} from './core/config'
import { Server } from './core/server'

const server = new Server({ port: env.PORT });

server.start();

