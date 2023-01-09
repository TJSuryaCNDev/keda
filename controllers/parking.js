const { dateFormat, timestampFormat } = require("../helpers/helper")
const { Pool } = require("pg")
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "keda",
  password: "postgres",
  port: 5432,
})

exports.getAll = async (req, res) => {
  try {
    const get = {
      type: (req.query?.type) ? req.query.type : 'all',
      startDate: (req.query?.startDate) ? req.query.startDate : '',
      endDate: (req.query?.endDate) ? req.query.endDate : '',
      startPrice: (req.query?.startPrice) ? req.query.startPrice : '',
      endPrice: (req.query?.endPrice) ? req.query.endPrice : '',
    }
    let query = "SELECT * FROM parking WHERE true"
    if(get.type !== "all") query += " AND type = '" + get.type + "'"
    if(get.startDate !== "") query += " AND startdate >= timestamp '" + timestampFormat(new Date(get.startDate)) + "'"
    if(get.endDate !== "") query += " AND enddate <= timestamp '" + timestampFormat(new Date(get.endDate)) + "'"
    if(get.startPrice !== "") query += " AND price >= " + get.startPrice
    if(get.endPrice !== "") query += " AND price <= " + get.endPrice
    const response = await pool.query(query)
    const data = await Promise.all(response.rows.map(v => {
      return {
        type: v.type,
        startDate: dateFormat(new Date(v.startdate)),
        endDate: dateFormat(new Date(v.enddate)),
        price: 'Rp ' + (v.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")
      }
    }))
    return {success: true, data}
  } catch(err) {
    return {success: false, err}
  }
}

exports.postParking = async (req, res) => {
  try {
    const defPriceHour = (req.body.type.toLowerCase() === "mobil") ? 5000 : 2000
    const defPriceDay = (req.body.type.toLowerCase() === "mobil") ? 80000 : 40000
    const startDate = new Date(req.body.startDate)
    const endDate = new Date(req.body.endDate)
    const diffTime = Math.abs(endDate - startDate)
    let price
    const timeDay = 1000 * 60 * 60 * 24
    if(diffTime >= timeDay) {
      const day = Math.floor(diffTime / timeDay)
      const timeLeft = diffTime % timeDay
      price = (day * defPriceDay) + (Math.ceil(timeLeft / (1000 * 60 * 60)) * defPriceHour)
    } else {
      price = (Math.ceil(diffTime / (1000 * 60 * 60)) * defPriceHour)
    }
    await pool.query("INSERT INTO parking(type, startDate, endDate, price) VALUES($1, $2, $3, $4)", [req.body.type, startDate.toISOString(), endDate.toISOString(), price])
    return "Success"
  } catch(err) {
    return err
  }
}