const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get('/', async (req,res,next) => {
    try {
        const message = await db.select("*").from("cars")
        res.json(message)
    } catch(err) {
        next(err)
    }
})

router.get('/:vin', validateVin(), async (req,res,next) => {
    try {
        res.json(req.car)
    } catch(err) {
        next(err)
    }
})

router.post('/', validateBody(), async (req,res,next) => {
    try {
        const carId = await db.insert(req.body).into("cars")
        const [car] = await db.select("*").from("cars").where("id", carId)
        res.status(201).json(car)
    } catch(err) {
        next(err)
    }
})

router.put('/:vin', validateVin(), validateBody(), async (req,res,next) => {
    try {
        await db("cars").update(req.body).where("vin", req.params.vin)
        const car = await db.select("*").from("cars").where("vin", req.params.vin)
        res.json(car)
    } catch(err) {
        next(err)
    }
})

router.delete('/:vin', validateVin(), async (req,res,next) => {
    try {
        const success = await db("cars").where("vin", req.params.vin).del()
        if (!success) {
            return res.json({
                message: "The car could not be removed"
            })
        }
        res.json({
            message: "The following car was removed",
            ...req.car
        })
    } catch(err) {
        next(err)
    }
})

function validateVin() {
    return async (req,res,next) => {
        try {
            const car = await db.select("*").from("cars").where("vin", req.params.vin)
            if (car.length < 1) {
                return res.status(404).json({
                    message: "The car you requested does not exist"
                })
            }
            [req.car] = car
            next()
        } catch(err) {
            next(err)
        }
    }
}

function validateBody() {
    return (req,res,next) => {
        try {
            if (req.method === "POST") {
                if (!req.body.vin || 
                    !req.body.make || 
                    !req.body.model ||
                    !req.body.mileage) {
                        return res.status(400).json({
                            message: "Vin, make, model and mileage required"
                        })
                }
                next()
            } else if (req.method === "PUT") {
                if (!req.body.mileage && !req.body.titleStatus) {
                    return res.status(404).json({
                        message: "mileage or title status required"
                    })
                }
                next()
            }
        } catch(err) {
            next(err)
        }
    }
}

module.exports = router