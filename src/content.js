// OctoLearn content: levels, lessons, exercises and collectible animals.
// All user-facing text is in English on purpose.

export const LEVELS = [
  { id: 1, code: 'A1', name: 'Beginner', blurb: 'First words and everyday basics', color: '#34d399' },
  { id: 2, code: 'A2', name: 'Elementary', blurb: 'Daily life and simple conversations', color: '#38bdf8' },
  { id: 3, code: 'B1', name: 'Intermediate', blurb: 'Opinions, plans and real situations', color: '#a78bfa' }
];

// Each lesson has 6 exercises: 2 vocabulary, 2 grammar, 1 listening, 1 speaking.
// type: vocab | grammar | listen | speak   (listen uses browser text-to-speech)
export const LESSONS = [
  {
    id: 'l1', level: 1, order: 1, emoji: '👋', xp: 50,
    title: 'Greetings & Introductions',
    goal: 'Say hello, share your name and ask how someone is.',
    exercises: [
      { type: 'vocab', prompt: 'Which word is a greeting?', options: ['Hello', 'Goodbye', 'Sorry', 'Thanks'], answer: 'Hello' },
      { type: 'vocab', prompt: 'When do you say "Nice to meet you"?', options: ['When you meet someone for the first time', 'When you leave a place', 'While eating dinner', 'Before going to sleep'], answer: 'When you meet someone for the first time' },
      { type: 'grammar', prompt: 'Complete: "___ name is Anna."', options: ['My', 'I', 'Me', 'Mine'], answer: 'My' },
      { type: 'grammar', prompt: 'Complete: "I ___ from Brazil."', options: ['am', 'is', 'are', 'be'], answer: 'am' },
      { type: 'listen', text: "Hi, I'm Marco. Nice to meet you!", options: ["Hi, I'm Marco. Nice to meet you!", 'Hi, I am Marta, nice to see you!', "Hey, I'm Marco, nice to teach you!"], answer: "Hi, I'm Marco. Nice to meet you!" },
      { type: 'speak', text: 'Hello, my name is Alex. Nice to meet you.' }
    ]
  },
  {
    id: 'l2', level: 1, order: 2, emoji: '🔢', xp: 50,
    title: 'Numbers & Days',
    goal: 'Count, tell the time and talk about days of the week.',
    exercises: [
      { type: 'vocab', prompt: 'How many days are there in a week?', options: ['Seven', 'Five', 'Six', 'Eight'], answer: 'Seven' },
      { type: 'vocab', prompt: 'Which number is "twelve"?', options: ['12', '20', '2', '21'], answer: '12' },
      { type: 'grammar', prompt: 'Complete: "Today ___ Monday."', options: ['is', 'are', 'am', 'be'], answer: 'is' },
      { type: 'grammar', prompt: 'Complete: "There ___ five apples on the table."', options: ['are', 'is', 'am', 'be'], answer: 'are' },
      { type: 'listen', text: 'My birthday is on the third of May.', options: ['My birthday is on the third of May.', 'My birthday is on the first of March.', 'My birthday is on the third of March.'], answer: 'My birthday is on the third of May.' },
      { type: 'speak', text: 'There are seven days in a week, and today is Monday.' }
    ]
  },
  {
    id: 'l3', level: 1, order: 3, emoji: '👨‍👩‍👧', xp: 50,
    title: 'Family & People',
    goal: 'Talk about your family and describe people around you.',
    exercises: [
      { type: 'vocab', prompt: 'My mother\'s son is my ___.', options: ['brother', 'sister', 'uncle', 'cousin'], answer: 'brother' },
      { type: 'vocab', prompt: 'A person\'s father and mother are their ___.', options: ['parents', 'friends', 'teachers', 'neighbours'], answer: 'parents' },
      { type: 'grammar', prompt: 'Complete: "She ___ two brothers."', options: ['has', 'have', 'having', 'haves'], answer: 'has' },
      { type: 'grammar', prompt: 'Complete: "___ are my parents."', options: ['They', 'He', 'She', 'It'], answer: 'They' },
      { type: 'listen', text: 'This is my sister. Her name is Mia.', options: ['This is my sister. Her name is Mia.', 'This is my brother. His name is Mia.', 'This is my sister. Her name is Mary.'], answer: 'This is my sister. Her name is Mia.' },
      { type: 'speak', text: 'I have one brother and two sisters.' }
    ]
  },
  {
    id: 'l4', level: 1, order: 4, emoji: '🍎', xp: 50,
    title: 'Food & Drinks',
    goal: 'Order food, talk about what you like to eat and drink.',
    exercises: [
      { type: 'vocab', prompt: 'Which one is a drink?', options: ['Water', 'Bread', 'Apple', 'Rice'], answer: 'Water' },
      { type: 'vocab', prompt: 'I\'m hungry. I want to ___ something.', options: ['eat', 'drink', 'read', 'walk'], answer: 'eat' },
      { type: 'grammar', prompt: 'Complete: "I would like ___ coffee, please."', options: ['some', 'a', 'an', 'any'], answer: 'some' },
      { type: 'grammar', prompt: 'Complete: "___ you like tea?"', options: ['Do', 'Does', 'Is', 'Are'], answer: 'Do' },
      { type: 'listen', text: "I'd like a cup of tea and a slice of cake.", options: ["I'd like a cup of tea and a slice of cake.", "I'd like a cup of coffee and a slice of cake.", "I'd like a cup of tea and a piece of fruit."], answer: "I'd like a cup of tea and a slice of cake." },
      { type: 'speak', text: 'I usually drink water with my lunch.' }
    ]
  },
  {
    id: 'l5', level: 2, order: 5, emoji: '⏰', xp: 60,
    title: 'Daily Routine',
    goal: 'Describe your day from morning to night.',
    exercises: [
      { type: 'vocab', prompt: 'Which activity usually happens first in the morning?', options: ['Wake up', 'Have dinner', 'Go to bed', 'Watch a movie'], answer: 'Wake up' },
      { type: 'vocab', prompt: 'To "have breakfast" means to ___.', options: ['eat in the morning', 'eat at night', 'cook dinner', 'skip lunch'], answer: 'eat in the morning' },
      { type: 'grammar', prompt: 'Complete: "She ___ to work by bus every day."', options: ['goes', 'go', 'going', 'gone'], answer: 'goes' },
      { type: 'grammar', prompt: 'Complete: "I ___ TV after dinner."', options: ['watch', 'watches', 'watching', 'watched'], answer: 'watch' },
      { type: 'listen', text: 'Every day I wake up at six and go for a run.', options: ['Every day I wake up at six and go for a run.', 'Every day I wake up at six and go to work.', 'Every day I wake up at ten and go for a run.'], answer: 'Every day I wake up at six and go for a run.' },
      { type: 'speak', text: 'I wake up at seven, have breakfast, and start work at nine.' }
    ]
  },
  {
    id: 'l6', level: 2, order: 6, emoji: '🏙️', xp: 60,
    title: 'Around Town',
    goal: 'Name places in a city and ask for directions.',
    exercises: [
      { type: 'vocab', prompt: 'Where do you go to buy medicine?', options: ['Pharmacy', 'Bakery', 'Library', 'Station'], answer: 'Pharmacy' },
      { type: 'vocab', prompt: 'A place where you can borrow books is a ___.', options: ['library', 'hospital', 'market', 'café'], answer: 'library' },
      { type: 'grammar', prompt: 'Complete: "___ is a bank near here?"', options: ['Where', 'What', 'Who', 'When'], answer: 'Where' },
      { type: 'grammar', prompt: 'Complete: "Go straight and ___ left at the corner."', options: ['turn', 'turns', 'turning', 'turned'], answer: 'turn' },
      { type: 'listen', text: 'Turn right at the traffic lights, then go straight.', options: ['Turn right at the traffic lights, then go straight.', 'Turn left at the traffic lights, then go straight.', 'Turn right at the corner, then stop.'], answer: 'Turn right at the traffic lights, then go straight.' },
      { type: 'speak', text: 'Excuse me, how do I get to the train station?' }
    ]
  },
  {
    id: 'l7', level: 2, order: 7, emoji: '🛍️', xp: 60,
    title: 'Shopping & Money',
    goal: 'Ask about prices and pay for things.',
    exercises: [
      { type: 'vocab', prompt: 'Complete: "How much does it ___?"', options: ['cost', 'pay', 'spend', 'buy'], answer: 'cost' },
      { type: 'vocab', prompt: 'A discount means the price is ___.', options: ['lower', 'higher', 'the same', 'unknown'], answer: 'lower' },
      { type: 'grammar', prompt: 'Complete: "How much ___ this shirt?"', options: ['is', 'are', 'do', 'does'], answer: 'is' },
      { type: 'grammar', prompt: 'Complete: "I\'d like to ___ by card, please."', options: ['pay', 'cost', 'spend', 'take'], answer: 'pay' },
      { type: 'listen', text: 'These shoes are on sale for thirty dollars.', options: ['These shoes are on sale for thirty dollars.', 'These shoes are on sale for thirteen dollars.', 'These shirts are on sale for thirty dollars.'], answer: 'These shoes are on sale for thirty dollars.' },
      { type: 'speak', text: 'Excuse me, how much does this jacket cost?' }
    ]
  },
  {
    id: 'l8', level: 2, order: 8, emoji: '🌦️', xp: 60,
    title: 'Weather & Seasons',
    goal: 'Talk about the weather and the four seasons.',
    exercises: [
      { type: 'vocab', prompt: 'You carry an umbrella when it is ___.', options: ['rainy', 'sunny', 'dry', 'hot'], answer: 'rainy' },
      { type: 'vocab', prompt: 'The coldest season is usually ___.', options: ['winter', 'summer', 'spring', 'autumn'], answer: 'winter' },
      { type: 'grammar', prompt: 'Complete: "It ___ raining right now."', options: ['is', 'are', 'be', 'am'], answer: 'is' },
      { type: 'grammar', prompt: 'Complete: "Yesterday it ___ very hot."', options: ['was', 'were', 'is', 'are'], answer: 'was' },
      { type: 'listen', text: "It's sunny today, but it will rain tomorrow.", options: ["It's sunny today, but it will rain tomorrow.", "It's sunny today, but it will snow tomorrow.", "It's windy today, but it will rain tomorrow."], answer: "It's sunny today, but it will rain tomorrow." },
      { type: 'speak', text: "What's the weather like today? It's warm and windy." }
    ]
  },
  {
    id: 'l9', level: 3, order: 9, emoji: '✈️', xp: 75,
    title: 'Travel & Plans',
    goal: 'Talk about future plans and travelling.',
    exercises: [
      { type: 'vocab', prompt: 'To "book a flight" means to ___.', options: ['reserve a seat on a plane', 'read about a plane', 'cancel a plane', 'fly a plane'], answer: 'reserve a seat on a plane' },
      { type: 'vocab', prompt: 'A "one-way ticket" lets you travel ___.', options: ['in one direction', 'there and back', 'for free', 'at any time'], answer: 'in one direction' },
      { type: 'grammar', prompt: 'Complete: "I ___ visit Japan next year."', options: ['am going to', 'go', 'went', 'going'], answer: 'am going to' },
      { type: 'grammar', prompt: 'Complete: "We ___ have left earlier to catch the train."', options: ['should', 'will', 'must not', 'can'], answer: 'should' },
      { type: 'listen', text: "I'm planning to travel to Italy next summer.", options: ["I'm planning to travel to Italy next summer.", "I'm planning to travel to Italy next winter.", "I'm planning to travel to Ireland next summer."], answer: "I'm planning to travel to Italy next summer." },
      { type: 'speak', text: "Next year I'm going to visit a new country and learn about its culture." }
    ]
  },
  {
    id: 'l10', level: 3, order: 10, emoji: '🩺', xp: 75,
    title: 'Health & Feelings',
    goal: 'Describe how you feel and talk about health.',
    exercises: [
      { type: 'vocab', prompt: 'If you have a headache, you might take ___.', options: ['medicine', 'a napkin', 'a ticket', 'a photo'], answer: 'medicine' },
      { type: 'vocab', prompt: 'To feel "exhausted" means to feel ___.', options: ['very tired', 'very happy', 'very hungry', 'very bored'], answer: 'very tired' },
      { type: 'grammar', prompt: 'Complete: "You ___ see a doctor if the pain continues."', options: ['should', 'would', 'were', 'have'], answer: 'should' },
      { type: 'grammar', prompt: 'Complete: "I feel ___ today than yesterday."', options: ['better', 'good', 'well', 'best'], answer: 'better' },
      { type: 'listen', text: "I've had a sore throat since Monday, so I booked an appointment.", options: ["I've had a sore throat since Monday, so I booked an appointment.", "I've had a sore throat since Sunday, so I booked an appointment.", "I've had a sore back since Monday, so I booked an appointment."], answer: "I've had a sore throat since Monday, so I booked an appointment." },
      { type: 'speak', text: "I don't feel well today. I think I should rest and drink plenty of water." }
    ]
  },
  {
    id: 'l11', level: 3, order: 11, emoji: '💼', xp: 75,
    title: 'Work & Studies',
    goal: 'Talk about your job, studies and deadlines.',
    exercises: [
      { type: 'vocab', prompt: 'A "deadline" is the ___ for finishing something.', options: ['final time', 'first day', 'salary', 'break'], answer: 'final time' },
      { type: 'vocab', prompt: 'To "apply for a job" means to ___.', options: ['formally ask for work', 'quit your job', 'pay for work', 'train other people'], answer: 'formally ask for work' },
      { type: 'grammar', prompt: 'Complete: "She has ___ working here for five years."', options: ['been', 'being', 'be', 'was'], answer: 'been' },
      { type: 'grammar', prompt: 'Complete: "By next month, I ___ this course."', options: ['will have finished', 'finish', 'finished', 'finishing'], answer: 'will have finished' },
      { type: 'listen', text: 'I need to finish this report before the deadline on Friday.', options: ['I need to finish this report before the deadline on Friday.', 'I need to finish this report before the deadline on Monday.', 'I need to start this report before the deadline on Friday.'], answer: 'I need to finish this report before the deadline on Friday.' },
      { type: 'speak', text: "I've been studying English for two years and I want to keep improving." }
    ]
  },
  {
    id: 'l12', level: 3, order: 12, emoji: '💬', xp: 75,
    title: 'Opinions & Future',
    goal: 'Give your opinion and talk about predictions.',
    exercises: [
      { type: 'vocab', prompt: 'To "agree" with someone means to ___.', options: ['share their opinion', 'argue with them', 'ignore them', 'forget them'], answer: 'share their opinion' },
      { type: 'vocab', prompt: 'A "prediction" is a statement about ___.', options: ['the future', 'the past', 'grammar', 'money'], answer: 'the future' },
      { type: 'grammar', prompt: 'Complete: "In my opinion, reading ___ one of the best ways to learn."', options: ['is', 'are', 'be', 'were'], answer: 'is' },
      { type: 'grammar', prompt: 'Complete: "If I had more time, I ___ travel more."', options: ['would', 'will', 'am', 'was'], answer: 'would' },
      { type: 'listen', text: 'In my opinion, technology will change the way we learn languages.', options: ['In my opinion, technology will change the way we learn languages.', 'In my opinion, technology will change the way we teach languages.', 'I believe technology will not change the way we learn.'], answer: 'In my opinion, technology will change the way we learn languages.' },
      { type: 'speak', text: 'In my opinion, learning a language opens new doors, and everyone should try it.' }
    ]
  }
];

// Collectible animals. Ollie (the octopus) is the guide and is always available.
// Everything else unlocks as the learner completes more lessons.
export const ANIMALS = [
  { id: 'octopus', name: 'Ollie the Octopus', emoji: '🐙', unlockAt: 0, fact: 'Ollie is your guide. Octopuses have three hearts and blue blood!' },
  { id: 'hermitcrab', name: 'Shelly the Hermit Crab', emoji: '🐚', unlockAt: 0, fact: 'A hermit crab swaps its shell for a bigger one as it grows.' },
  { id: 'seasnail', name: 'Nelly the Sea Snail', emoji: '🐌', unlockAt: 1, fact: 'Sea snails scrape their food with a tongue as rough as sandpaper.' },
  { id: 'krill', name: 'Kris the Krill', emoji: '🦐', unlockAt: 1, fact: 'Krill are tiny, yet a single whale can eat millions of them a day.' },
  { id: 'starfish', name: 'Stella the Starfish', emoji: '⭐', unlockAt: 2, fact: 'A starfish has no brain and can grow back an arm.' },
  { id: 'crab', name: 'Claude the Crab', emoji: '🦀', unlockAt: 2, fact: 'Crabs walk sideways and can regrow a lost claw.' },
  { id: 'lobster', name: 'Larry the Lobster', emoji: '🦞', unlockAt: 3, fact: 'Lobsters can live for more than 100 years.' },
  { id: 'oyster', name: 'Orla the Oyster', emoji: '🦪', unlockAt: 3, fact: 'One oyster can filter about 200 litres of water in a day.' },
  { id: 'coral', name: 'Coco the Coral', emoji: '🪸', unlockAt: 4, fact: 'Coral looks like a plant, but it is a colony of tiny animals.' },
  { id: 'seahorse', name: 'Sammy the Seahorse', emoji: '🐴', unlockAt: 4, fact: 'Seahorse males carry and give birth to the babies.' },
  { id: 'clownfish', name: 'Coral the Clownfish', emoji: '🐠', unlockAt: 4, fact: 'Clownfish live safely among the tentacles of sea anemones.' },
  { id: 'fish', name: 'Finn the Flying Fish', emoji: '🐟', unlockAt: 5, fact: 'Flying fish can glide above the water for over 200 metres.' },
  { id: 'pufferfish', name: 'Pearl the Pufferfish', emoji: '🐡', unlockAt: 5, fact: 'Pufferfish can inflate to three times their normal size.' },
  { id: 'squid', name: 'Quincy the Squid', emoji: '🦑', unlockAt: 6, fact: 'Squid have three hearts and can change colour in a blink.' },
  { id: 'jellyfish', name: 'Jelly the Jellyfish', emoji: '🪼', unlockAt: 6, fact: 'Jellyfish drifted in the sea long before the dinosaurs appeared.' },
  { id: 'turtle', name: 'Tina the Turtle', emoji: '🐢', unlockAt: 7, fact: 'Sea turtles have existed for more than 100 million years.' },
  { id: 'otter', name: 'Otto the Sea Otter', emoji: '🦦', unlockAt: 7, fact: 'Sea otters hold hands while they sleep so they do not drift apart.' },
  { id: 'penguin', name: 'Penny the Penguin', emoji: '🐧', unlockAt: 8, fact: 'Penguins cannot fly, but they are amazing swimmers.' },
  { id: 'seal', name: 'Sam the Seal', emoji: '🦭', unlockAt: 8, fact: 'Elephant seals can hold their breath for almost two hours.' },
  { id: 'dolphin', name: 'Dotty the Dolphin', emoji: '🐬', unlockAt: 8, fact: 'Dolphins call each other by their own unique names.' },
  { id: 'greywhale', name: 'Gulp the Grey Whale', emoji: '🐳', unlockAt: 9, fact: 'Grey whales swim more than 20,000 kilometres every year.' },
  { id: 'crocodile', name: 'Croco the Saltwater Crocodile', emoji: '🐊', unlockAt: 9, fact: 'Saltwater crocodiles swim far out into the open ocean.' },
  { id: 'whale', name: 'Wally the Whale', emoji: '🐋', unlockAt: 10, fact: 'A blue whale\'s heart is as big as a small car.' },
  { id: 'leatherback', name: 'Sheldon the Leatherback Turtle', emoji: '🐢', unlockAt: 10, fact: 'Leatherback turtles dive deeper than 1,000 metres to hunt jellyfish.' },
  { id: 'shark', name: 'Rex the Reef Shark', emoji: '🦈', unlockAt: 11, fact: 'Sharks existed before trees did. Now that is old school!' },
  { id: 'dumbo', name: 'Inky the Dumbo Octopus', emoji: '🐙', unlockAt: 11, fact: 'The dumbo octopus flaps its fins like ears to glide through the deep.' },
  { id: 'hammerhead', name: 'Hammy the Hammerhead Shark', emoji: '🦈', unlockAt: 12, fact: 'A hammerhead can see almost all the way around itself.' },
  { id: 'stingray', name: 'Sandy the Stingray', emoji: '🥏', unlockAt: 12, fact: 'Stingrays are close relatives of sharks.' }
];

// Achievement badges, derived from the learner's statistics.
export const BADGES = [
  { id: 'first-step', name: 'First Splash', emoji: '💧', desc: 'Finish your first lesson', test: (s) => s.lessonsCompleted >= 1 },
  { id: 'on-a-roll', name: 'On a Roll', emoji: '🔥', desc: 'Complete 3 lessons', test: (s) => s.lessonsCompleted >= 3 },
  { id: 'half-way', name: 'Half Way There', emoji: '🧭', desc: 'Complete 6 lessons', test: (s) => s.lessonsCompleted >= 6 },
  { id: 'sharp-eye', name: 'Sharp Eye', emoji: '🎯', desc: 'Score 100% in a lesson', test: (s) => s.perfectLessons >= 1 },
  { id: 'wordsmith', name: 'Wordsmith', emoji: '📚', desc: 'Earn 300 XP', test: (s) => s.xp >= 300 },
  { id: 'ocean-master', name: 'Ocean Master', emoji: '🌊', desc: 'Complete every lesson', test: (s) => s.lessonsCompleted >= 12 }
];

export function publicLessons() {
  return LESSONS.map((l) => ({
    id: l.id,
    level: l.level,
    order: l.order,
    emoji: l.emoji,
    xp: l.xp,
    title: l.title,
    goal: l.goal,
    exerciseCount: l.exercises.length,
    types: [...new Set(l.exercises.map((e) => e.type))]
  }));
}

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id) || null;
}

/* ----------------------------------- games -------------------------------- */

// Games are played in the browser; the server only stores and ranks the scores.
export const GAMES = [
  {
    id: 'wordrush',
    name: 'Word Rush',
    tagline: 'Match the word to its meaning before time runs out.',
    how: '45 seconds. Each correct answer adds points and builds a combo. Three wrong answers end the run.',
    color: '#f97316',
    scoreUnit: 'pts'
  },
  {
    id: 'listen',
    name: 'Listen & Tap',
    tagline: 'Hear a word, then tap the word you heard.',
    how: '45 seconds. Tap the speaker to replay. Build a combo for bonus points.',
    color: '#0ea5b7',
    scoreUnit: 'pts'
  },
  {
    id: 'memory',
    name: 'Memory Dive',
    tagline: 'Flip the tiles and pair every word with its meaning.',
    how: 'Fewer moves and faster finishes give a higher score.',
    color: '#7c5cff',
    scoreUnit: 'pts'
  }
];

// Words used by the games (and pronounced with real audio).
export const WORD_BANK = [
  { word: 'apple', meaning: 'a round fruit that can be red or green', emoji: '🍎' },
  { word: 'water', meaning: 'the clear liquid that we drink', emoji: '💧' },
  { word: 'house', meaning: 'a building where people live', emoji: '🏠' },
  { word: 'friend', meaning: 'a person you like and trust', emoji: '🤝' },
  { word: 'happy', meaning: 'feeling good and pleased', emoji: '😊' },
  { word: 'run', meaning: 'to move fast on your feet', emoji: '🏃' },
  { word: 'book', meaning: 'pages with words that you read', emoji: '📖' },
  { word: 'bread', meaning: 'a baked food made from flour', emoji: '🍞' },
  { word: 'mountain', meaning: 'a very high hill', emoji: '⛰️' },
  { word: 'teacher', meaning: 'a person who helps you learn', emoji: '🎓' },
  { word: 'city', meaning: 'a large town with many people', emoji: '🏙️' },
  { word: 'car', meaning: 'a vehicle with four wheels', emoji: '🚗' },
  { word: 'sleep', meaning: 'to rest with your eyes closed', emoji: '😴' },
  { word: 'morning', meaning: 'the early part of the day', emoji: '🌅' },
  { word: 'family', meaning: 'parents and children together', emoji: '👨‍👩‍👧' },
  { word: 'music', meaning: 'sounds made by instruments or voices', emoji: '🎵' },
  { word: 'garden', meaning: 'a place where plants grow', emoji: '🌷' },
  { word: 'river', meaning: 'a long natural stream of water', emoji: '🏞️' },
  { word: 'winter', meaning: 'the coldest season of the year', emoji: '❄️' },
  { word: 'doctor', meaning: 'a person who helps sick people', emoji: '🩺' },
  { word: 'train', meaning: 'a long vehicle that runs on tracks', emoji: '🚆' },
  { word: 'cheese', meaning: 'a food made from milk', emoji: '🧀' },
  { word: 'cloud', meaning: 'a white or grey shape in the sky', emoji: '☁️' },
  { word: 'letter', meaning: 'a written message that you send', emoji: '✉️' },
  { word: 'window', meaning: 'glass that you look through', emoji: '🪟' },
  { word: 'kitchen', meaning: 'the room where you cook', emoji: '🍳' },
  { word: 'hungry', meaning: 'wanting to eat something', emoji: '🍽️' },
  { word: 'beautiful', meaning: 'very pretty to look at', emoji: '🌸' },
  { word: 'quickly', meaning: 'in a fast way', emoji: '⚡' },
  { word: 'remember', meaning: 'to keep something in your mind', emoji: '🧠' },
  { word: 'question', meaning: 'something that you ask', emoji: '💬' },
  { word: 'answer', meaning: 'what you say back to a question', emoji: '✅' },
  { word: 'holiday', meaning: 'a time when you do not work', emoji: '🏖️' },
  { word: 'forest', meaning: 'a large area with many trees', emoji: '🌲' },
  { word: 'ocean', meaning: 'a very big sea', emoji: '🌊' },
  { word: 'computer', meaning: 'a machine for work and games', emoji: '💻' },
  { word: 'bicycle', meaning: 'a vehicle with two wheels', emoji: '🚲' },
  { word: 'airport', meaning: 'a place where planes land', emoji: '✈️' },
  { word: 'birthday', meaning: 'the day you were born', emoji: '🎂' },
  { word: 'umbrella', meaning: 'you use it when it rains', emoji: '☔' }
];
