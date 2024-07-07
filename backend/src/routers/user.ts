import { Hono } from "hono";
import bcrypt from 'bcrypt'
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
            message: token
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

    const detail: Record<string,string> = await c.req.header();
    const zodResult = emailSchema.safeParse(detail.email)

    if(!zodResult.success){
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
            return c.json({
                message: "User Does not Exist"
            })
        }

        const isMatch = await bcrypt.compare(detail.password, response.password)
        if(!isMatch){
            return c.json({
                message: "Invalid Credentials"
            })
        }

        const token = await sign({ id: response.id }, c.env.JWT_SECRET);

        return c.json({
            message: token
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



userRouter.get('/users' , async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const user: string = await c.req.json()

    try {

        const response = await prisma.user.findMany({
            take: 10,
            where: {
              firstname: {
                contains: user,
              },
            },
        })

        return c.json({
            message: response.map(users => ({
                email: users.email,
                firstname: users.firstname,
                lastname: users.lastname,
                id: users.id
            }))
        })

    } catch(error) {

    }
})