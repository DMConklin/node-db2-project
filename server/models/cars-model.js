const db = require("../../data/config")

function getCars() {
    return db("cars")
        .select("*")
}

function getCarById(id) {
    return db("cars")
        .select("*")
        .where("id", id)
}

function getCarByVin(vin) {
    return db("cars")
        .select("*")
        .where("vin", vin)
}

async function addCar(car) {
    const [id] = await db("cars")
        .insert(car)
    return getCarById(id)
}

async function updateCar(car, vin) {
    await db("cars")
        .update(car)
        .where("vin", vin)
    return getCarByVin(vin)
}

function deleteCar(vin) {
    return db("cars")
        .where("vin", vin)
        .del()
}

module.exports = {
    getCars, getCarById, getCarByVin, addCar, updateCar, deleteCar
}