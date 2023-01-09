const parkingController = require("../controllers/parking")

const routes = (app) => {
  app.route("/")
    .get(async(req, res, next) => {
      const get = {
        type: (req.query?.type) ? req.query.type : 'all',
        startDate: (req.query?.startDate) ? req.query.startDate : '',
        endDate: (req.query?.endDate) ? req.query.endDate : '',
        startPrice: (req.query?.startPrice) ? req.query.startPrice : '',
        endPrice: (req.query?.endPrice) ? req.query.endPrice : '',
      }
      const data = await parkingController.getAll(req, res)
      if(data.success) {
        return res.render("index", { get, data: data.data, title: "Keda" })
      } else {
        return res.render("error", { title: "Keda" })
      }
    })
  app.route("/add")
    .get(async (req, res, next) => {
      return res.render("add", { title: "Keda" })
    })
    .post(async(req, res, next) => {
      const result = await parkingController.postParking(req, res)
      if(result === "Success") {
        return res.redirect('/')
      } else {
        return res.render("error", { title: "Keda" })
      }
    })
  app.route("/api")
    .get(async(req, res, next) => {
      const result = await parkingController.getAll(req, res)
      if(result.success) {
        return res.status(200).json({success: true, data: result.data})
      } else {
        return res.status(400).send({success: false, data: result.err})
      }
    })
  app.route("/api/add")
    .post(async(req, res, next) => {
      const result = await parkingController.postParking(req, res)
      if(result === "Success") {
        return res.status(200).send({success: true, data: "Success"})
      } else {
        return res.status(400).send({success: false, result})
      }
    })
}

module.exports = routes
