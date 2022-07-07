const express = require('express')
const router = express.Router()

const cities = ['Berlin', 'Hamburg', 'Frankfurt', 'München', 'Düsseldorf']

const defaultHotel = cities.map(city => {
	let rooms = []
	for (let i = 100; i < 120; ++i) {
		rooms = [...rooms, {
			number: i,
			type : 'single',
			price : 80,
			guest : 'none',
			status : 'free'
		}]
	}
	for (let i = 200; i < 210; ++i) {
		rooms = [...rooms, {
			number: i,
			type : 'double',
			price : 120,
			guest : 'none',
			status : 'free'
		}]
	}
	for (let i = 300; i < 305; ++i) {
		rooms = [...rooms, {
			number: i,
			type : 'suite',
			price : 250,
			guest : 'none',
			status : 'free'
		}]
	}

	return {
		city: city,
		rooms: rooms
	}
})
let hotels = defaultHotel

router.get('/default', (req, res) => {
	res.json(defaultHotel)
})

router.post('/default', (req, res) => {
  hotels = defaultHotel
  res.json(hotels)
})

router.get('/', (req, res) => {
	res.json(hotels)
})

router.put('/', (req, res) => {
	const bookedHotels = req.body.map(bookedHotel => {
		let rooms = hotels.find(hotel => hotel?.city.toLowerCase() === bookedHotel?.city.toLowerCase())?.rooms
		let room = rooms?.find(room => room.number === parseInt(bookedHotel.number))

		if(!rooms) return { message: `Hotel in ${bookedHotel?.city} is not available` }
		if(!room) return { message: `Room ${bookedHotel?.number} is not available` }
		if(bookedHotel.status !== 'free' && bookedHotel.status !== 'occupied') return { message: 'Status is wrong' }
		if(bookedHotel.status === 'occupied' && room?.status !== 'free') return { message: `Room ${bookedHotel.number} is already occupied` }

		room.status = req.body.status === 'free' ? 'free' : 'occupied'
		room.guest = req.body.status === 'free' ? 'none' : bookedHotel.guest

		return room
	});

	res.json(bookedHotels) 
})

router.get('/:city', (req, res) => {
	res.json(hotels.find(hotel => hotel?.city.toLowerCase() === req.params?.city.toLowerCase()) || {})
})

router.get('/:city/rooms', (req, res) => {
	res.json(hotels.find(hotel => hotel?.city.toLowerCase() === req.params?.city.toLowerCase())?.rooms || [])
})

router.get('/:city/rooms/:roomId', (req, res) => {
	const rooms = hotels.find(hotel => hotel?.city.toLowerCase() === req.params?.city.toLowerCase())?.rooms || []
	res.json(rooms?.find(room => room.number === parseInt(req.params?.roomId)) || {})
})

router.put('/:city/rooms/:roomId', (req, res) => {
	let rooms = hotels.find(hotel => hotel?.city.toLowerCase() === req.params?.city.toLowerCase())?.rooms
	let room = rooms?.find(room => room.number === parseInt(req.params?.roomId))

	if(!rooms) return res.status(400).json({ message: `Hotel in ${req.params?.city} is not available` })
	if(!room) return res.status(400).json({ message: `Room ${req.params?.roomId} is not available` })
  if(req.body.status !== 'free' && req.body.status !== 'occupied') return res.status(400).json({ message: 'Status is wrong' })
  if(req.body.status === 'occupied' && room?.status !== 'free') return res.status(400).json({ message: `Room ${req.params.roomId} is already occupied` })

	room.status = req.body.status === 'free' ? 'free' : 'occupied'
	room.guest = req.body.status === 'free' ? 'none' : req.body.guest
	res.json(room)
})

module.exports = router