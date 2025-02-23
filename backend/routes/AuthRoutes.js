const router = require("express").Router(); 
const {googleLogin, onBoardUser, getAllUsers, generateToken} = require("../controllers/AuthContoller");


router.get("/google", googleLogin)
router.post("/onboard-user", onBoardUser)
router.get("/get-contacts", getAllUsers)
router.get("/generate-token/:userId", generateToken)

module.exports = router