const express = require('express')

const app = express()

app.use(express.static('assets'));

app.get('/', (req, res) => {
	res.render('assets/index.html')
})

app.listen("3000", () => {
	console.log("Server runing")
})