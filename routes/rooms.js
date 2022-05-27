const express = require('express')
const router = express.Router()

let defaultRooms = []
for (let i = 100; i < 120; ++i) {
	defaultRooms = [...defaultRooms, {
		number: i,
    type : 'single',
		price : 80,
		guest : 'none',
		status : 'free'
	}]
}
for (let i = 200; i < 210; ++i) {
  defaultRooms = [...defaultRooms, {
		number: i,
    type : 'double',
		price : 120,
		guest : 'none',
		status : 'free'
	}]
}
for (let i = 300; i < 305; ++i) {
  defaultRooms = [...defaultRooms, {
		number: i,
    type : 'suite',
		price : 250,
		guest : 'none',
		status : 'free'
	}]
}
let rooms = defaultRooms

router.get('/default', (req, res) => {
	res.json(defaultRooms)
})

router.post('/default', (req, res) => {
  rooms = defaultRooms
  res.json(rooms)
})

router.get('/status', (req, res) => {
	res.json(['free', 'occupied'])
})

router.get('/status/:status', (req, res) => {
	res.json(rooms.filter(room => room.status === req.params.status))
})

router.get('/status/:status/one', (req, res) => {
	res.json(rooms.find(room => room.status === req.params.status) || {})
})

router.get('/type', (req, res) => {
	res.json(rooms.map(room => room.type).filter((type, index, array) => array.indexOf(type) === index))
})

router.get('/type/:type', (req, res) => {
	res.json(rooms.filter(room => room.type === req.params.type && room.status === 'free'))
})

router.get('/type/:type/one', (req, res) => {
	res.json(rooms.find(room => room.type === req.params.type && room.status === 'free') || {})
})

router.get('/number', (req, res) => {
	res.json(rooms.map(room => room.number))
})

router.get('/', (req, res) => {
	res.json(rooms)
})

router.put('/', (req, res) => {
	console.log(req.body)
})

router.get('/:roomId', (req, res) => {
	res.json(rooms.find(room => room.number === parseInt(req.params.roomId)) || {})
})

router.put('/:roomId', (req, res) => {
  if(req.body.status !== 'free' && req.body.status !== 'occupied') return res.status(400).json({ message: 'Status is wrong' })
  if(req.body.status === 'occupied' && rooms.find(room => room.number === parseInt(req.params.roomId)).status !== 'free') return res.status(400).json({ message: `Room ${req.params.roomId} is already occupied` })

  rooms = rooms.map(room => room.number === parseInt(req.params.roomId)
    ? {...room, status: req.body.status === 'free' ? 'free' : 'occupied', guest: req.body.status === 'free' ? 'none' : req.body.guest}
    : room
  )
	res.json(rooms.find(room => room.number === parseInt(req.params.roomId)) || {})
})

module.exports = router