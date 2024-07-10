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


type TransactionDetails = {
    name: string, 
    date: string,
    amount: number
}

transactionRouter.get('/decode/getDetails', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const userId: string = c.get('userId')

    try {
        // firstname
        const result = await prisma.user.findFirst({
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

        // 10 transactions ... from/to name .. date .. amount
        const transaction = await prisma.transaction.findMany({
            take: 10,
            where: {
                OR : [
                    {
                        from_id: userId
                    } , {
                        to_id: userId
                    }
                ]
            }
        })

        
        // everything except pass
        if(result != null){
            const tx: TransactionDetails[] = transaction.map((transactions) => {
                if(transactions.from_id === userId) {
                    return ({
                        name: transactions.to_name,
                        date: transactions.date,
                        amount: -transactions.amount
                    })
                } else {
                    return ({
                        name: transactions.from_name,
                        date: transactions.date,
                        amount: transactions.amount
                    })
                }
            })

            return c.json({
                user: result.firstname,
                account: account,
                transaction: tx
            })
        }
    
    } catch(error) {
        console.error("Server-Side Error in Getting Deatils: ", error);
    }
})


type transferDetails = {
    to_id: string,
    to_name: string,
    from_name: string,
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

        if (fromId.balance < detail.amount || detail.amount < 0) {
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
            userId: detail.to_id,
          },
        })

        const date: string = generateDate();
    
        const Tx = await prisma.transaction.create({
            data: {
                from_id: userId,
                from_name: detail.from_name,
                to_id: detail.to_id,
                to_name: detail.to_name,
                amount: detail.amount,
                date: date
            }
        })

        // const recipientTx = await prisma.transaction.create({
        //     data:{
        //         userId: detail.to_id,
        //         to: userId,
        //         to_name: detail.from_name,
        //         amount: detail.amount,
        //         date: date
        //     }
        // })
    })
})


