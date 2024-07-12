import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {decode,sign,verify} from 'hono/jwt'
import { userRouter } from './routers/user';
import { transactionRouter } from './routers/transactions';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono()

app.use('/api/*',cors());

app.route("api/v1/user", userRouter)
app.route("api/v1/transaction", transactionRouter)

export default app
