const cases = [
  {
    id: 1,
    title: "Q版3D人物求婚场景",
    prompt: "...",
    imageUrl: "./zika/annimals/animal_flashcard.jpg",
    originalImageUrl: "./images/animal_flashcard_original.jpg",
    previewImageUrl: "./images/animal_flashcard_preview.jpg",
    category: "英文动物卡"
  },
  {
    id: 2,
    title: "Q版3D人物求婚场景",
    prompt: "...",
    imageUrl: "./zika/annimals/ant_flashcard.jpg",
    originalImageUrl: "./images/ant_flashcard_original.jpg",
    previewImageUrl: "./images/ant_flashcard_preview.jpg",
    category: "英文动物卡"
  },
  {
    id: 3,
    title: "Bat Flashcard",
    prompt: "英文动物学习卡：Bat",
    imageUrl: "./zika/annimals/bat_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 4,
    title: "Bear Flashcard",
    prompt: "英文动物学习卡：Bear",
    imageUrl: "./zika/annimals/bear_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 5,
    title: "Bee Flashcard",
    prompt: "英文动物学习卡：Bee",
    imageUrl: "./zika/annimals/bee_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 6,
    title: "Bird Flashcard",
    prompt: "英文动物学习卡：Bird",
    imageUrl: "./zika/annimals/bird_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 7,
    title: "Butterfly Flashcard",
    prompt: "英文动物学习卡：Butterfly",
    imageUrl: "./zika/annimals/butterfly_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 8,
    title: "Cat Flashcard",
    prompt: "英文动物学习卡：Cat",
    imageUrl: "./zika/annimals/cat_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 9,
    title: "Chicken Flashcard",
    prompt: "英文动物学习卡：Chicken",
    imageUrl: "./zika/annimals/chicken_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 10,
    title: "Chipmunk Flashcard",
    prompt: "英文动物学习卡：Chipmunk",
    imageUrl: "./zika/annimals/chipmunk_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 11,
    title: "Cow Flashcard",
    prompt: "英文动物学习卡：Cow",
    imageUrl: "./zika/annimals/cow_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 12,
    title: "Crab Flashcard",
    prompt: "英文动物学习卡：Crab",
    imageUrl: "./zika/annimals/crab_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 13,
    title: "Cricket Flashcard",
    prompt: "英文动物学习卡：Cricket",
    imageUrl: "./zika/annimals/cricket_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 14,
    title: "Crocodile Flashcard",
    prompt: "英文动物学习卡：Crocodile",
    imageUrl: "./zika/annimals/crocodile_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 15,
    title: "Deer Flashcard",
    prompt: "英文动物学习卡：Deer",
    imageUrl: "./zika/annimals/deer_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 16,
    title: "Dog Flashcard",
    prompt: "英文动物学习卡：Dog",
    imageUrl: "./zika/annimals/dog_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 17,
    title: "Dolphin Flashcard",
    prompt: "英文动物学习卡：Dolphin",
    imageUrl: "./zika/annimals/dolphin_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 18,
    title: "Dragonfly Flashcard",
    prompt: "英文动物学习卡：Dragonfly",
    imageUrl: "./zika/annimals/dragonfly_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 19,
    title: "Duck Flashcard",
    prompt: "英文动物学习卡：Duck",
    imageUrl: "./zika/annimals/duck_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 20,
    title: "Elephant Flashcard",
    prompt: "英文动物学习卡：Elephant",
    imageUrl: "./zika/annimals/elephant_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 21,
    title: "Firefly Flashcard",
    prompt: "英文动物学习卡：Firefly",
    imageUrl: "./zika/annimals/firefly_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 22,
    title: "Fish Flashcard",
    prompt: "英文动物学习卡：Fish",
    imageUrl: "./zika/annimals/fish_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 23,
    title: "Fox Flashcard",
    prompt: "英文动物学习卡：Fox",
    imageUrl: "./zika/annimals/fox_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 24,
    title: "Frog Flashcard",
    prompt: "英文动物学习卡：Frog",
    imageUrl: "./zika/annimals/frog_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 25,
    title: "Giraffe Flashcard",
    prompt: "英文动物学习卡：Giraffe",
    imageUrl: "./zika/annimals/giraffe_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 26,
    title: "Goat Flashcard",
    prompt: "英文动物学习卡：Goat",
    imageUrl: "./zika/annimals/goat_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 27,
    title: "Grasshopper Flashcard",
    prompt: "英文动物学习卡：Grasshopper",
    imageUrl: "./zika/annimals/grasshopper_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 28,
    title: "Hedgehog Flashcard",
    prompt: "英文动物学习卡：Hedgehog",
    imageUrl: "./zika/annimals/hedgehog_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 29,
    title: "Hippo Flashcard",
    prompt: "英文动物学习卡：Hippo",
    imageUrl: "./zika/annimals/hippo_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 30,
    title: "Horse Flashcard",
    prompt: "英文动物学习卡：Horse",
    imageUrl: "./zika/annimals/horse_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 31,
    title: "Jellyfish Flashcard",
    prompt: "英文动物学习卡：Jellyfish",
    imageUrl: "./zika/annimals/jellyfish_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 32,
    title: "Kangaroo Flashcard",
    prompt: "英文动物学习卡：Kangaroo",
    imageUrl: "./zika/annimals/kangaroo_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 33,
    title: "Lion Flashcard",
    prompt: "英文动物学习卡：Lion",
    imageUrl: "./zika/annimals/lion_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 34,
    title: "Lizard Flashcard",
    prompt: "英文动物学习卡：Lizard",
    imageUrl: "./zika/annimals/lizard_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 35,
    title: "Lobster Flashcard",
    prompt: "英文动物学习卡：Lobster",
    imageUrl: "./zika/annimals/lobster_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 36,
    title: "Monkey Flashcard",
    prompt: "英文动物学习卡：Monkey",
    imageUrl: "./zika/annimals/monkey_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 37,
    title: "Mouse Flashcard",
    prompt: "英文动物学习卡：Mouse",
    imageUrl: "./zika/annimals/mouse_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 38,
    title: "Octopus Flashcard",
    prompt: "英文动物学习卡：Octopus",
    imageUrl: "./zika/annimals/octopus_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 39,
    title: "Owl Flashcard",
    prompt: "英文动物学习卡：Owl",
    imageUrl: "./zika/annimals/owl_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 40,
    title: "Panda Flashcard",
    prompt: "英文动物学习卡：Panda",
    imageUrl: "./zika/annimals/panda_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 41,
    title: "Parrot Flashcard",
    prompt: "英文动物学习卡：Parrot",
    imageUrl: "./zika/annimals/parrot_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 42,
    title: "Penguin Flashcard",
    prompt: "英文动物学习卡：Penguin",
    imageUrl: "./zika/annimals/penguin_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 43,
    title: "Rabbit Flashcard",
    prompt: "英文动物学习卡：Rabbit",
    imageUrl: "./zika/annimals/rabbit_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 44,
    title: "Seal Flashcard",
    prompt: "英文动物学习卡：Seal",
    imageUrl: "./zika/annimals/seal_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 45,
    title: "Sheep Flashcard",
    prompt: "英文动物学习卡：Sheep",
    imageUrl: "./zika/annimals/sheep_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 46,
    title: "Shrimp Flashcard",
    prompt: "英文动物学习卡：Shrimp",
    imageUrl: "./zika/annimals/shrimp_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 47,
    title: "Spider Flashcard",
    prompt: "英文动物学习卡：Spider",
    imageUrl: "./zika/annimals/spider_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 48,
    title: "Squirrel Flashcard",
    prompt: "英文动物学习卡：Squirrel",
    imageUrl: "./zika/annimals/squirrel_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 49,
    title: "Starfish Flashcard",
    prompt: "英文动物学习卡：Starfish",
    imageUrl: "./zika/annimals/starfish_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 50,
    title: "Tiger Flashcard",
    prompt: "英文动物学习卡：Tiger",
    imageUrl: "./zika/annimals/tiger_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 51,
    title: "Turtle Flashcard",
    prompt: "英文动物学习卡：Turtle",
    imageUrl: "./zika/annimals/turtle_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 52,
    title: "Walrus Flashcard",
    prompt: "英文动物学习卡：Walrus",
    imageUrl: "./zika/annimals/walrus_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 53,
    title: "Whale Flashcard",
    prompt: "英文动物学习卡：Whale",
    imageUrl: "./zika/annimals/whale_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 54,
    title: "Wolf Flashcard",
    prompt: "英文动物学习卡：Wolf",
    imageUrl: "./zika/annimals/wolf_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 55,
    title: "Zebra Flashcard",
    prompt: "英文动物学习卡：Zebra",
    imageUrl: "./zika/annimals/zebra_flashcard.jpg",
    category: "英文动物卡"
  },
  {
    id: 56,
    title: "Apple Flashcard",
    prompt: "英文水果学习卡：Apple",
    imageUrl: "./zika/fruits/apple_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 57,
    title: "Apricot Flashcard",
    prompt: "英文水果学习卡：Apricot",
    imageUrl: "./zika/fruits/apricot_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 58,
    title: "Banana Flashcard",
    prompt: "英文水果学习卡：Banana",
    imageUrl: "./zika/fruits/banana_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 59,
    title: "Blackberry Flashcard",
    prompt: "英文水果学习卡：Blackberry",
    imageUrl: "./zika/fruits/blackberry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 60,
    title: "Blueberry Flashcard",
    prompt: "英文水果学习卡：Blueberry",
    imageUrl: "./zika/fruits/blueberry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 61,
    title: "Cantaloupe Flashcard",
    prompt: "英文水果学习卡：Cantaloupe",
    imageUrl: "./zika/fruits/cantaloupe_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 62,
    title: "Cherry Flashcard",
    prompt: "英文水果学习卡：Cherry",
    imageUrl: "./zika/fruits/cherry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 63,
    title: "Coconut Flashcard",
    prompt: "英文水果学习卡：Coconut",
    imageUrl: "./zika/fruits/coconut_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 64,
    title: "Cranberry Flashcard",
    prompt: "英文水果学习卡：Cranberry",
    imageUrl: "./zika/fruits/cranberry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 65,
    title: "Date Flashcard",
    prompt: "英文水果学习卡：Date",
    imageUrl: "./zika/fruits/date_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 66,
    title: "Dragon Fruit Flashcard",
    prompt: "英文水果学习卡：Dragon Fruit",
    imageUrl: "./zika/fruits/dragon_fruit_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 67,
    title: "Durian Flashcard",
    prompt: "英文水果学习卡：Durian",
    imageUrl: "./zika/fruits/durian_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 68,
    title: "Fig Flashcard",
    prompt: "英文水果学习卡：Fig",
    imageUrl: "./zika/fruits/fig_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 69,
    title: "Gooseberry Flashcard",
    prompt: "英文水果学习卡：Gooseberry",
    imageUrl: "./zika/fruits/gooseberry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 70,
    title: "Grape Flashcard",
    prompt: "英文水果学习卡：Grape",
    imageUrl: "./zika/fruits/grape_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 71,
    title: "Grapefruit Flashcard",
    prompt: "英文水果学习卡：Grapefruit",
    imageUrl: "./zika/fruits/grapefruit_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 72,
    title: "Guava Flashcard",
    prompt: "英文水果学习卡：Guava",
    imageUrl: "./zika/fruits/guava_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 73,
    title: "Honeydew Flashcard",
    prompt: "英文水果学习卡：Honeydew",
    imageUrl: "./zika/fruits/honeydew_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 74,
    title: "Kiwi Flashcard",
    prompt: "英文水果学习卡：Kiwi",
    imageUrl: "./zika/fruits/kiwi_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 75,
    title: "Lemon Flashcard",
    prompt: "英文水果学习卡：Lemon",
    imageUrl: "./zika/fruits/lemon_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 76,
    title: "Longan Flashcard",
    prompt: "英文水果学习卡：Longan",
    imageUrl: "./zika/fruits/longan_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 77,
    title: "Mango Flashcard",
    prompt: "英文水果学习卡：Mango",
    imageUrl: "./zika/fruits/mango_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 78,
    title: "Mulberry Flashcard",
    prompt: "英文水果学习卡：Mulberry",
    imageUrl: "./zika/fruits/mulberry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 79,
    title: "Orange Flashcard",
    prompt: "英文水果学习卡：Orange",
    imageUrl: "./zika/fruits/orange_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 80,
    title: "Papaya Flashcard",
    prompt: "英文水果学习卡：Papaya",
    imageUrl: "./zika/fruits/papaya_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 81,
    title: "Passion Fruit Flashcard",
    prompt: "英文水果学习卡：Passion Fruit",
    imageUrl: "./zika/fruits/passion_fruit_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 82,
    title: "Peach Flashcard",
    prompt: "英文水果学习卡：Peach",
    imageUrl: "./zika/fruits/peach_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 83,
    title: "Pear Flashcard",
    prompt: "英文水果学习卡：Pear",
    imageUrl: "./zika/fruits/pear_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 84,
    title: "Pineapple Flashcard",
    prompt: "英文水果学习卡：Pineapple",
    imageUrl: "./zika/fruits/pineapple_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 85,
    title: "Plum Flashcard",
    prompt: "英文水果学习卡：Plum",
    imageUrl: "./zika/fruits/plum_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 86,
    title: "Pomegranate Flashcard",
    prompt: "英文水果学习卡：Pomegranate",
    imageUrl: "./zika/fruits/pomegranate_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 87,
    title: "Raspberry Flashcard",
    prompt: "英文水果学习卡：Raspberry",
    imageUrl: "./zika/fruits/raspberry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 88,
    title: "Sapodilla Flashcard",
    prompt: "英文水果学习卡：Sapodilla",
    imageUrl: "./zika/fruits/sapodilla_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 89,
    title: "Star Fruit Flashcard",
    prompt: "英文水果学习卡：Star Fruit",
    imageUrl: "./zika/fruits/star_fruit_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 90,
    title: "Strawberry Flashcard",
    prompt: "英文水果学习卡：Strawberry",
    imageUrl: "./zika/fruits/strawberry_flashcard.jpg",
    category: "英文水果卡"
  },
  {
    id: 91,
    title: "Actor Flashcard",
    prompt: "英文人物学习卡：Actor",
    imageUrl: "./zika/persons/actor_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 92,
    title: "Actress Flashcard",
    prompt: "英文人物学习卡：Actress",
    imageUrl: "./zika/persons/actress_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 93,
    title: "Architect Flashcard",
    prompt: "英文人物学习卡：Architect",
    imageUrl: "./zika/persons/architect_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 94,
    title: "Astronaut Flashcard",
    prompt: "英文人物学习卡：Astronaut",
    imageUrl: "./zika/persons/astronaut_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 95,
    title: "Athlete Flashcard",
    prompt: "英文人物学习卡：Athlete",
    imageUrl: "./zika/persons/athlete_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 96,
    title: "Aunt Flashcard",
    prompt: "英文人物学习卡：Aunt",
    imageUrl: "./zika/persons/aunt_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 97,
    title: "Baby Flashcard",
    prompt: "英文人物学习卡：Baby",
    imageUrl: "./zika/persons/baby_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 98,
    title: "Boy Flashcard",
    prompt: "英文人物学习卡：Boy",
    imageUrl: "./zika/persons/boy_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 99,
    title: "Brother Flashcard",
    prompt: "英文人物学习卡：Brother",
    imageUrl: "./zika/persons/brother_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 100,
    title: "Businessman Flashcard",
    prompt: "英文人物学习卡：Businessman",
    imageUrl: "./zika/persons/businessman_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 101,
    title: "Chef Flashcard",
    prompt: "英文人物学习卡：Chef",
    imageUrl: "./zika/persons/chef_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 102,
    title: "Child Flashcard",
    prompt: "英文人物学习卡：Child",
    imageUrl: "./zika/persons/child_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 103,
    title: "Cook Flashcard",
    prompt: "英文人物学习卡：Cook",
    imageUrl: "./zika/persons/cook_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 104,
    title: "Dancer Flashcard",
    prompt: "英文人物学习卡：Dancer",
    imageUrl: "./zika/persons/dancer_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 105,
    title: "Dentist Flashcard",
    prompt: "英文人物学习卡：Dentist",
    imageUrl: "./zika/persons/dentist_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 106,
    title: "Doctor Flashcard",
    prompt: "英文人物学习卡：Doctor",
    imageUrl: "./zika/persons/doctor_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 107,
    title: "Driver Flashcard",
    prompt: "英文人物学习卡：Driver",
    imageUrl: "./zika/persons/driver_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 108,
    title: "Engineer Flashcard",
    prompt: "英文人物学习卡：Engineer",
    imageUrl: "./zika/persons/engineer_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 109,
    title: "Father Flashcard",
    prompt: "英文人物学习卡：Father",
    imageUrl: "./zika/persons/father_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 110,
    title: "Firefighter Flashcard",
    prompt: "英文人物学习卡：Firefighter",
    imageUrl: "./zika/persons/firefighter_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 111,
    title: "Fisherman Flashcard",
    prompt: "英文人物学习卡：Fisherman",
    imageUrl: "./zika/persons/fisherman_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 112,
    title: "Friend Flashcard",
    prompt: "英文人物学习卡：Friend",
    imageUrl: "./zika/persons/friend_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 113,
    title: "Girl Flashcard",
    prompt: "英文人物学习卡：Girl",
    imageUrl: "./zika/persons/girl_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 114,
    title: "Grandfather Flashcard",
    prompt: "英文人物学习卡：Grandfather",
    imageUrl: "./zika/persons/grandfather_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 115,
    title: "Grandmother Flashcard",
    prompt: "英文人物学习卡：Grandmother",
    imageUrl: "./zika/persons/grandmother_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 116,
    title: "Judge Flashcard",
    prompt: "英文人物学习卡：Judge",
    imageUrl: "./zika/persons/judge_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 117,
    title: "Lawyer Flashcard",
    prompt: "英文人物学习卡：Lawyer",
    imageUrl: "./zika/persons/lawyer_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 118,
    title: "Librarian Flashcard",
    prompt: "英文人物学习卡：Librarian",
    imageUrl: "./zika/persons/librarian_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 119,
    title: "Man Flashcard",
    prompt: "英文人物学习卡：Man",
    imageUrl: "./zika/persons/man_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 120,
    title: "Mechanic Flashcard",
    prompt: "英文人物学习卡：Mechanic",
    imageUrl: "./zika/persons/mechanic_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 121,
    title: "Mother Flashcard",
    prompt: "英文人物学习卡：Mother",
    imageUrl: "./zika/persons/mother_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 122,
    title: "Musician Flashcard",
    prompt: "英文人物学习卡：Musician",
    imageUrl: "./zika/persons/musician_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 123,
    title: "Nurse Flashcard",
    prompt: "英文人物学习卡：Nurse",
    imageUrl: "./zika/persons/nurse_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 124,
    title: "Painter Flashcard",
    prompt: "英文人物学习卡：Painter",
    imageUrl: "./zika/persons/painter_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 125,
    title: "Photographer Flashcard",
    prompt: "英文人物学习卡：Photographer",
    imageUrl: "./zika/persons/photographer_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 126,
    title: "Pilot Flashcard",
    prompt: "英文人物学习卡：Pilot",
    imageUrl: "./zika/persons/pilot_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 127,
    title: "Policeman Flashcard",
    prompt: "英文人物学习卡：Policeman",
    imageUrl: "./zika/persons/policeman_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 128,
    title: "Programmer Flashcard",
    prompt: "英文人物学习卡：Programmer",
    imageUrl: "./zika/persons/programmer_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 129,
    title: "Reporter Flashcard",
    prompt: "英文人物学习卡：Reporter",
    imageUrl: "./zika/persons/reporter_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 130,
    title: "Sailor Flashcard",
    prompt: "英文人物学习卡：Sailor",
    imageUrl: "./zika/persons/sailor_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 131,
    title: "Teacher Flashcard",
    prompt: "英文人物学习卡：Teacher",
    imageUrl: "./zika/persons/teacher_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 132,
    title: "Traffic Policeman Flashcard",
    prompt: "英文人物学习卡：Traffic Policeman",
    imageUrl: "./zika/persons/traffic_policeman_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 133,
    title: "Uncle Flashcard",
    prompt: "英文人物学习卡：Uncle",
    imageUrl: "./zika/persons/uncle_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 134,
    title: "Waiter Flashcard",
    prompt: "英文人物学习卡：Waiter",
    imageUrl: "./zika/persons/waiter_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 135,
    title: "Writer Flashcard",
    prompt: "英文人物学习卡：Writer",
    imageUrl: "./zika/persons/writer_flashcard.jpg",
    category: "英文人物卡"
  },
  {
    id: 136,
    title: "Bike Flashcard",
    prompt: "英文交通工具学习卡：Bike",
    imageUrl: "./zika/trafics/bike_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 137,
    title: "Boat Flashcard",
    prompt: "英文交通工具学习卡：Boat",
    imageUrl: "./zika/trafics/boat_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 138,
    title: "Bulldozer Flashcard",
    prompt: "英文交通工具学习卡：Bulldozer",
    imageUrl: "./zika/trafics/bulldozer_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 139,
    title: "Bus Flashcard",
    prompt: "英文交通工具学习卡：Bus",
    imageUrl: "./zika/trafics/bus_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 140,
    title: "Cable Car Flashcard",
    prompt: "英文交通工具学习卡：Cable Car",
    imageUrl: "./zika/trafics/cable_car_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 141,
    title: "Car Flashcard",
    prompt: "英文交通工具学习卡：Car",
    imageUrl: "./zika/trafics/car_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 142,
    title: "Carriage Flashcard",
    prompt: "英文交通工具学习卡：Carriage",
    imageUrl: "./zika/trafics/carriage_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 143,
    title: "Excavator Flashcard",
    prompt: "英文交通工具学习卡：Excavator",
    imageUrl: "./zika/trafics/excavator_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 144,
    title: "Ferry Flashcard",
    prompt: "英文交通工具学习卡：Ferry",
    imageUrl: "./zika/trafics/ferry_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 145,
    title: "Fire Engine Flashcard",
    prompt: "英文交通工具学习卡：Fire Engine",
    imageUrl: "./zika/trafics/fire_engine_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 146,
    title: "Forklift Flashcard",
    prompt: "英文交通工具学习卡：Forklift",
    imageUrl: "./zika/trafics/forklift_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 147,
    title: "Helicopter Flashcard",
    prompt: "英文交通工具学习卡：Helicopter",
    imageUrl: "./zika/trafics/helicopter_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 148,
    title: "Hot Air Balloon Flashcard",
    prompt: "英文交通工具学习卡：Hot Air Balloon",
    imageUrl: "./zika/trafics/hot_air_balloon_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 149,
    title: "Hovercraft Flashcard",
    prompt: "英文交通工具学习卡：Hovercraft",
    imageUrl: "./zika/trafics/hovercraft_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 150,
    title: "Jeep Flashcard",
    prompt: "英文交通工具学习卡：Jeep",
    imageUrl: "./zika/trafics/jeep_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 151,
    title: "Monorail Flashcard",
    prompt: "英文交通工具学习卡：Monorail",
    imageUrl: "./zika/trafics/monorail_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 152,
    title: "Motorcycle Flashcard",
    prompt: "英文交通工具学习卡：Motorcycle",
    imageUrl: "./zika/trafics/motorcycle_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 153,
    title: "Plane Flashcard",
    prompt: "英文交通工具学习卡：Plane",
    imageUrl: "./zika/trafics/plane_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 154,
    title: "Police Car Flashcard",
    prompt: "英文交通工具学习卡：Police Car",
    imageUrl: "./zika/trafics/police_car_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 155,
    title: "Rickshaw Flashcard",
    prompt: "英文交通工具学习卡：Rickshaw",
    imageUrl: "./zika/trafics/rickshaw_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 156,
    title: "Rocket Flashcard",
    prompt: "英文交通工具学习卡：Rocket",
    imageUrl: "./zika/trafics/rocket_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 157,
    title: "Scooter Flashcard",
    prompt: "英文交通工具学习卡：Scooter",
    imageUrl: "./zika/trafics/scooter_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 158,
    title: "Segway Flashcard",
    prompt: "英文交通工具学习卡：Segway",
    imageUrl: "./zika/trafics/segway_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 159,
    title: "Ship Flashcard",
    prompt: "英文交通工具学习卡：Ship",
    imageUrl: "./zika/trafics/ship_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 160,
    title: "Skateboard Flashcard",
    prompt: "英文交通工具学习卡：Skateboard",
    imageUrl: "./zika/trafics/skateboard_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 161,
    title: "Subway Flashcard",
    prompt: "英文交通工具学习卡：Subway",
    imageUrl: "./zika/trafics/subway_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 162,
    title: "Taxi Flashcard",
    prompt: "英文交通工具学习卡：Taxi",
    imageUrl: "./zika/trafics/taxi_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 163,
    title: "Tractor Flashcard",
    prompt: "英文交通工具学习卡：Tractor",
    imageUrl: "./zika/trafics/tractor_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 164,
    title: "Train Flashcard",
    prompt: "英文交通工具学习卡：Train",
    imageUrl: "./zika/trafics/train_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 165,
    title: "Tram Flashcard",
    prompt: "英文交通工具学习卡：Tram",
    imageUrl: "./zika/trafics/tram_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 166,
    title: "Trolleybus Flashcard",
    prompt: "英文交通工具学习卡：Trolleybus",
    imageUrl: "./zika/trafics/trolleybus_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 167,
    title: "Truck Flashcard",
    prompt: "英文交通工具学习卡：Truck",
    imageUrl: "./zika/trafics/truck_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 168,
    title: "Van Flashcard",
    prompt: "英文交通工具学习卡：Van",
    imageUrl: "./zika/trafics/van_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 169,
    title: "Yacht Flashcard",
    prompt: "英文交通工具学习卡：Yacht",
    imageUrl: "./zika/trafics/yacht_flashcard.jpg",
    category: "英文交通工具卡"
  },
  {
    id: 170,
    title: "爱字卡",
    prompt: "汉字学习卡：爱",
    imageUrl: "./zika/hanzi/爱字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 171,
    title: "安字卡",
    prompt: "汉字学习卡：安",
    imageUrl: "./zika/hanzi/安字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 172,
    title: "巴字卡",
    prompt: "汉字学习卡：巴",
    imageUrl: "./zika/hanzi/巴字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 173,
    title: "把字卡",
    prompt: "汉字学习卡：把",
    imageUrl: "./zika/hanzi/把字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 174,
    title: "草字卡",
    prompt: "汉字学习卡：草",
    imageUrl: "./zika/hanzi/草字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 175,
    title: "春字卡",
    prompt: "汉字学习卡：春",
    imageUrl: "./zika/hanzi/春字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 176,
    title: "答字卡",
    prompt: "汉字学习卡：答",
    imageUrl: "./zika/hanzi/答字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 177,
    title: "地字卡",
    prompt: "汉字学习卡：地",
    imageUrl: "./zika/hanzi/地字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 178,
    title: "电子卡",
    prompt: "汉字学习卡：电",
    imageUrl: "./zika/hanzi/电子卡.jpg",
    category: "汉字卡"
  },
  {
    id: 179,
    title: "冬字卡",
    prompt: "汉字学习卡：冬",
    imageUrl: "./zika/hanzi/冬字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 180,
    title: "秋字卡",
    prompt: "汉字学习卡：秋",
    imageUrl: "./zika/hanzi/秋字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 181,
    title: "森字卡",
    prompt: "汉字学习卡：森",
    imageUrl: "./zika/hanzi/森字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 182,
    title: "善字卡",
    prompt: "汉字学习卡：善",
    imageUrl: "./zika/hanzi/善字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 183,
    title: "树字卡",
    prompt: "汉字学习卡：树",
    imageUrl: "./zika/hanzi/树字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 184,
    title: "松字卡",
    prompt: "汉字学习卡：松",
    imageUrl: "./zika/hanzi/松字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 185,
    title: "桃字卡",
    prompt: "汉字学习卡：桃",
    imageUrl: "./zika/hanzi/桃字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 186,
    title: "听字卡",
    prompt: "汉字学习卡：听",
    imageUrl: "./zika/hanzi/听字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 187,
    title: "童字卡",
    prompt: "汉字学习卡：童",
    imageUrl: "./zika/hanzi/童字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 188,
    title: "兔字卡",
    prompt: "汉字学习卡：兔",
    imageUrl: "./zika/hanzi/兔字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 189,
    title: "望字卡",
    prompt: "汉字学习卡：望",
    imageUrl: "./zika/hanzi/望字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 190,
    title: "尾字卡",
    prompt: "汉字学习卡：尾",
    imageUrl: "./zika/hanzi/尾字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 191,
    title: "文字卡",
    prompt: "汉字学习卡：文",
    imageUrl: "./zika/hanzi/文字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 192,
    title: "夏字卡",
    prompt: "汉字学习卡：夏",
    imageUrl: "./zika/hanzi/夏字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 193,
    title: "校字卡",
    prompt: "汉字学习卡：校",
    imageUrl: "./zika/hanzi/校字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 194,
    title: "写字卡",
    prompt: "汉字学习卡：写",
    imageUrl: "./zika/hanzi/写字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 195,
    title: "学习卡",
    prompt: "汉字学习卡：学",
    imageUrl: "./zika/hanzi/学习卡.jpg",
    category: "汉字卡"
  },
  {
    id: 196,
    title: "雪字卡",
    prompt: "汉字学习卡：雪",
    imageUrl: "./zika/hanzi/雪字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 197,
    title: "影字卡",
    prompt: "汉字学习卡：影",
    imageUrl: "./zika/hanzi/影字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 198,
    title: "勇字卡",
    prompt: "汉字学习卡：勇",
    imageUrl: "./zika/hanzi/勇字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 199,
    title: "又字卡",
    prompt: "汉字学习卡：又",
    imageUrl: "./zika/hanzi/又字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 200,
    title: "雨字卡",
    prompt: "汉字学习卡：雨",
    imageUrl: "./zika/hanzi/雨字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 201,
    title: "语字卡",
    prompt: "汉字学习卡：语",
    imageUrl: "./zika/hanzi/语字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 202,
    title: "真字卡",
    prompt: "汉字学习卡：真",
    imageUrl: "./zika/hanzi/真字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 203,
    title: "直字卡",
    prompt: "汉字学习卡：直",
    imageUrl: "./zika/hanzi/直字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 204,
    title: "志字卡",
    prompt: "汉字学习卡：志",
    imageUrl: "./zika/hanzi/志字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 205,
    title: "竹字卡",
    prompt: "汉字学习卡：竹",
    imageUrl: "./zika/hanzi/竹字卡.jpg",
    category: "汉字卡"
  },
  {
    id: 206,
    title: "爱字卡",
    prompt: "情绪汉字学习卡：爱",
    imageUrl: "./zika/qingxuhanzi/爱字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 207,
    title: "愁字卡",
    prompt: "情绪汉字学习卡：愁",
    imageUrl: "./zika/qingxuhanzi/愁字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 208,
    title: "恨字卡",
    prompt: "情绪汉字学习卡：恨",
    imageUrl: "./zika/qingxuhanzi/恨字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 209,
    title: "慌字卡",
    prompt: "情绪汉字学习卡：慌",
    imageUrl: "./zika/qingxuhanzi/慌字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 210,
    title: "急字卡",
    prompt: "情绪汉字学习卡：急",
    imageUrl: "./zika/qingxuhanzi/急字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 211,
    title: "悔字卡",
    prompt: "情绪汉字学习卡：悔",
    imageUrl: "./zika/qingxuhanzi/悔字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 212,
    title: "乐字卡",
    prompt: "情绪汉字学习卡：乐",
    imageUrl: "./zika/qingxuhanzi/乐字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 213,
    title: "怜字卡",
    prompt: "情绪汉字学习卡：怜",
    imageUrl: "./zika/qingxuhanzi/怜字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 214,
    title: "怒字卡",
    prompt: "情绪汉字学习卡：怒",
    imageUrl: "./zika/qingxuhanzi/怒字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 215,
    title: "怕字卡",
    prompt: "情绪汉字学习卡：怕",
    imageUrl: "./zika/qingxuhanzi/怕字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 216,
    title: "思字卡",
    prompt: "情绪汉字学习卡：思",
    imageUrl: "./zika/qingxuhanzi/思字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 217,
    title: "喜字卡",
    prompt: "情绪汉字学习卡：喜",
    imageUrl: "./zika/qingxuhanzi/喜字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 218,
    title: "笑字卡",
    prompt: "情绪汉字学习卡：笑",
    imageUrl: "./zika/qingxuhanzi/笑字卡.jpg",
    category: "情绪汉字卡"
  },
  {
    id: 219,
    title: "Letter A Flashcard",
    prompt: "英文字母学习卡：A",
    imageUrl: "./zika/letter/letter_A_flashcard.jpg",
    category: "字母卡",
    audioText: "A"
  },
  {
    id: 220,
    title: "Letter B Flashcard",
    prompt: "英文字母学习卡：B",
    imageUrl: "./zika/letter/letter_B_flashcard.jpg",
    category: "字母卡",
    audioText: "B"
  },
  {
    id: 221,
    title: "Letter C Flashcard",
    prompt: "英文字母学习卡：C",
    imageUrl: "./zika/letter/letter_C_flashcard.jpg",
    category: "字母卡",
    audioText: "C"
  },
  {
    id: 222,
    title: "Letter D Flashcard",
    prompt: "英文字母学习卡：D",
    imageUrl: "./zika/letter/letter_D_flashcard.jpg",
    category: "字母卡",
    audioText: "D"
  },
  {
    id: 223,
    title: "Letter E Flashcard",
    prompt: "英文字母学习卡：E",
    imageUrl: "./zika/letter/letter_E_flashcard.jpg",
    category: "字母卡",
    audioText: "E"
  },
  {
    id: 224,
    title: "Letter F Flashcard",
    prompt: "英文字母学习卡：F",
    imageUrl: "./zika/letter/letter_F_flashcard.jpg",
    category: "字母卡",
    audioText: "F"
  },
  {
    id: 225,
    title: "Letter G Flashcard",
    prompt: "英文字母学习卡：G",
    imageUrl: "./zika/letter/letter_G_flashcard.jpg",
    category: "字母卡",
    audioText: "G"
  },
  {
    id: 226,
    title: "Letter H Flashcard",
    prompt: "英文字母学习卡：H",
    imageUrl: "./zika/letter/letter_H_flashcard.jpg",
    category: "字母卡",
    audioText: "H"
  },
  {
    id: 227,
    title: "Letter I Flashcard",
    prompt: "英文字母学习卡：I",
    imageUrl: "./zika/letter/letter_I_flashcard.jpg",
    category: "字母卡",
    audioText: "I"
  },
  {
    id: 228,
    title: "Letter J Flashcard",
    prompt: "英文字母学习卡：J",
    imageUrl: "./zika/letter/letter_J_flashcard.jpg",
    category: "字母卡",
    audioText: "J"
  },
  {
    id: 229,
    title: "Letter K Flashcard",
    prompt: "英文字母学习卡：K",
    imageUrl: "./zika/letter/letter_K_flashcard.jpg",
    category: "字母卡",
    audioText: "K"
  },
  {
    id: 230,
    title: "Letter L Flashcard",
    prompt: "英文字母学习卡：L",
    imageUrl: "./zika/letter/letter_L_flashcard.jpg",
    category: "字母卡",
    audioText: "L"
  },
  {
    id: 231,
    title: "Letter M Flashcard",
    prompt: "英文字母学习卡：M",
    imageUrl: "./zika/letter/letter_M_flashcard.jpg",
    category: "字母卡",
    audioText: "M"
  },
  {
    id: 232,
    title: "Letter N Flashcard",
    prompt: "英文字母学习卡：N",
    imageUrl: "./zika/letter/letter_N_flashcard.jpg",
    category: "字母卡",
    audioText: "N"
  },
  {
    id: 233,
    title: "Letter O Flashcard",
    prompt: "英文字母学习卡：O",
    imageUrl: "./zika/letter/letter_O_flashcard.jpg",
    category: "字母卡",
    audioText: "O"
  },
  {
    id: 234,
    title: "Letter P Flashcard",
    prompt: "英文字母学习卡：P",
    imageUrl: "./zika/letter/letter_P_flashcard.jpg",
    category: "字母卡",
    audioText: "P"
  },
  {
    id: 235,
    title: "Letter Q Flashcard",
    prompt: "英文字母学习卡：Q",
    imageUrl: "./zika/letter/letter_Q_flashcard.jpg",
    category: "字母卡",
    audioText: "Q"
  },
  {
    id: 236,
    title: "Letter R Flashcard",
    prompt: "英文字母学习卡：R",
    imageUrl: "./zika/letter/letter_R_flashcard.jpg",
    category: "字母卡",
    audioText: "R"
  },
  {
    id: 237,
    title: "Letter S Flashcard",
    prompt: "英文字母学习卡：S",
    imageUrl: "./zika/letter/letter_S_flashcard.jpg",
    category: "字母卡",
    audioText: "S"
  },
  {
    id: 238,
    title: "Letter T Flashcard",
    prompt: "英文字母学习卡：T",
    imageUrl: "./zika/letter/letter_T_flashcard.jpg",
    category: "字母卡",
    audioText: "T"
  },
  {
    id: 239,
    title: "Letter U Flashcard",
    prompt: "英文字母学习卡：U",
    imageUrl: "./zika/letter/letter_U_flashcard.jpg",
    category: "字母卡",
    audioText: "U"
  },
  {
    id: 240,
    title: "Letter V Flashcard",
    prompt: "英文字母学习卡：V",
    imageUrl: "./zika/letter/letter_V_flashcard.jpg",
    category: "字母卡",
    audioText: "V"
  },
  {
    id: 241,
    title: "Letter W Flashcard",
    prompt: "英文字母学习卡：W",
    imageUrl: "./zika/letter/letter_W_flashcard.jpg",
    category: "字母卡",
    audioText: "W"
  },
  {
    id: 242,
    title: "Letter X Flashcard",
    prompt: "英文字母学习卡：X",
    imageUrl: "./zika/letter/letter_X_flashcard.jpg",
    category: "字母卡",
    audioText: "X"
  },
  {
    id: 243,
    title: "Letter Y Flashcard",
    prompt: "英文字母学习卡：Y",
    imageUrl: "./zika/letter/letter_Y_flashcard.jpg",
    category: "字母卡",
    audioText: "Y"
  },
  {
    id: 244,
    title: "Letter Z Flashcard",
    prompt: "英文字母学习卡：Z",
    imageUrl: "./zika/letter/letter_Z_flashcard.jpg",
    category: "字母卡",
    audioText: "Z"
  },
  {
    id: 245,
    title: "三字卡（红框版）",
    prompt: "西游记字卡：三",
    imageUrl: "./zika/xiyouji/三字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 246,
    title: "云字卡（纯黑字）",
    prompt: "西游记字卡：云",
    imageUrl: "./zika/xiyouji/云字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 247,
    title: "仙字卡（纯黑字）",
    prompt: "西游记字卡：仙",
    imageUrl: "./zika/xiyouji/仙字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 248,
    title: "僧字卡（红框版）",
    prompt: "西游记字卡：僧",
    imageUrl: "./zika/xiyouji/僧字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 249,
    title: "八字卡（红框版）",
    prompt: "西游记字卡：八",
    imageUrl: "./zika/xiyouji/八字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 250,
    title: "取字卡（红框版）",
    prompt: "西游记字卡：取",
    imageUrl: "./zika/xiyouji/取字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 251,
    title: "变字卡（纯黑字）",
    prompt: "西游记字卡：变",
    imageUrl: "./zika/xiyouji/变字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 252,
    title: "唐字卡（红框版）",
    prompt: "西游记字卡：唐",
    imageUrl: "./zika/xiyouji/唐字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 253,
    title: "国字卡（红框版）",
    prompt: "西游记字卡：国",
    imageUrl: "./zika/xiyouji/国字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 254,
    title: "天字卡（红框版）",
    prompt: "西游记字卡：天",
    imageUrl: "./zika/xiyouji/天字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 255,
    title: "如字卡（红框版）",
    prompt: "西游记字卡：如",
    imageUrl: "./zika/xiyouji/如字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 256,
    title: "如字卡（纯黑字）",
    prompt: "西游记字卡：如",
    imageUrl: "./zika/xiyouji/如字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 257,
    title: "妖字卡（纯黑字）",
    prompt: "西游记字卡：妖",
    imageUrl: "./zika/xiyouji/妖字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 258,
    title: "孙字卡（红框版）",
    prompt: "西游记字卡：孙",
    imageUrl: "./zika/xiyouji/孙字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 259,
    title: "宝字卡（纯黑字）",
    prompt: "西游记字卡：宝",
    imageUrl: "./zika/xiyouji/宝字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 260,
    title: "宫字卡（纯黑字）",
    prompt: "西游记字卡：宫",
    imageUrl: "./zika/xiyouji/宫字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 261,
    title: "山字卡（红框版）",
    prompt: "西游记字卡：山",
    imageUrl: "./zika/xiyouji/山字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 262,
    title: "师字卡（粉红底）",
    prompt: "西游记字卡：师",
    imageUrl: "./zika/xiyouji/师字卡_粉红底.jpg",
    category: "西游记字卡"
  },
  {
    id: 263,
    title: "师字卡（红框版）",
    prompt: "西游记字卡：师",
    imageUrl: "./zika/xiyouji/师字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 264,
    title: "帘字卡（纯黑字）",
    prompt: "西游记字卡：帘",
    imageUrl: "./zika/xiyouji/帘字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 265,
    title: "帚字卡（纯黑字）",
    prompt: "西游记字卡：帚",
    imageUrl: "./zika/xiyouji/帚字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 266,
    title: "帝字卡（红框版）",
    prompt: "西游记字卡：帝",
    imageUrl: "./zika/xiyouji/帝字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 267,
    title: "徒字卡（粉红底）",
    prompt: "西游记字卡：徒",
    imageUrl: "./zika/xiyouji/徒字卡_粉红底.jpg",
    category: "西游记字卡"
  },
  {
    id: 268,
    title: "徒字卡（红框版）",
    prompt: "西游记字卡：徒",
    imageUrl: "./zika/xiyouji/徒字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 269,
    title: "怪字卡（纯黑字）",
    prompt: "西游记字卡：怪",
    imageUrl: "./zika/xiyouji/怪字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 270,
    title: "悟字卡（红框版）",
    prompt: "西游记字卡：悟",
    imageUrl: "./zika/xiyouji/悟字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 271,
    title: "戒字卡（粉红底）",
    prompt: "西游记字卡：戒",
    imageUrl: "./zika/xiyouji/戒字卡_粉红底.jpg",
    category: "西游记字卡"
  },
  {
    id: 272,
    title: "戒字卡（红框版）",
    prompt: "西游记字卡：戒",
    imageUrl: "./zika/xiyouji/戒字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 273,
    title: "扫字卡（纯黑字）",
    prompt: "西游记字卡：扫",
    imageUrl: "./zika/xiyouji/扫字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 274,
    title: "斗字卡（纯黑字）",
    prompt: "西游记字卡：斗",
    imageUrl: "./zika/xiyouji/斗字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 275,
    title: "来字卡（红框版）",
    prompt: "西游记字卡：来",
    imageUrl: "./zika/xiyouji/来字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 276,
    title: "来字卡（纯黑字）",
    prompt: "西游记字卡：来",
    imageUrl: "./zika/xiyouji/来字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 277,
    title: "棒字卡（纯黑字）",
    prompt: "西游记字卡：棒",
    imageUrl: "./zika/xiyouji/棒字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 278,
    title: "水字卡（纯黑字）",
    prompt: "西游记字卡：水",
    imageUrl: "./zika/xiyouji/水字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 279,
    title: "洞字卡（纯黑字）",
    prompt: "西游记字卡：洞",
    imageUrl: "./zika/xiyouji/洞字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 280,
    title: "游字卡（粉红底）",
    prompt: "西游记字卡：游",
    imageUrl: "./zika/xiyouji/游字卡_粉红底.jpg",
    category: "西游记字卡"
  },
  {
    id: 281,
    title: "猪字卡（红框版）",
    prompt: "西游记字卡：猪",
    imageUrl: "./zika/xiyouji/猪字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 282,
    title: "玉字卡（红框版）",
    prompt: "西游记字卡：玉",
    imageUrl: "./zika/xiyouji/玉字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 283,
    title: "王字卡（纯黑字）",
    prompt: "西游记字卡：王",
    imageUrl: "./zika/xiyouji/王字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 284,
    title: "空字卡（红框版）",
    prompt: "西游记字卡：空",
    imageUrl: "./zika/xiyouji/空字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 285,
    title: "箍字卡（纯黑字）",
    prompt: "西游记字卡：箍",
    imageUrl: "./zika/xiyouji/箍字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 286,
    title: "者字卡（红框版）",
    prompt: "西游记字卡：者",
    imageUrl: "./zika/xiyouji/者字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 287,
    title: "芭字卡（纯黑字）",
    prompt: "西游记字卡：芭",
    imageUrl: "./zika/xiyouji/芭字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 288,
    title: "花字卡（纯黑字）",
    prompt: "西游记字卡：花",
    imageUrl: "./zika/xiyouji/花字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 289,
    title: "蕉字卡（纯黑字）",
    prompt: "西游记字卡：蕉",
    imageUrl: "./zika/xiyouji/蕉字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 290,
    title: "藏字卡（红框版）",
    prompt: "西游记字卡：藏",
    imageUrl: "./zika/xiyouji/藏字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 291,
    title: "西字卡（粉红底）",
    prompt: "西游记字卡：西",
    imageUrl: "./zika/xiyouji/西字卡_粉红底.jpg",
    category: "西游记字卡"
  },
  {
    id: 292,
    title: "观字卡（红框版）",
    prompt: "西游记字卡：观",
    imageUrl: "./zika/xiyouji/观字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 293,
    title: "记字卡（粉红底）",
    prompt: "西游记字卡：记",
    imageUrl: "./zika/xiyouji/记字卡_粉红底.jpg",
    category: "西游记字卡"
  },
  {
    id: 294,
    title: "通字卡（纯黑字）",
    prompt: "西游记字卡：通",
    imageUrl: "./zika/xiyouji/通字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 295,
    title: "金字卡（纯黑字）",
    prompt: "西游记字卡：金",
    imageUrl: "./zika/xiyouji/金字卡_纯黑字.jpg",
    category: "西游记字卡"
  },
  {
    id: 296,
    title: "音字卡（红框版）",
    prompt: "西游记字卡：音",
    imageUrl: "./zika/xiyouji/音字卡_红框版.jpg",
    category: "西游记字卡"
  },
  {
    id: 297,
    title: "龙字卡（纯黑字）",
    prompt: "西游记字卡：龙",
    imageUrl: "./zika/xiyouji/龙字卡_纯黑字.jpg",
    category: "西游记字卡"
  }
];

const categories = [
    "字母卡",
    "情绪汉字卡",
    "汉字卡",
    "英文交通工具卡",
    "英文人物卡",
    "英文动物卡",
    "英文水果卡",
    "西游记字卡"
  ];

window.APP_DATA = {
  cases,
  categories,
};
