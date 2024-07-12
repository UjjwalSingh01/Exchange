import { Hono } from "hono";
import bcrypt from 'bcryptjs';
import zod from 'zod'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


export const userRouter = new Hono<{
	Bindings: {
        DATABASE_URL: string  // to specify that Database_url is a string;
        JWT_SECRET: string
	},
    Variables: {
        userId: string;
    }
}>();


// login ... register(assign a random balance) ... updateCred ... retrieve paginated user

const emailSchema = zod.string().email();


type SignUpDetail = {
    firstname: string,
    lastname: string | ""
    email: string,
    password: string
}

userRouter.post('/register', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const detail: SignUpDetail = await c.req.json();
    console.log(detail)

    const zodResult = emailSchema.safeParse(detail.email)
    if(!zodResult.success){
        c.status(401);
        return c.json({
            message: zodResult
        })
    }

    if(detail.password === "" || detail.firstname === ""){
        c.status(401)
        return c.json({
            message: "Invalid Credential"
        })
    }

    try {
        const response = await prisma.user.findUnique({
            where: {
                email: detail.email,
            },
        })

        if (response != null) {
            c.status(409)
            return c.json({
                message: "User Already Exist"
            })
        }

        const saltRounds = 10;
        const hashpassword = await bcrypt.hash(detail.password, saltRounds);

        const user = await prisma.user.create({
            data: {
                firstname: detail.firstname,
                lastname: detail.lastname,
                email: detail.email,
                password: hashpassword
            },
        })

        const balance = await prisma.account.create({
            data: {
                userId: user.id,
                balance: 100000,
                tt_credit: 0,
                tt_debit: 0
            }
        })

        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        c.status(200);
        return c.json({
            token: token,
            user: user
        })

    } catch (error) {
        console.error("Server Site Error is Signup: ", error);
    }

})


type SigninDetail = {
    email: string,
    password: string
}

userRouter.get('/login', async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const detail: Record<string,string> = c.req.query();
    const zodResult = emailSchema.safeParse(detail.email)

    if(!zodResult.success){
        c.status(401)
        return c.json({
            message: zodResult
        })
    }

// console.log(detail);

    try {
        const response = await prisma.user.findUnique({
            where: {
                email: detail.email,
            },
        })

        if(response === null){
            c.status(401)
            return c.json({
                message: "User Does not Exist"
            })
        }

        const isMatch = await bcrypt.compare(detail.password, response.password)
        if(!isMatch){
            c.status(401)
            return c.json({
                message: "Invalid Credentials"
            })
        }

        const token = await sign({ id: response.id }, c.env.JWT_SECRET);

        return c.json({
            message: token,
        })

    } catch (error) {
        console.error("Server Site error in Signin: ", error)
    }
})


userRouter.use("/decode/*", async (c, next) => {
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


type UpdateCred = {
    firstname : string | ""
    lastname : string | ""
    email : string | ""
    newPassword : string
    password : string
}

userRouter.post('/updateCred' ,  async(c) => {

    // call middleware and extract usetId and using that password nikaalo
    // compare karo if same edit the password else error

    const detail: UpdateCred = await c.req.json()


})



userRouter.get('/decode/users' , async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const userId = c.get('userId')
    const to: string = c.req.query('filter') || ""

    try {

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        const balance: any = await prisma.account.findFirst({
            where: {
                userId: userId
            }
        })

        if(user === null){
            c.status(401)
            return c.json({
                message: "User Does not Exist"
            })
        }
        else {
            const response = await prisma.user.findMany({
                take: 10,
                where: {
                  firstname: {
                    contains: to,
                  },
                },
            })
    
            
            const message = response.map(users => {
                return ({
                    to_fname: users.firstname,
                    to_lname: users.lastname,
                    to_id: users.id,
                    from_name: user.firstname
                })
            })
    
            return c.json({
                message: message,
                balance: balance.balance,
                user: user.firstname
            })
        }

    } catch(error) {
        console.error('Server-Side Error in Fetcing Users: ', error);
    }
})