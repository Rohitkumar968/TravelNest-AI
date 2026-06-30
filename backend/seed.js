const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Tour = require('./models/Tour');
const Booking = require('./models/Booking');

const tours = [
  {
    title: 'Golden Triangle India',
    location: 'Delhi, Agra & Jaipur',
    country: 'India',
    price: 12999,
    duration: 6,
    description: 'Explore the iconic Golden Triangle covering Delhi, Agra with the magnificent Taj Mahal, and the Pink City of Jaipur. A perfect blend of Mughal grandeur and Rajput heritage.',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
    ],
    highlights: ['Taj Mahal sunrise visit', 'Amber Fort elephant ride', 'Qutub Minar', 'Hawa Mahal', 'Street food tour'],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', description: 'Arrive in Delhi, check-in and explore Chandni Chowk.' },
      { day: 2, title: 'Delhi Sightseeing', description: 'Visit Red Fort, Qutub Minar, India Gate.' },
      { day: 3, title: 'Delhi to Agra', description: 'Travel to Agra, sunset view of Taj Mahal.' },
      { day: 4, title: 'Agra & Jaipur', description: 'Sunrise Taj Mahal visit, then drive to Jaipur.' },
      { day: 5, title: 'Jaipur Sightseeing', description: 'Amber Fort, Hawa Mahal, City Palace tour.' },
      { day: 6, title: 'Departure', description: 'Shopping at local markets, departure.' }
    ],
    included: ['Accommodation', 'Breakfast & Dinner', 'AC Transport', 'Guide', 'Monument entries'],
    excluded: ['Flights', 'Lunch', 'Personal expenses'],
    category: 'cultural',
    difficulty: 'easy',
    featured: true,
    rating: 4.8,
    numReviews: 124
  },
  {
    title: 'Kerala Backwaters Bliss',
    location: 'Alleppey, Munnar & Kovalam',
    country: 'India',
    price: 18500,
    duration: 7,
    description: 'Experience God\'s Own Country with tranquil backwaters, lush tea gardens, and pristine beaches. Includes a luxury houseboat stay in Alleppey.',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800'
    ],
    highlights: ['Houseboat stay in Alleppey', 'Tea plantation trek', 'Kathakali show', 'Ayurvedic spa', 'Kovalam beach'],
    itinerary: [
      { day: 1, title: 'Arrive Kochi', description: 'Fort Kochi exploration, Chinese fishing nets.' },
      { day: 2, title: 'Kochi to Munnar', description: 'Drive through scenic mountain roads to Munnar.' },
      { day: 3, title: 'Munnar', description: 'Tea plantation tour, Eravikulam National Park.' },
      { day: 4, title: 'Munnar to Alleppey', description: 'Drive to Alleppey, board houseboat.' },
      { day: 5, title: 'Backwaters', description: 'Full day on backwaters, Kerala cuisine.' },
      { day: 6, title: 'Kovalam Beach', description: 'Relax at Kovalam, sunset at beach.' },
      { day: 7, title: 'Departure', description: 'Fly from Trivandrum.' }
    ],
    included: ['Houseboat stay', 'All meals on houseboat', 'AC vehicle', 'Guide'],
    excluded: ['Flights', 'Personal expenses', 'Spa treatments'],
    category: 'beach',
    difficulty: 'easy',
    featured: true,
    rating: 4.9,
    numReviews: 89
  },
  {
    title: 'Manali Adventure Trek',
    location: 'Manali & Rohtang Pass',
    country: 'India',
    price: 8999,
    duration: 5,
    description: 'Adventure-packed trip to the mountains of Himachal Pradesh. Snow activities, trekking, and the scenic Rohtang Pass. Perfect for thrill-seekers!',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800'
    ],
    highlights: ['Rohtang Pass snow activities', 'Solang Valley', 'River rafting in Beas', 'Old Manali cafe hopping'],
    itinerary: [
      { day: 1, title: 'Arrive Manali', description: 'Check-in, Mall Road exploration.' },
      { day: 2, title: 'Rohtang Pass', description: 'Full day at Rohtang for snow activities.' },
      { day: 3, title: 'Solang Valley', description: 'Paragliding, zorbing, river crossing.' },
      { day: 4, title: 'River Rafting', description: 'White water rafting in Beas river, Old Manali.' },
      { day: 5, title: 'Departure', description: 'Hadimba temple visit, fly home.' }
    ],
    included: ['Hotel stay', 'Breakfast', 'All activities', 'Transport'],
    excluded: ['Flights', 'Lunch & Dinner', 'Personal gear'],
    category: 'adventure',
    difficulty: 'moderate',
    featured: true,
    rating: 4.6,
    numReviews: 67
  },
  {
    title: 'Rajasthan Royal Desert',
    location: 'Jaisalmer & Sam Sand Dunes',
    country: 'India',
    price: 15000,
    duration: 5,
    description: 'Experience the romance of the Thar Desert. Camel safaris, desert camping under stars, and the golden fort of Jaisalmer.',
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
      'https://images.unsplash.com/photo-1519922639192-e73293ca430e?w=800'
    ],
    highlights: ['Camel safari at sunset', 'Desert camp with cultural show', 'Jaisalmer Fort', 'Patwon ki Haveli'],
    itinerary: [
      { day: 1, title: 'Arrive Jaisalmer', description: 'Fort visit, Gadisar Lake sunset.' },
      { day: 2, title: 'Jaisalmer City', description: 'Havelis tour, local bazaar shopping.' },
      { day: 3, title: 'Sam Sand Dunes', description: 'Camel safari, overnight desert camp.' },
      { day: 4, title: 'Desert Experience', description: 'Sunrise in desert, folk music & dance.' },
      { day: 5, title: 'Departure', description: 'Return Jaisalmer, fly home.' }
    ],
    included: ['Desert camp', 'Camel safari', 'Cultural show', 'All meals at camp'],
    excluded: ['Flights', 'City hotel', 'Shopping'],
    category: 'adventure',
    difficulty: 'easy',
    featured: false,
    rating: 4.7,
    numReviews: 54
  },
  {
    title: 'Goa Beach Paradise',
    location: 'North & South Goa',
    country: 'India',
    price: 9500,
    duration: 4,
    description: 'Sun, sand, and sea! Explore the vibrant beaches, Portuguese heritage, seafood, and nightlife of India\'s beach capital.',
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'
    ],
    highlights: ['Calangute & Baga beaches', 'Water sports', 'Old Goa churches', 'Dudhsagar Falls', 'Night markets'],
    itinerary: [
      { day: 1, title: 'Arrive Goa', description: 'Check-in, Calangute beach evening.' },
      { day: 2, title: 'North Goa', description: 'Water sports, Anjuna flea market, sunsets.' },
      { day: 3, title: 'South Goa & Dudhsagar', description: 'Dudhsagar Falls trip, Old Goa heritage.' },
      { day: 4, title: 'Departure', description: 'Last beach morning, fly home.' }
    ],
    included: ['Beach resort stay', 'Breakfast', 'Dudhsagar trip', 'Water sports'],
    excluded: ['Flights', 'Lunch & Dinner', 'Nightlife'],
    category: 'beach',
    difficulty: 'easy',
    featured: true,
    rating: 4.5,
    numReviews: 203
  },
  {
    title: 'Bali Island Escape',
    location: 'Ubud, Seminyak & Nusa Penida',
    country: 'Indonesia',
    price: 45000,
    duration: 7,
    description: 'Discover the magic of Bali - from terraced rice paddies and ancient temples to pristine beaches and dramatic sea cliffs.',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      'https://images.unsplash.com/photo-1604999565976-8913ad2ddb37?w=800'
    ],
    highlights: ['Tegallalang Rice Terraces', 'Tanah Lot temple', 'Nusa Penida snorkeling', 'Ubud Monkey Forest'],
    itinerary: [
      { day: 1, title: 'Arrive Bali', description: 'Transfer to Ubud, welcome dinner.' },
      { day: 2, title: 'Ubud Culture', description: 'Rice terraces, Monkey Forest, art galleries.' },
      { day: 3, title: 'Temples', description: 'Tanah Lot, Uluwatu sunset Kecak dance.' },
      { day: 4, title: 'Nusa Penida', description: 'Snorkeling, Kelingking Beach.' },
      { day: 5, title: 'Seminyak', description: 'Beach clubs, shopping, fine dining.' },
      { day: 6, title: 'Free Day', description: 'Spa, cooking class, or explore.' },
      { day: 7, title: 'Departure', description: 'Last Bali sunrise, fly home.' }
    ],
    included: ['Villa accommodation', 'Breakfast daily', 'All transfers', 'Guided tours'],
    excluded: ['International flights', 'Lunch & Dinner', 'Entry fees'],
    category: 'beach',
    difficulty: 'easy',
    featured: true,
    rating: 4.9,
    numReviews: 178
  },
  {
    title: 'Dubai Luxury Getaway',
    location: 'Dubai & Abu Dhabi',
    country: 'UAE',
    price: 65000,
    duration: 5,
    description: 'Experience the pinnacle of luxury in the City of Gold. From Burj Khalifa to desert safaris, Dubai has it all.',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800'
    ],
    highlights: ['Burj Khalifa observation deck', 'Desert safari with BBQ', 'Dubai Mall', 'Palm Jumeirah', 'Abu Dhabi Sheikh Zayed Mosque'],
    itinerary: [
      { day: 1, title: 'Arrive Dubai', description: 'Check-in luxury hotel, Dubai Creek walk.' },
      { day: 2, title: 'Modern Dubai', description: 'Burj Khalifa, Dubai Mall, Dubai Fountain show.' },
      { day: 3, title: 'Desert Safari', description: 'Dune bashing, camel ride, belly dance dinner.' },
      { day: 4, title: 'Abu Dhabi', description: 'Sheikh Zayed Mosque, Ferrari World, Louvre.' },
      { day: 5, title: 'Departure', description: 'Palm Jumeirah tour, fly home.' }
    ],
    included: ['5-star hotel', 'Breakfast', 'All tours', 'Desert safari'],
    excluded: ['International flights', 'Lunches', 'Theme parks'],
    category: 'city',
    difficulty: 'easy',
    featured: true,
    rating: 4.8,
    numReviews: 92
  },
  {
    title: 'Thailand Island Hopping',
    location: 'Bangkok, Phuket & Phi Phi',
    country: 'Thailand',
    price: 38000,
    duration: 8,
    description: 'The ultimate Thailand experience! Explore Bangkok\'s temples, party on Phuket\'s beaches, and discover the breathtaking Phi Phi Islands.',
    images: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800'
    ],
    highlights: ['Grand Palace Bangkok', 'Maya Bay Phi Phi', 'Phang Nga Bay kayaking', 'Thai cooking class', 'Elephant sanctuary'],
    itinerary: [
      { day: 1, title: 'Bangkok Arrival', description: 'Khao San Road night market.' },
      { day: 2, title: 'Bangkok Temples', description: 'Grand Palace, Wat Arun, river cruise.' },
      { day: 3, title: 'Fly to Phuket', description: 'Patong Beach, Big Buddha.' },
      { day: 4, title: 'Phi Phi Islands', description: 'Day trip to Phi Phi, snorkeling.' },
      { day: 5, title: 'Phang Nga Bay', description: 'James Bond Island, sea kayaking.' },
      { day: 6, title: 'Elephant Sanctuary', description: 'Ethical elephant interaction.' },
      { day: 7, title: 'Cooking Class', description: 'Thai cooking class, spa day.' },
      { day: 8, title: 'Departure', description: 'Fly from Phuket.' }
    ],
    included: ['Hotel stays', 'Breakfast', 'Domestic flight', 'Island tours'],
    excluded: ['International flights', 'Lunch & Dinner', 'Personal shopping'],
    category: 'beach',
    difficulty: 'easy',
    featured: false,
    rating: 4.7,
    numReviews: 145
  },
  {
    title: 'Ladakh High Altitude Adventure',
    location: 'Leh, Nubra Valley & Pangong Lake',
    country: 'India',
    price: 22000,
    duration: 7,
    description: 'Journey to the rooftop of the world! Experience the surreal landscapes of Ladakh, ancient monasteries, and the sapphire Pangong Lake.',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800'
    ],
    highlights: ['Pangong Lake sunrise', 'Nubra Valley camel safari', 'Khardung La pass', 'Thiksey Monastery', 'Magnetic Hill'],
    itinerary: [
      { day: 1, title: 'Arrive Leh', description: 'Acclimatization, Leh Palace visit.' },
      { day: 2, title: 'Leh Monasteries', description: 'Thiksey, Hemis, Shey monasteries.' },
      { day: 3, title: 'Nubra Valley', description: 'Khardung La pass, Diskit monastery, camel safari.' },
      { day: 4, title: 'Hunder', description: 'Sand dunes, double humped camels.' },
      { day: 5, title: 'Pangong Lake', description: 'Scenic drive, overnight at Pangong.' },
      { day: 6, title: 'Return Leh', description: 'Chang La pass, Hemis Festival (seasonal).' },
      { day: 7, title: 'Departure', description: 'Shanti Stupa morning, fly home.' }
    ],
    included: ['Guesthouse & camp stays', 'All meals', 'Inner Line Permits', 'AC vehicle', 'Guide'],
    excluded: ['Flights', 'Porter charges', 'Personal gear'],
    category: 'adventure',
    difficulty: 'challenging',
    featured: false,
    rating: 4.9,
    numReviews: 43
  },
  {
    title: 'Switzerland Alpine Wonder',
    location: 'Zurich, Interlaken & Zermatt',
    country: 'Switzerland',
    price: 125000,
    duration: 8,
    description: 'A fairy-tale journey through the Swiss Alps. Witness the Matterhorn, ride scenic trains, cruise crystal-clear lakes, and explore charming Swiss villages.',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800'
    ],
    highlights: ['Jungfrau - Top of Europe', 'Matterhorn views', 'Rhine Falls', 'Lucerne Chapel Bridge', 'Scenic train rides'],
    itinerary: [
      { day: 1, title: 'Arrive Zurich', description: 'City tour, Old Town walk.' },
      { day: 2, title: 'Rhine Falls & Lucerne', description: 'Rhine Falls, Chapel Bridge, Lion Monument.' },
      { day: 3, title: 'Interlaken', description: 'Arrive Interlaken, Thun lake cruise.' },
      { day: 4, title: 'Jungfrau', description: 'Day trip to Top of Europe (Jungfraujoch).' },
      { day: 5, title: 'Grindelwald', description: 'Glacier hike, village charm.' },
      { day: 6, title: 'Zermatt', description: 'Arrive Zermatt, Matterhorn views.' },
      { day: 7, title: 'Glacier Paradise', description: 'Klein Matterhorn cable car, skiing (seasonal).' },
      { day: 8, title: 'Departure', description: 'Geneva transfer, fly home.' }
    ],
    included: ['4-star hotels', 'Breakfast', 'Swiss Travel Pass', 'Guided tours'],
    excluded: ['International flights', 'Lunch & Dinner', 'Ski rentals'],
    category: 'mountain',
    difficulty: 'moderate',
    featured: true,
    rating: 5.0,
    numReviews: 31
  }
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Tour.deleteMany({});
  await Booking.deleteMany({});
  console.log('Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@travelnest.com',
    password: 'admin123',
    role: 'admin'
  });

  // Create normal users
  const users = await User.create([
    { name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', phone: '9876543210' },
    { name: 'Rahul Verma', email: 'rahul@example.com', password: 'password123', phone: '9876543211' },
    { name: 'Anjali Singh', email: 'anjali@example.com', password: 'password123', phone: '9876543212' },
    { name: 'Vikram Patel', email: 'vikram@example.com', password: 'password123', phone: '9876543213' },
    { name: 'Meera Nair', email: 'meera@example.com', password: 'password123', phone: '9876543214' }
  ]);

  console.log(`Created ${users.length + 1} users`);

  // Create tours
  const createdTours = await Tour.create(tours);
  console.log(`Created ${createdTours.length} tours`);

  // Create sample bookings
  const bookings = [
    { user: users[0]._id, tour: createdTours[0]._id, bookingDate: new Date('2024-03-15'), travelers: 2, totalPrice: 25998, status: 'confirmed' },
    { user: users[1]._id, tour: createdTours[2]._id, bookingDate: new Date('2024-04-01'), travelers: 3, totalPrice: 26997, status: 'pending' },
    { user: users[2]._id, tour: createdTours[4]._id, bookingDate: new Date('2024-03-20'), travelers: 2, totalPrice: 19000, status: 'confirmed' },
    { user: users[3]._id, tour: createdTours[5]._id, bookingDate: new Date('2024-05-10'), travelers: 2, totalPrice: 90000, status: 'pending' },
    { user: users[4]._id, tour: createdTours[1]._id, bookingDate: new Date('2024-04-15'), travelers: 4, totalPrice: 74000, status: 'confirmed' }
  ];

  await Booking.create(bookings);
  console.log('Created sample bookings');

  console.log('\n✅ Database seeded successfully!');
  console.log('Admin: admin@travelnest.com / admin123');
  console.log('User: priya@example.com / password123');

  mongoose.disconnect();
};

seedDB().catch(err => {
  console.error(err);
  process.exit(1);
});
