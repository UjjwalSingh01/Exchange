import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const transactionRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string  // to specify that Database_url is a string;
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>();

// paginated transaction ... transfer ... balance credits debits 


function generateDate(){
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const modifiedDate = `${day}/${month}/${year}`;

    return modifiedDate;
}


transactionRouter.use("/decode/*", async (c, next) => {
    const token = c.req.header("authorization") || "";
    // console.log("middle ware called");
  
    try {
        const user: any = await verify(token, c.env.JWT_SECRET)
        c.set("userId", user.id);
  
        await next();
  
    } catch (err) {
        return c.json({
            message: "You Are Not Logged In"
        })
    }
})


type userDetail = {
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    phone: number
}

transactionRouter.get('/decode/getDetails', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    // call middleware userId
    const userId: string = c.get('userId')

    try {
        
        const result = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        // balance .. cred .. debt
        const account = await prisma.account.findFirst({
            where: {
                userId: userId
            }
        })

        // 10 transactions
        const transaction = await prisma.transaction.findMany({
            where: {
                userId: userId
            }
        })

        
        // everything except pass
        if(result != null){
            const user = result.map((detail: userDetail) => {
                return {
                    firstname: detail.firstname,
                    lastname: detail.lastname,
                    email: detail.email
                }
            })

            return c.json({
                user: user,
                account: account,
                transaction: transaction
            })
        }

        
        
    
    } catch(error) {

    }
})


type transferDetails = {
    to: string,
    amount: number
}  

transactionRouter.post('decode/transfer', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const detail: transferDetails = await c.req.json()

    const response = prisma.$transaction(async (tx) => {

        const userId: string = c.get('userId')

        const fromId = await prisma.account.findFirst({
            where: {
                userId: userId
            }
        })

        if(fromId === null){
            return c.json({
                message: "User Does not Exist"
            })
        }

        if (fromId.balance < detail.amount) {
            c.status(401);
            return c.json({
                message: "Insufficient Balance"
            })
        }

        const sender = await tx.account.update({
          data: {
            balance: {
              decrement: detail.amount,
            }, 
            tt_debit: {
              increment: detail.amount
            }
          },
          where: {
            id: fromId.id,
          },
        })
        
        const recipient = await tx.account.update({
          data: {
            balance: {
              increment: detail.amount,
            },
            tt_credit: {
              increment: detail.amount
            }
          },
          where: {
            id: detail.to,
          },
        })

        const date: string = generateDate();
    
        const senderTx = await prisma.transaction.create({
            data: {
                userId: userId,
                to: detail.to,
                amount: -detail.amount,
                date: date
            }
        })

        const recipientTx = await prisma.transaction.create({
            data:{
                userId: detail.to,
                to: userId,
                amount: detail.amount,
                date: date
            }
        })
    })
})


