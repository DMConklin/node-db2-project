
exports.seed = async function(knex) {
    await knex("cars").truncate()
    await knex("cars").insert([
        {vin: "1234QWER5678", make: "Toyota", model: "Corola", mileage: 50000.0, transmission: "manual", titleStatus: "clean"},
        {vin: "9012ASDF3456", make: "Ford", model: "Mustang", mileage: 75000.6, transmission: "automatic", titleStatus: "clean"},
        {vin: "7890ZXCV1234", make: "Chevy", model: "Impala", mileage: 150667.7, transmission: "automatic", titleStatus: "salvage"}
    ])

};
