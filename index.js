import express from "express"
import "dotenv/config"
import prisma from "./db/index.js"

const app = express()
const PORT = process.env.PORT
app.use(express.json())

app.get('/health', (req, res) => {
    return res.status(200).json({ message: 'Everything is fine' })
})

app.post('/create-user', async (req, res) => {
    const { email, name } = req.body

    try {
        // const user = await prisma.user.create({
        //     data: {
        //         name: 'Hanif',
        //         email: 'hanif@prisma.io',
        //         posts: {
        //             create: { title: 'Hey Backend' },
        //         },
        //         profile: {
        //             create: { bio: 'I dont like backend' },
        //         },
        //     },
        // })

        // const user = await prisma.user.create({
        //     data: {
        //       email,
        //       name,
        //     },
        //   })

        const createMany = await prisma.user.createMany({
            data: [
                { name: 'Sadimm', email: 'sadim@prisma.io' },
            ],
            // skipDuplicates: true, 
        })

        console.log(`Response-----`, createMany)
        return res.status(201).json({ message: 'User created successfully', data: createMany })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

app.get('/find-users', async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany({
            // include: {
            //     posts: true,
            //     profile: true,
            // },
        })

        return res.status(200).json({ message: 'Users fetched successfully', data: allUsers })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

app.get('/find-by-email/:email', async (req, res) => {
    const { email } = req.params
    const user = await prisma.user.findUnique({
        where: {
            email
        },
    })

    return res.status(200).json({ message: 'User fetched successfully', user })

})

app.get('/find-by-id/:id', async (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    const user = await prisma.user.findUnique({
        where: {
            id
        },
    })

    return res.status(200).json({ message: 'User fetched successfully', user })

})

app.patch('/update-email', async (req, res) => {
    const updateUser = await prisma.user.update({
        where: {
            email: 'alice@prisma.io',
        },
        data: {
            email: 'ALICE@gmail.com',
        },
    })

    return res.status(200).json({ message: 'User updated successfully', updateUser })
})

app.delete('/delete-by-email/:email', async (req, res) => {
    const { email } = req.params
    const deleteUser = await prisma.user.delete({
        where: {
            email
        },
    })

    return res.status(200).json({ message: 'User deleted successfully', deleteUser })
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))