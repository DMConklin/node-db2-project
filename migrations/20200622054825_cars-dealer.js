
exports.up = async function(knex) {
    await knex.schema.createTable("cars", table => {
        table.text("vin").notNull().unique().primary()
        table.text("make").notNull()
        table.text("model").notNull()
        table.real("mileage").notNull()
        table.text("transmission")
        table.text("titleStatus")
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("cars")
};
