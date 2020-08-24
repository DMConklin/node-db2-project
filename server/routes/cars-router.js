const express = require("express")
const db = require("../models/cars-model")

const router = express.Router()

router.get('/', async (req,res,next) => {
    try {
        const message = await db.getCars()
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
        const [car] = await db.addCar({
            vin: req.body.vin,
            make: req.body.make,
            model: req.body.model,
            mileage: req.body.mileage
        })
        res.status(201).json(car)
    } catch(err) {
        next(err)
    }
})

router.put('/:vin', validateVin(), validateBody(), async (req,res,next) => {
    try {
        const car = await db.updateCar(req.body, req.params.vin)
        res.json(car)
    } catch(err) {
        next(err)
    }
})

router.delete('/:vin', validateVin(), async (req,res,next) => {
    try {
        const success = await db.deleteCar(req.params.vin)
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
            const car = await db.getCarByVin(req.params.vin)
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