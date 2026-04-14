import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   CHARACTER DATA
   ═══════════════════════════════════════════════════════════════ */
const CHARS = {
  Griffith: { emoji: "🧙‍♂️", color: "#9370DB" },
  Drake: { emoji: "👦🏻", color: "#8B6914" },
  Rori: { emoji: "👧🏽", color: "#DC143C" },
  Bo: { emoji: "👦🏻", color: "#1E90FF" },
  Ana: { emoji: "👧🏽", color: "#FF8C00" },
  Petra: { emoji: "👧🏻", color: "#9400D3" },
  Griffin: { emoji: "👦🏻", color: "#C0C0C0" },
  Carlos: { emoji: "👦🏽", color: "#FFD700" },
  Heru: { emoji: "👦🏾", color: "#4169E1" },
  Mina: { emoji: "👧🏻", color: "#00CED1" },
  Jean: { emoji: "👦🏻", color: "#708090" },
  Darma: { emoji: "👧🏽", color: "#DAA520" },
  Eko: { emoji: "👦🏾", color: "#8B4513" },
  Lina: { emoji: "👧🏻", color: "#32CD32" },
};

function CharPortrait({ name, size = 40 }) {
  const c = CHARS[name] || CHARS.Griffith;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 30% 30%,${c.color}66,${c.color}22)`, border: `2px solid ${c.color}88`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0, boxShadow: `0 0 8px ${c.color}33` }}>
      {c.emoji}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE ILLUSTRATIONS (SVG)
   ═══════════════════════════════════════════════════════════════ */
function SceneIllustration({ realm }) {
  const el = realm.icon;
  const c = realm.color;
  return (
    <svg viewBox="0 0 360 120" width="100%" style={{ borderRadius: 12, marginBottom: 10 }}>
      <defs>
        <linearGradient id={`sky${realm.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={`glow${realm.id}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="0.4" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="120" fill={`url(#sky${realm.id})`} />
      <circle cx="180" cy="50" r="60" fill={`url(#glow${realm.id})`} />
      {/* Mountains/terrain */}
      <polygon points="0,120 40,60 80,90 120,50 160,80 200,40 240,75 280,55 320,70 360,45 360,120" fill="#0f172a" opacity="0.6" />
      <polygon points="0,120 60,80 100,95 140,70 180,90 220,65 260,85 300,75 340,85 360,90 360,120" fill="#1a1a2e" opacity="0.8" />
      {/* Stars */}
      {[30, 80, 150, 220, 290, 340].map((x, i) => (
        <circle key={i} cx={x} cy={15 + (i % 3) * 10} r={1 + (i % 2)} fill="white" opacity={0.3 + (i % 3) * 0.2}>
          <animate attributeName="opacity" values={`${0.2 + i * 0.1};${0.6 + i * 0.05};${0.2 + i * 0.1}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Element icon glow */}
      <text x="180" y="65" textAnchor="middle" fontSize="40" opacity="0.8" style={{ filter: `drop-shadow(0 0 10px ${c})` }}>
        {el}
      </text>
      {/* Dragon silhouette */}
      <g transform="translate(280, 30)" opacity="0.25">
        <path d="M0,20 Q5,0 15,5 Q20,0 25,8 L30,5 Q32,12 28,15 L25,25 Q20,30 15,28 L10,30 Q5,28 3,25 Z" fill={c} />
        <path d="M25,10 Q35,0 30,15" fill="none" stroke={c} strokeWidth="1.5" />
        <path d="M5,10 Q-5,0 0,15" fill="none" stroke={c} strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REALM DATA (all 20 quests)
   Math: R1-7 single digit add + basic ×, R8-14 2-digit add + basic × + 1-digit sub, R15-20 3-digit add + sub + ×
   ═══════════════════════════════════════════════════════════════ */
const REALMS = [
  {
    id: 1, title: "Rise of the Earth Dragon", dragon: "Worm", master: "Drake", color: "#8B6914", icon: "🌍",
    intro: "Deep beneath Bracken Castle, the Dragon Stone begins to glow. Griffith, the old wizard, gathers the kingdom's bravest children — and the Stone has chosen YOU as its newest Dragon Master! Your first quest leads you underground, where Drake's Earth Dragon, Worm, lies trapped behind ancient roots and rock. The tunnels are dark and winding, and strange crystals light the way. Drake believes only someone who truly understands the earth can free his dragon. Will you prove your worth?",
    outro: "With a mighty rumble, the rocks part and Worm slithers free! The great Earth Dragon bows its head to you in gratitude. Drake grins ear to ear — you've passed your first test. Griffith watches from above, nodding wisely. 'The Dragon Stone chose well,' he murmurs. Your adventure has only just begun, and already the Stone glows a little brighter...",
    challenges: [
      { type: "science", q: "What do plants need to grow?", opts: ["Only water", "Sunlight, water & soil", "Just air", "Only darkness"], ans: 1, hint: "Think about what you see in a garden!", explain: "Plants need sunlight for energy, water to drink, and soil for nutrients!" },
      { type: "math", q: "Drake found 5 rocks in the cave and 3 more outside. How many rocks?", opts: ["6", "7", "8", "9"], ans: 2, hint: "Put them together — 5 plus 3!", explain: "5 + 3 = 8 rocks!" },
      { type: "puzzle", q: "What comes next? 🌱 🌿 🌳 ???", opts: ["🌱", "🌺", "🌍", "🌵"], ans: 0, hint: "The pattern shows growing — what happens after it gets old?", explain: "It's a cycle! After a tree, a new seed (🌱) starts again!" },
    ],
  },
  {
    id: 2, title: "Saving the Sun Dragon", dragon: "Kepri", master: "Ana", color: "#FF8C00", icon: "☀️",
    intro: "A shadow has fallen over the land of the pyramids. Ana's magnificent Sun Dragon, Kepri, is losing her golden glow — her scales turning grey and cold. Without Kepri's light, crops are wilting and people shiver. Ana has sent an urgent message to Bracken Castle: she needs help understanding the sun's power. You must journey across the desert sands and reach Ana before Kepri's light goes out forever. The fate of an entire kingdom rests on your knowledge!",
    outro: "Golden light bursts from Kepri's scales! The Sun Dragon spreads her wings wide and warmth floods across the land. Flowers bloom instantly in the sand and the people cheer. Ana hugs you tightly. 'You saved Kepri — you saved all of us!' The Dragon Stone pulses with new energy as you return home, carrying the warmth of the sun in your heart.",
    challenges: [
      { type: "science", q: "What does the Sun give us?", opts: ["Only heat", "Light and heat", "Just pretty colors", "Nothing important"], ans: 1, hint: "Stand outside on a sunny day — what do you feel?", explain: "The Sun gives us both light to see and heat to stay warm!" },
      { type: "math", q: "Kepri glows for 6 hours in the morning and 4 in the afternoon. How many hours total?", opts: ["8", "9", "10", "11"], ans: 2, hint: "6 plus 4!", explain: "6 + 4 = 10 hours of glowing!" },
      { type: "puzzle", q: "Which one does NOT belong?", opts: ["☀️ Sun", "💡 Light bulb", "⭐ Star", "🌙 Moon"], ans: 3, hint: "Three make their OWN light...", explain: "The Moon reflects the Sun's light — it doesn't make its own!" },
    ],
  },
  {
    id: 3, title: "Secret of the Water Dragon", dragon: "Shu", master: "Bo", color: "#1E90FF", icon: "💧",
    intro: "Bo has discovered an ancient waterfall hidden deep in the Misty Mountains, but a magical barrier blocks the way. His Water Dragon, Shu, can sense something extraordinary behind it. The barrier responds only to those who understand water's secrets. Rain is falling, rivers are rushing, and somewhere deep below, Shu hums with anticipation. Are you ready to unlock the secret?",
    outro: "The waterfall parts like a curtain, revealing a glittering cave filled with blue crystals! Shu lets out a joyful roar that echoes through the cavern. Bo places his hand on your shoulder. 'The water speaks to those who listen.' Inside, you find an ancient scroll telling of more Dragon Masters yet to come. The Dragon Stone hums with flowing water.",
    challenges: [
      { type: "science", q: "What happens to water when it gets very cold?", opts: ["It disappears", "It turns into ice", "It turns into gas", "It changes color"], ans: 1, hint: "Think about your freezer!", explain: "Water freezes into ice when it gets very cold — below 0°C!" },
      { type: "math", q: "Shu drinks 4 buckets of water each day. How many in 3 days?", opts: ["7", "10", "12", "15"], ans: 2, hint: "4 three times: 4, 8, 12!", explain: "4 × 3 = 12 buckets!" },
      { type: "puzzle", q: "Smallest to biggest:", opts: ["Raindrop → Puddle → Pond → Ocean", "Ocean → Pond → Puddle → Raindrop", "Puddle → Raindrop → Ocean → Pond", "Pond → Ocean → Raindrop → Puddle"], ans: 0, hint: "Which fits in your hand?", explain: "Raindrop → puddle → pond → the HUGE ocean!" },
    ],
  },
  {
    id: 4, title: "Power of the Fire Dragon", dragon: "Vulcan", master: "Rori", color: "#DC143C", icon: "🔥",
    intro: "The ancient forge of Bracken Castle has gone cold for the first time in a thousand years! Without it, no new Dragon Stone amulets can be made. Rori and her fierce Fire Dragon, Vulcan, must reignite the forge — but Vulcan's flames aren't hot enough alone. Rori needs someone who understands the science of fire. Sparks fly, the furnace groans, and time is running out!",
    outro: "WHOOOOSH! The forge roars back to life, flames leaping high and turning brilliant blue! Vulcan trumpets proudly, smoke curling from his nostrils. Rori pumps her fist — 'That was AWESOME!' The heat warms the entire castle, and Griffith begins crafting a brand new amulet. The Dragon Stone blazes with fiery power!",
    challenges: [
      { type: "science", q: "What three things does fire need to burn?", opts: ["Water, earth, air", "Heat, fuel & oxygen", "Just wood", "Only matches"], ans: 1, hint: "Fire needs something to burn, air to breathe, and a spark!", explain: "Fire needs heat to start, fuel to burn, and oxygen from the air!" },
      { type: "math", q: "Vulcan breathes 7 fire blasts, then 6 more. How many total?", opts: ["11", "12", "13", "14"], ans: 2, hint: "7 plus 6!", explain: "7 + 6 = 13 fire blasts! 🔥" },
      { type: "puzzle", q: "Which is the hottest?", opts: ["Ice cream", "Warm bath", "Boiling water", "The Sun"], ans: 3, hint: "The most powerful heat source!", explain: "The Sun is incredibly hot — much hotter than boiling water!" },
    ],
  },
  {
    id: 5, title: "Song of the Poison Dragon", dragon: "Neru", master: "Petra", color: "#9400D3", icon: "☠️",
    intro: "Strange things are happening in the Whispering Woods. Flowers growing overnight in impossible colors — vivid purple, electric green, shimmering gold. Petra's Poison Dragon, Neru, knows these plants: some heal, others are deadly. An entire village has fallen ill after eating mysterious berries. Neru hisses softly, her scales flickering with warning colors. Nature is beautiful, but demands respect.",
    outro: "You identify the poisonous berries and Petra brews an antidote! The villagers recover one by one. Neru coils around you gently — for a Poison Dragon, the highest compliment. 'You see what others miss,' Petra says, tucking a safe flower behind your ear. The Dragon Stone shimmers with deep violet light.",
    challenges: [
      { type: "science", q: "Why do some animals have bright colors?", opts: ["To look pretty", "To warn predators they're dangerous", "They got painted", "To hide"], ans: 1, hint: "Think about bright red ladybugs!", explain: "Bright colors warn: 'Don't eat me, I might be poisonous!'" },
      { type: "math", q: "Neru found 9 berries. 4 are safe. How many are poisonous?", opts: ["3", "4", "5", "6"], ans: 2, hint: "Take 4 away from 9!", explain: "9 - 4 = 5 poisonous berries!" },
      { type: "puzzle", q: "Which animal uses camouflage?", opts: ["Bright red parrot", "Chameleon", "Polar bear on grass", "Rainbow fish"], ans: 1, hint: "Which changes to match its surroundings?", explain: "Chameleons change color to blend in!" },
    ],
  },
  {
    id: 6, title: "Flight of the Moon Dragon", dragon: "Luna", master: "Griffin", color: "#C0C0C0", icon: "🌙",
    intro: "On the highest peak of the Silver Mountains, something magical only happens once every hundred years: the Moon Dragon awakens. Griffin has waited his whole life for this moment. His dragon, Luna, must fly to the very top under the full moon's light to complete an ancient ritual that strengthens ALL dragon bonds everywhere. But icy winds, shifting clouds, and riddles block the way.",
    outro: "Luna reaches the peak as the full moon crests the horizon. Silver light pours down like liquid magic, and Luna's scales light up like a constellation! Far below, every dragon feels the bond strengthen. The Dragon Stone absorbs the moonlight and glows with gentle, silvery warmth.",
    challenges: [
      { type: "science", q: "Why does the Moon change shape?", opts: ["It shrinks", "We see different parts lit by the Sun", "Clouds hide it", "Someone eats it"], ans: 1, hint: "The Moon doesn't make its own light!", explain: "As the Moon orbits Earth, we see different amounts of its sunlit side!" },
      { type: "math", q: "Luna flies 8 miles up then 3 miles down. How high?", opts: ["4", "5", "6", "11"], ans: 1, hint: "8 minus 3!", explain: "8 - 3 = 5 miles high!" },
      { type: "puzzle", q: "🌑 🌓 🌕 🌗 ???", opts: ["🌑", "🌕", "🌓", "🌘"], ans: 0, hint: "Moon cycles through phases!", explain: "After the waning moon comes the new moon (🌑) again!" },
    ],
  },
  {
    id: 7, title: "Search for the Lightning Dragon", dragon: "Lalo", master: "Carlos", color: "#FFD700", icon: "⚡",
    intro: "A tremendous storm brews over the Razor Coast, and inside that swirling tempest hides the Lightning Dragon, Lalo! Carlos has tracked Lalo for months. The dragon is wild, crackling with electricity. To earn Lalo's trust, Carlos must prove he understands the very power coursing through the dragon's veins. Lightning splits the sky, thunder shakes the ground!",
    outro: "A bolt of lightning strikes the beach, and there stands Lalo — magnificent, electric blue, sparks dancing between his horns! Carlos approaches slowly. Lalo touches his nose to Carlos's palm. The storm instantly calms, replaced by golden sunset. 'We found each other,' Carlos whispers. The Dragon Stone crackles with new energy!",
    challenges: [
      { type: "science", q: "What causes lightning?", opts: ["Dragons fighting", "Electrical charges in clouds", "Sun being angry", "Wind too hard"], ans: 1, hint: "Lightning is electricity!", explain: "Lightning happens when charges build up in storm clouds!" },
      { type: "math", q: "Lightning strikes 5 times each minute. How many in 3 minutes?", opts: ["8", "12", "15", "20"], ans: 2, hint: "5 three times!", explain: "5 × 3 = 15 lightning strikes!" },
      { type: "puzzle", q: "Which lets electricity flow through it?", opts: ["Rubber gloves", "Metal spoon", "Wooden stick", "Plastic cup"], ans: 1, hint: "What are wires made of?", explain: "Metal conducts electricity!" },
    ],
  },
  {
    id: 8, title: "Roar of the Thunder Dragon", dragon: "Borubu", master: "Heru", color: "#4169E1", icon: "🌩️",
    intro: "Heru's Thunder Dragon, Borubu, who once shook mountains with his roar, can barely manage a squeak! Without his voice, Borubu can't protect the Eastern Kingdom. Griffith believes the answer lies in understanding sound — how it travels, echoes, and amplifies. Can you help Borubu find his voice?",
    outro: "BOOOOOOM! Borubu unleashes the mightiest roar anyone has ever heard! Even Griffith's hat blows off! 'Perhaps a LITTLE too loud!' the wizard chuckles. The Dragon Stone vibrates with pure sonic power, humming a deep, warm note.",
    challenges: [
      { type: "science", q: "Sound travels through air as...", opts: ["Colors", "Waves", "Straight lines", "Magic dust"], ans: 1, hint: "Think about ripples in water!", explain: "Sound moves in waves, like ripples in a pond!" },
      { type: "math", q: "Borubu roars 34 times in the mountains and 25 in the valley. How many total?", opts: ["57", "58", "59", "60"], ans: 2, hint: "30+20=50, 4+5=9!", explain: "34 + 25 = 59 roars!" },
      { type: "puzzle", q: "Which is louder?", opts: ["A whisper", "Conversation", "Thunderclap", "Cat purring"], ans: 2, hint: "What can you hear from far away?", explain: "Thunder is MUCH louder!" },
    ],
  },
  {
    id: 9, title: "Chill of the Ice Dragon", dragon: "Frost", master: "Mina", color: "#00CED1", icon: "❄️",
    intro: "Mina's Ice Dragon, Frost, needs to cross a vast frozen lake to reach a healing crystal — but the ice is cracking! Some parts are thick, others dangerously thin. Understanding temperature is key to finding the safe path. Frost's breath creates ice flowers in the air, but she can't refreeze the lake. Time is ticking!",
    outro: "Step by careful step, you cross the frozen lake! Frost touches the healing crystal and the entire lake transforms into a beautiful ice sculpture garden — frozen fountains, crystal trees, ice flowers everywhere. 'Frost's gift to you,' Mina smiles. The Dragon Stone gains cool, soothing power.",
    challenges: [
      { type: "science", q: "At what temperature does water freeze?", opts: ["100°C", "50°C", "0°C", "25°C"], ans: 2, hint: "Zero is the magic number!", explain: "Water freezes at 0°C!" },
      { type: "math", q: "Frost has 47 icicles on the ceiling and 31 on the walls. How many total?", opts: ["76", "77", "78", "79"], ans: 2, hint: "40+30=70, 7+1=8!", explain: "47 + 31 = 78 icicles!" },
      { type: "puzzle", q: "What happens to a puddle on a hot day?", opts: ["Freezes", "Evaporates", "Gets bigger", "Turns to juice"], ans: 1, hint: "Where does water go when warm?", explain: "Heat turns water into vapor — it evaporates!" },
    ],
  },
  {
    id: 10, title: "Waking the Rainbow Dragon", dragon: "Spectra", master: "Ana", color: "#FF69B4", icon: "🌈",
    intro: "In the Valley of Colors, a dragon sleeps inside a crystal cocoon. This is Spectra, the legendary Rainbow Dragon. Ana believes understanding light and color can open the cocoon. The valley is grey without Spectra's magic. Flowers lost their color, butterflies are transparent. Light is the key — but how does it work?",
    outro: "The crystal cocoon SHATTERS! Spectra unfurls her wings and every color ripples across her scales. Wherever she flies, color returns — flowers bloom vibrant, butterflies shimmer, a permanent rainbow arcs across the sky. 'You brought the color back,' Ana says softly. The Dragon Stone glows with every color of the spectrum.",
    challenges: [
      { type: "science", q: "What makes a rainbow appear?", opts: ["Paint in clouds", "Sunlight through raindrops", "Magic", "Wind blowing colors"], ans: 1, hint: "Rainbows appear when sun comes during rain!", explain: "Sunlight bends through raindrops and splits into all colors!" },
      { type: "math", q: "Spectra has 42 red scales and 35 blue scales. How many total?", opts: ["75", "76", "77", "78"], ans: 2, hint: "40+30=70, 2+5=7!", explain: "42 + 35 = 77 colorful scales!" },
      { type: "puzzle", q: "Correct rainbow order?", opts: ["Red, Orange, Yellow, Green, Blue, Indigo, Violet", "Violet, Blue, Green, Yellow, Orange, Red, Indigo", "Red, Yellow, Blue, Green, Orange, Violet, Indigo", "Blue, Red, Yellow, Green, Orange, Indigo, Violet"], ans: 0, hint: "ROY G BIV!", explain: "ROYGBIV!" },
    ],
  },
  {
    id: 11, title: "Shine of the Silver Dragon", dragon: "Argent", master: "Jean", color: "#A8A8C8", icon: "✨",
    intro: "Jean's Silver Dragon, Argent, lives in the Hall of Mirrors. A dark fog has crept in, coating every surface in shadow. Without reflected light, Argent grows weak. Jean needs someone who understands reflection to clear the fog and save Argent. Every restored mirror reveals a piece of a forgotten map...",
    outro: "ALL mirrors light up at once in a dazzling chain reaction! Argent leaps into the air, silver scales catching every beam until she looks like a living star. The forgotten map is complete — every dragon realm revealed! 'Centuries of knowledge, saved,' Jean says. The Dragon Stone absorbs the silver light.",
    challenges: [
      { type: "science", q: "Why can you see yourself in a mirror?", opts: ["Mirrors are magic", "Light bounces back to your eyes", "Mirrors have cameras", "Your eyes glow"], ans: 1, hint: "Like a ball bouncing off a wall!", explain: "Mirrors are smooth — light bounces off perfectly!" },
      { type: "math", q: "Argent has 56 mirrors on the left and 32 on the right. How many total?", opts: ["86", "87", "88", "89"], ans: 2, hint: "50+30=80, 6+2=8!", explain: "56 + 32 = 88 mirrors!" },
      { type: "puzzle", q: "Which reflects light best?", opts: ["Rough rock", "Smooth mirror", "Dark cloth", "Sponge"], ans: 1, hint: "Smoother = better!", explain: "Smooth, shiny surfaces reflect light best!" },
    ],
  },
  {
    id: 12, title: "Treasure of the Gold Dragon", dragon: "Aureo", master: "Darma", color: "#FFD700", icon: "💰",
    intro: "Darma has found the Gold Dragon's treasure vault — a massive golden door covered in mathematical riddles. Each puzzle unlocks a lock. Aureo sits atop the door, golden eyes watching. Only those clever enough deserve the treasure. Inside lie ancient Dragon Master artifacts that could protect all realms.",
    outro: "CLICK CLICK CLICK. The golden doors swing wide! Inside: enchanted quills, healing gems, and a golden compass pointing to any dragon. Aureo drapes a golden chain around your neck. 'More valuable than all the gold,' Darma whispers, holding the compass. The Dragon Stone gleams golden.",
    challenges: [
      { type: "math", q: "The vault has 45 gold coins. Aureo adds 33 more. How many?", opts: ["76", "77", "78", "79"], ans: 2, hint: "40+30=70, 5+3=8!", explain: "45 + 33 = 78 gold coins!" },
      { type: "math", q: "Darma splits 15 gems into 3 chests equally. How many per chest?", opts: ["3", "4", "5", "6"], ans: 2, hint: "Count by 3s to 15!", explain: "15 ÷ 3 = 5 gems each!" },
      { type: "puzzle", q: "Pattern: 🪙🪙💎🪙🪙💎🪙🪙???", opts: ["🪙", "💎", "👑", "💰"], ans: 1, hint: "Two coins then what?", explain: "Coin, coin, gem — gem comes next! 💎" },
    ],
  },
  {
    id: 13, title: "Eye of the Earthquake Dragon", dragon: "Quake", master: "Eko", color: "#8B4513", icon: "🏔️",
    intro: "The ground hasn't stopped shaking for three days. Eko's Earthquake Dragon, Quake, senses something massive moving deep underground. Villages are evacuating, bridges crumbling. Eko must ride Quake underground to find the source. The earth itself is telling a story — can you read the signs?",
    outro: "Deep underground: two tectonic plates grinding together, creating a new mountain! Quake stabilizes the fault line. A new mountain pushes through the surface, snow-capped and beautiful. 'The earth is always changing,' Eko says with respect. The Dragon Stone thrums with deep, steady power.",
    challenges: [
      { type: "science", q: "What is Earth's outer layer called?", opts: ["Mantle", "Core", "Crust", "Shell"], ans: 2, hint: "Like an egg's thin outside!", explain: "The crust is Earth's thin outer layer — where we live!" },
      { type: "math", q: "Quake feels 28 tremors on Monday. 9 stop by Tuesday. How many left?", opts: ["17", "18", "19", "20"], ans: 2, hint: "28 minus 9!", explain: "28 - 9 = 19 tremors still rumbling!" },
      { type: "puzzle", q: "What causes earthquakes?", opts: ["Giants stomping", "Earth's crust pieces pushing together", "Too much rain", "The wind"], ans: 1, hint: "Earth's surface is giant puzzle pieces!", explain: "Tectonic plates push together causing earthquakes!" },
    ],
  },
  {
    id: 14, title: "Land of the Spring Dragon", dragon: "Bloom", master: "Lina", color: "#32CD32", icon: "🌸",
    intro: "Winter has overstayed its welcome. Snow still covers the Land of Eternal Seasons. Lina's Spring Dragon, Bloom, has the power to bring warmth but can't overcome this unnatural cold alone. Bloom paces restlessly, green energy flickering at her wingtips. The seeds underground are waiting for someone to wake the world up.",
    outro: "Spring EXPLODES! Cherry blossoms burst from every tree, daffodils pop through melting snow, baby animals peek from burrows. Bloom dances through air trailing petals and sparkles. Lina spins in warm breeze, laughing. Butterflies land on your shoulders. The Dragon Stone blossoms with vibrant green energy.",
    challenges: [
      { type: "science", q: "Why do we have seasons?", opts: ["Sun turns off", "Earth tilts as it orbits Sun", "Trees decide", "Random"], ans: 1, hint: "Earth leans as it goes around!", explain: "Earth is tilted, giving different parts more sunlight at different times!" },
      { type: "math", q: "Bloom has 63 seeds. She plants 27. How many left?", opts: ["34", "35", "36", "37"], ans: 2, hint: "63-27: 63-20=43, then 43-7!", explain: "63 - 27 = 36 seeds left!" },
      { type: "puzzle", q: "Correct season order?", opts: ["Spring → Summer → Autumn → Winter", "Winter → Autumn → Summer → Spring", "Summer → Spring → Winter → Autumn", "Autumn → Winter → Spring → Summer"], ans: 0, hint: "Warm, hot, cool, cold!", explain: "Spring → Summer → Autumn → Winter, then again!" },
    ],
  },
  {
    id: 15, title: "Future of the Time Dragon", dragon: "Chronos", master: "Eko", color: "#9370DB", icon: "⏰",
    intro: "Time itself is breaking. Clocks spin backwards, seasons flicker. The Time Dragon, Chronos, is trapped in a time loop — each reset sends ripples across all kingdoms. To free Chronos, understand patterns in time. Griffith warns: 'Be careful. Time is the most powerful force of all.'",
    outro: "The time loop SHATTERS! Chronos bursts free, scales shimmering between past, present, and future. Clocks tick normally, seasons settle. Chronos shows you a vision: dragons and humans in harmony. The Dragon Stone pulses with temporal energy, each beat perfectly timed.",
    challenges: [
      { type: "math", q: "Chronos jumped 350 years forward, then 125 back. How far forward?", opts: ["215", "220", "225", "230"], ans: 2, hint: "350-125: 350-100=250, then 250-25!", explain: "350 - 125 = 225 years forward!" },
      { type: "puzzle", q: "2, 4, 8, 16, ???", opts: ["18", "24", "32", "20"], ans: 2, hint: "Each number doubles!", explain: "2→4→8→16→32! Multiply by 2!" },
      { type: "science", q: "Why does the Sun seem to move across the sky?", opts: ["Sun orbits Earth", "Earth spins on its axis", "Sky moves", "Clouds push Sun"], ans: 1, hint: "It's not the Sun moving — it's US!", explain: "Earth rotates every 24 hours!" },
    ],
  },
  {
    id: 16, title: "Call of the Sound Dragon", dragon: "Echo", master: "Mina", color: "#DA70D6", icon: "🎵",
    intro: "The Crystal Cavern was always filled with music from the Sound Dragon, Echo. But Echo has lost her voice. Mina believes a rare crystal can restore it, but the path is dark and navigable only by understanding how sound bounces. Listen carefully — in the silence, secrets wait.",
    outro: "Echo opens her mouth: a whisper... a note... a SYMPHONY! Thousands of crystals carry the song everywhere. People stop and smile. Mina cries happy tears. 'The most beautiful sound is a friend finding their voice.' The Dragon Stone resonates with harmonic energy.",
    challenges: [
      { type: "science", q: "Can sound travel through space?", opts: ["Yes, easily", "No — sound needs something to travel through", "Only music", "Yes, slowly"], ans: 1, hint: "Sound needs particles to vibrate!", explain: "Sound needs air, water, or solids. Space is empty!" },
      { type: "math", q: "Echo sang 312 notes in the morning and 245 in the evening. How many total?", opts: ["547", "557", "567", "537"], ans: 1, hint: "300+200=500, 12+45=57!", explain: "312 + 245 = 557 notes!" },
      { type: "puzzle", q: "Lightning then thunder 5 seconds later. Why?", opts: ["Thunder is shy", "Light travels faster than sound", "Sound faster", "Cloud waited"], ans: 1, hint: "Flash BEFORE boom!", explain: "Light is much faster than sound!" },
    ],
  },
  {
    id: 17, title: "Fortress of the Stone Dragon", dragon: "Granite", master: "Jean", color: "#708090", icon: "🏰",
    intro: "An ancient fortress built by the first Dragon Masters is crumbling. Granite has protected it for centuries but can't hold back time forever. Jean wants to rebuild with mathematical precision — perfect shapes, calculated weights. Granite stamps impatiently; he hates seeing his home fall apart.",
    outro: "The final stone clicks! Granite SLAMS his paws down — not a stone budges. A deep, rocky rumble of approval. Jean runs his hand along the wall. 'Every angle perfect.' That night, you feast in the great hall. The Dragon Stone absorbs the strength of ancient stone.",
    challenges: [
      { type: "math", q: "A wall needs 5 blocks per layer, 4 layers tall. How many blocks?", opts: ["15", "18", "20", "25"], ans: 2, hint: "5 blocks × 4 layers!", explain: "5 × 4 = 20 blocks!" },
      { type: "puzzle", q: "Most sides?", opts: ["Triangle (3)", "Square (4)", "Hexagon (6)", "Pentagon (5)"], ans: 2, hint: "Biggest number!", explain: "Hexagon has 6 sides!" },
      { type: "science", q: "What rock forms from cooled lava?", opts: ["Sedimentary", "Igneous", "Metamorphic", "Sandstone"], ans: 1, hint: "'Ignite' means fire!", explain: "Igneous rocks form when lava cools and hardens!" },
    ],
  },
  {
    id: 18, title: "Heat of the Lava Dragon", dragon: "Magmus", master: "Rori", color: "#FF4500", icon: "🌋",
    intro: "Mount Inferno is erupting! Lava flows toward Ember Village! Rori and Magmus — who swims through lava like a fish — must redirect the flow. But even Magmus needs a plan. Rori needs to understand volcanoes to guide Magmus to build barriers. The villagers are counting on you!",
    outro: "Magmus dives into the lava and pushes cooled rock into place! Lava streams harmlessly into the sea, creating new land! Rori whoops as Magmus surfaces glowing red-hot. 'New land from old fire,' she marvels. 'Destruction and creation, all at once.' The Dragon Stone glows molten orange.",
    challenges: [
      { type: "science", q: "What is lava?", opts: ["Hot water", "Melted rock from inside Earth", "Red paint", "Liquid fire"], ans: 1, hint: "Deep underground, incredibly hot!", explain: "Lava is melted rock from inside the Earth!" },
      { type: "math", q: "The volcano shot 475 rocks up and 238 fell back down. How many still flying?", opts: ["227", "237", "247", "257"], ans: 1, hint: "475-238: 475-200=275, then 275-38!", explain: "475 - 238 = 237 rocks!" },
      { type: "puzzle", q: "Coolest to hottest:", opts: ["Ice → Water → Steam → Lava", "Lava → Steam → Water → Ice", "Water → Ice → Lava → Steam", "Steam → Lava → Ice → Water"], ans: 0, hint: "Frozen, liquid, gas, melted rock!", explain: "Ice → Water → Steam → Lava!" },
    ],
  },
  {
    id: 19, title: "Wave of the Sea Dragon", dragon: "Tsunami", master: "Drake", color: "#006994", icon: "🌊",
    intro: "In the deep ocean trench, something enormous is moving. The Sea Dragon, Tsunami — three ships long — is waking after centuries, confused and scared. Her thrashing creates massive waves. Drake must swim down and calm her, but first must understand the ocean's secrets. His greatest challenge yet.",
    outro: "Drake places his hand on Tsunami's enormous snout. She opens one eye — big as a shield — and sees kindness. The thrashing stops. Tsunami rises, water cascading from sapphire scales like a thousand waterfalls. Dolphins leap, whales sing. 'Two dragons,' Drake grins. 'Luckiest Dragon Master ever.' The Dragon Stone glows with ocean depth.",
    challenges: [
      { type: "science", q: "Why is the ocean salty?", opts: ["Fish add salt", "Rivers carry minerals over millions of years", "Someone poured salt", "Sand is salty"], ans: 1, hint: "Water over rocks for a very long time!", explain: "Rivers dissolve minerals — salt built up over millions of years!" },
      { type: "math", q: "Tsunami dove 230 meters then 145 deeper. How deep?", opts: ["365", "375", "385", "395"], ans: 1, hint: "230+145: 200+100=300, 30+45=75!", explain: "230 + 145 = 375 meters!" },
      { type: "puzzle", q: "Which creature has NO bones?", opts: ["Shark", "Dolphin", "Jellyfish", "Sea turtle"], ans: 2, hint: "Soft and squishy!", explain: "Jellyfish have no bones, brain, or heart — mostly water!" },
    ],
  },
  {
    id: 20, title: "Howl of the Wind Dragon", dragon: "Zephyr", master: "Carlos", color: "#87CEEB", icon: "💨",
    intro: "The final quest. The biggest storm in a thousand years bears down on ALL kingdoms at once. Every Dragon Master has gathered but cannot stop it. One hope: the Wind Dragon, Zephyr, who controls wind itself. Carlos has searched every sky. This is it — everything you've learned leads to this moment.",
    outro: "Zephyr descends like a silver arrow and Carlos leaps onto her back. They fly into the storm's heart! Zephyr howls — a thousand flutes — and the winds OBEY. The storm splits, clouds scatter, golden sunlight breaks through. Every Dragon Master cheers. Griffith raises his staff and the Dragon Stone BLAZES — restored at last! All twenty dragons roar together. Griffith places his hand on your shoulder. 'I've trained many Dragon Masters. But none quite like you.'",
    challenges: [
      { type: "science", q: "What causes wind?", opts: ["Trees blowing", "Differences in air temperature", "Earth spinning fast", "Clouds pushing air"], ans: 1, hint: "Hot air rises, cool rushes in!", explain: "Wind is warm air rising and cooler air moving in!" },
      { type: "math", q: "Zephyr flew 350 km day one and 275 km day two. Total?", opts: ["615", "625", "635", "645"], ans: 1, hint: "300+200=500, 50+75=125!", explain: "350 + 275 = 625 km!" },
      { type: "puzzle", q: "What measures wind speed?", opts: ["Thermometer", "Barometer", "Anemometer", "Telescope"], ans: 2, hint: "An-eh-MOM-eh-ter!", explain: "An anemometer has spinning cups that catch wind!" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAP THEMES
   ═══════════════════════════════════════════════════════════════ */
const MAP_THEMES = [
  { name: "Bracken Forest", sub: "Realms 1–7", bg: "linear-gradient(180deg,#0a1f0a,#1a2e1a 50%,#0d1f0d)", accent: "#4ade80", path: "#2d5a2d", emojis: ["🌲", "🌳", "🌿", "🍃", "🌾", "🪨"] },
  { name: "Crystal Mountains", sub: "Realms 8–14", bg: "linear-gradient(180deg,#0a0a2e,#1a1a4e 50%,#0f0f3a)", accent: "#818cf8", path: "#3b3b7a", emojis: ["🏔️", "⛰️", "💎", "🔮", "❄️", "🌙"] },
  { name: "Dragon's Peak", sub: "Realms 15–20", bg: "linear-gradient(180deg,#2a0a0a,#3a1a1a 50%,#1f0f0f)", accent: "#fb923c", path: "#5a2d2d", emojis: ["🌋", "🔥", "⚡", "🌊", "💨", "👑"] },
];

/* ═══════════════════════════════════════════════════════════════
   DRAGON STAGES & 7 POWERS — each quest = 1 level, powers at specific quest counts
   ═══════════════════════════════════════════════════════════════ */
const DRAGON_STAGES = [
  { minQuests: 0, name: "Hatchling", bodyColor: "#7dd87d", power: null, powerName: null, powerDesc: null },
  { minQuests: 3, name: "Spark Wing", bodyColor: "#4ade80", power: "🌬️", powerName: "Wing Gust", powerDesc: "Creates small gusts of wind" },
  { minQuests: 5, name: "Flame Tail", bodyColor: "#22c55e", power: "🔥", powerName: "Fire Breath", powerDesc: "Breathes small but powerful flames" },
  { minQuests: 8, name: "Storm Rider", bodyColor: "#16a34a", power: "⚡", powerName: "Thunder Strike", powerDesc: "Summons a bolt of lightning" },
  { minQuests: 11, name: "Iron Scale", bodyColor: "#059669", power: "🛡️", powerName: "Shield Scale", powerDesc: "Projects a magical shield" },
  { minQuests: 14, name: "Shadow Glider", bodyColor: "#047857", power: "👁️", powerName: "Dragon Sight", powerDesc: "Sees through illusions and darkness" },
  { minQuests: 17, name: "Ancient Wyrm", bodyColor: "#065f46", power: "💫", powerName: "Time Warp", powerDesc: "Briefly slows time itself" },
  { minQuests: 20, name: "Legendary Dragon", bodyColor: "#064e3b", power: "👑", powerName: "Dragon's Roar", powerDesc: "Inspires courage in all who hear it" },
];

function getDragonStage(quests) {
  let s = DRAGON_STAGES[0];
  for (const x of DRAGON_STAGES) { if (quests >= x.minQuests) s = x; }
  return s;
}
function getDragonStageIdx(quests) {
  let i = 0;
  for (let j = 0; j < DRAGON_STAGES.length; j++) { if (quests >= DRAGON_STAGES[j].minQuests) i = j; }
  return i;
}

/* ═══════════════════════════════════════════════════════════════
   STORAGE
   ═══════════════════════════════════════════════════════════════ */
const SAVE_KEY = "dragon-masters-save-v3";
async function loadGame() { try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
async function saveGame(d) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(d)); } catch (e) { console.error(e); } }

/* ═══════════════════════════════════════════════════════════════
   STAR FIELD
   ═══════════════════════════════════════════════════════════════ */
function StarField() {
  const stars = useRef(Array.from({ length: 30 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, sz: Math.random() * 2.5 + 0.5, dl: Math.random() * 4, dr: 2 + Math.random() * 3 }))).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (<div key={s.id} style={{ position: "absolute", left: s.x + "%", top: s.y + "%", width: s.sz, height: s.sz, borderRadius: "50%", background: "#fff", opacity: 0, animation: `twinkle ${s.dr}s ${s.dl}s ease-in-out infinite` }} />))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATUS BAR (visible on every screen)
   ═══════════════════════════════════════════════════════════════ */
function StatusBar({ gd, onDragon }) {
  if (!gd) return null;
  const qc = Object.keys(gd.quests).length;
  const stage = getDragonStage(qc);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "#0f172aCC", borderRadius: 10, border: "1px solid #1e293b", marginBottom: 10, zIndex: 10, position: "relative" }}>
      <button onClick={onDragon} style={{ background: "none", border: "2px solid #ffd70055", borderRadius: 8, padding: 3, cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <DragonSVG quests={qc} size={26} animate={false} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#ffd700", fontFamily: '"Quicksand",sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{gd.dragonName} • {stage.name}</span>
          <span style={{ fontSize: 9, color: "#64748b", fontFamily: '"Quicksand",sans-serif', flexShrink: 0 }}>⭐{gd.totalStars} 📜{qc}/20</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {DRAGON_STAGES.map((s, i) => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= getDragonStageIdx(qc) ? "#22c55e" : "#1e293b" }} />))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DRAGON SVG — evolves visually with each power unlock
   ═══════════════════════════════════════════════════════════════ */
function DragonSVG({ quests = 0, size = 120, animate = true }) {
  const si = getDragonStageIdx(quests);
  const stage = getDragonStage(quests);
  const c = stage.bodyColor;
  const sc = size / 120; // scale factor
  const wingLen = 25 + si * 6;
  const hornLen = 8 + si * 3;
  const bodyW = 20 + si * 2;
  const bodyH = 26 + si * 2;

  return (
    <svg viewBox="0 0 160 150" width={size} height={size * 0.94} style={animate ? { animation: "dragonFloat 3s ease-in-out infinite" } : {}}>
      {/* Aura for high stages */}
      {si >= 5 && <circle cx="80" cy="75" r={50 + si * 3} fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.2"><animate attributeName="r" values={`${45 + si * 3};${55 + si * 3};${45 + si * 3}`} dur="3s" repeatCount="indefinite" /></circle>}
      {si >= 6 && <circle cx="80" cy="75" r={40 + si * 2} fill="none" stroke="#c084fc" strokeWidth="0.8" opacity="0.15"><animate attributeName="r" values={`${38 + si * 2};${48 + si * 2};${38 + si * 2}`} dur="2.5s" repeatCount="indefinite" /></circle>}
      {/* Wings — grow with stage */}
      <path d={`M80,60 Q${80 - wingLen},${25 - si * 2} ${80 - wingLen - 8},50`} fill={c} opacity="0.5" stroke={c} strokeWidth="1.5" />
      <path d={`M80,60 Q${80 + wingLen},${25 - si * 2} ${80 + wingLen + 8},50`} fill={c} opacity="0.5" stroke={c} strokeWidth="1.5" />
      {/* Wing membrane lines */}
      {si >= 2 && <>
        <line x1="80" y1="60" x2={80 - wingLen + 5} y2={35 - si} stroke={c} strokeWidth="0.5" opacity="0.3" />
        <line x1="80" y1="60" x2={80 + wingLen - 5} y2={35 - si} stroke={c} strokeWidth="0.5" opacity="0.3" />
      </>}
      {/* Tail — longer with stage, with spikes for high stages */}
      <path d={`M80,100 Q${105 + si * 4},${112 + si} ${112 + si * 3},${95 - si}`} fill="none" stroke={c} strokeWidth={3.5 + si * 0.3} strokeLinecap="round" />
      {si >= 3 && <path d={`M${108 + si * 3},${97 - si} L${115 + si * 3},${90 - si * 2}`} stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />}
      {/* Body */}
      <ellipse cx="80" cy="75" rx={bodyW} ry={bodyH} fill={c} />
      {/* Belly scales */}
      <ellipse cx="80" cy="80" rx={bodyW - 7} ry={bodyH - 8} fill="#a7f3d0" opacity="0.8" />
      {si >= 4 && <>
        <ellipse cx="80" cy="73" rx={bodyW - 10} ry="3" fill="none" stroke="#16a34a" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="80" cy="80" rx={bodyW - 9} ry="3" fill="none" stroke="#16a34a" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="80" cy="87" rx={bodyW - 10} ry="3" fill="none" stroke="#16a34a" strokeWidth="0.5" opacity="0.3" />
      </>}
      {/* Head */}
      <ellipse cx="80" cy="42" rx={13 + si * 0.8} ry={12 + si * 0.5} fill={c} />
      {/* Snout */}
      <ellipse cx="80" cy="50" rx={7 + si * 0.3} ry={4 + si * 0.2} fill={c} />
      {/* Eyes — more fierce with stage */}
      <ellipse cx="73" cy="40" rx="3.5" ry={3 + si * 0.1} fill="white" />
      <ellipse cx="87" cy="40" rx="3.5" ry={3 + si * 0.1} fill="white" />
      <ellipse cx="74" cy="40" rx="2" ry={2.2 + si * 0.05} fill="#1a1a2e" />
      <ellipse cx="88" cy="40" rx="2" ry={2.2 + si * 0.05} fill="#1a1a2e" />
      <circle cx="74.8" cy="39.2" r="0.8" fill="white" />
      <circle cx="88.8" cy="39.2" r="0.8" fill="white" />
      {/* Nostrils */}
      <circle cx="77" cy="49" r="1.2" fill="#166534" />
      <circle cx="83" cy="49" r="1.2" fill="#166534" />
      {/* Mouth */}
      {si < 4 ? (
        <path d="M75,52 Q80,56 85,52" fill="none" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" />
      ) : (
        <path d="M74,52 L77,54 L80,52 L83,54 L86,52" fill="none" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" />
      )}
      {/* Horns — grow */}
      <path d={`M72,32 L${72 - hornLen * 0.5},${32 - hornLen}`} stroke="#DAA520" strokeWidth={2 + si * 0.3} strokeLinecap="round" fill="none" />
      <path d={`M88,32 L${88 + hornLen * 0.5},${32 - hornLen}`} stroke="#DAA520" strokeWidth={2 + si * 0.3} strokeLinecap="round" fill="none" />
      {/* Ear/fin frills for stage 3+ */}
      {si >= 3 && <>
        <path d={`M68,36 L62,30 L68,33`} fill={c} opacity="0.6" />
        <path d={`M92,36 L98,30 L92,33`} fill={c} opacity="0.6" />
      </>}
      {/* Legs */}
      <rect x="67" y="97" width="9" height="15" rx="4.5" fill={c} />
      <rect x="84" y="97" width="9" height="15" rx="4.5" fill={c} />
      {/* Claws for stage 4+ */}
      {si >= 4 && <>
        <path d="M67,112 L65,115 M71,112 L71,116 M75,112 L77,115" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M84,112 L82,115 M88,112 L88,116 M92,112 L94,115" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      </>}
      {/* Arms */}
      <rect x="60" y="68" width="7" height="10" rx="3.5" fill={c} transform="rotate(-15 63 73)" />
      <rect x="93" y="68" width="7" height="10" rx="3.5" fill={c} transform="rotate(15 97 73)" />
      {/* Fire Breath — stage 2+ */}
      {si >= 2 && (
        <g opacity="0.7" style={{ animation: "fireFlicker 0.5s ease-in-out infinite alternate" }}>
          <ellipse cx="80" cy="22" rx={3 + si} ry={6 + si * 1.5} fill="#ff6b35" />
          <ellipse cx="80" cy="20" rx={2 + si * 0.5} ry={4 + si} fill="#ffd700" />
        </g>
      )}
      {/* Lightning crackle — stage 3+ */}
      {si >= 3 && (
        <g opacity="0.5">
          <path d={`M${60 - si * 2},${55 - si} L${65 - si},${50 - si} L${62 - si},${45 - si}`} stroke="#ffd700" strokeWidth="1.2" fill="none">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          </path>
        </g>
      )}
      {/* Crown — final stage */}
      {si >= 7 && (
        <g>
          <polygon points="70,28 73,16 76,24 80,12 84,24 87,16 90,28" fill="#ffd700" stroke="#ff8c00" strokeWidth="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </polygon>
        </g>
      )}
      {/* Sparkles around dragon for stage 5+ */}
      {si >= 5 && [0, 1, 2, 3].map((i) => (
        <circle key={i} cx={55 + i * 20} cy={30 + (i % 2) * 70} r="1.5" fill="#ffd700" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHALLENGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function Challenge({ challenge, onCorrect, griffithHint }) {
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);
  const [ok, setOk] = useState(false);
  const [wrongs, setWrongs] = useState(0);
  const tl = challenge.type === "science" ? "🔬 Science" : challenge.type === "math" ? "🔢 Math" : "🧩 Puzzle";
  const tc = challenge.type === "science" ? "#60a5fa" : challenge.type === "math" ? "#fbbf24" : "#a78bfa";
  const showH = griffithHint || wrongs > 0;

  const pick = (i) => {
    if (show) return;
    setSel(i);
    setShow(true);
    const correct = i === challenge.ans;
    setOk(correct);
    if (correct) setTimeout(() => onCorrect(), 1800);
    else { setWrongs((p) => p + 1); setTimeout(() => { setSel(null); setShow(false); }, 2200); }
  };

  return (
    <div style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
      <div style={{ display: "inline-block", background: tc + "33", border: `1px solid ${tc}`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, color: tc, marginBottom: 10 }}>{tl}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: "0 0 14px", lineHeight: 1.4, fontFamily: '"Quicksand",sans-serif' }}>{challenge.q}</h3>
      {showH && (
        <div style={{ background: "#fbbf2422", border: "1px solid #fbbf2455", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#fde68a", display: "flex", alignItems: "center", gap: 8 }}>
          <CharPortrait name="Griffith" size={22} />
          <span>Griffith whispers: <em>"{challenge.hint}"</em></span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {challenge.opts.map((o, i) => {
          let bg = "#1e293b", bd = "#334155";
          if (show && i === sel) { bg = ok ? "#166534" : "#991b1b"; bd = ok ? "#22c55e" : "#ef4444"; }
          return (
            <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `2px solid ${bd}`, borderRadius: 10, padding: "11px 14px", textAlign: "left", cursor: show ? "default" : "pointer", color: "#e2e8f0", fontSize: 14, fontFamily: '"Quicksand",sans-serif', transition: "all 0.2s", fontWeight: 500 }}>
              <span style={{ marginRight: 8, fontWeight: 700, color: "#94a3b8" }}>{String.fromCharCode(65 + i)}.</span>{o}
            </button>
          );
        })}
      </div>
      {show && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, fontSize: 12, lineHeight: 1.5, animation: "fadeSlideUp 0.3s ease-out", fontFamily: '"Quicksand",sans-serif', background: ok ? "#166534" : "#7f1d1d", border: `1px solid ${ok ? "#22c55e" : "#ef4444"}`, color: ok ? "#bbf7d0" : "#fecaca" }}>
          {ok ? `✨ Brilliant! ${challenge.explain}` : "Not quite! Try again — you've got this! 💪"}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN GAME COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Game() {
  const [screen, setScreen] = useState("loading");
  const [gd, setGd] = useState(null);
  const [realm, setRealm] = useState(null);
  const [chIdx, setChIdx] = useState(0);
  const [qStars, setQStars] = useState(3);
  const [hintUsed, setHintUsed] = useState(false);
  const [dName, setDName] = useState("");
  const [nameIn, setNameIn] = useState("");
  const [mapPg, setMapPg] = useState(0);
  const [evo, setEvo] = useState(null);

  useEffect(() => { (async () => { const s = await loadGame(); if (s) { setGd(s); setScreen("map"); } else { setScreen("title"); } })(); }, []);
  const save = useCallback(async (d) => { setGd(d); await saveGame(d); }, []);
  const goMap = useCallback(() => { setRealm(null); setEvo(null); setScreen("map"); }, []);

  const qc = gd ? Object.keys(gd.quests).length : 0;

  // ─── TITLE ──────────────────────────────────────
  if (screen === "title") return (
    <div style={S.ctn}><StarField />
      <div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}>
        <div style={{ animation: "fadeSlideUp 0.8s ease-out" }}>
          <DragonSVG quests={0} size={100} />
          <h1 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 28, color: "#ffd700", margin: "8px 0 4px", textShadow: "0 0 30px rgba(255,215,0,0.3)" }}>Dragon Masters</h1>
          <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 15, color: "#c084fc", margin: "0 0 20px", fontWeight: 400 }}>Academy of Knowledge</h2>
          <p style={{ color: "#94a3b8", fontSize: 13, maxWidth: 320, margin: "0 auto 24px", lineHeight: 1.6, fontFamily: '"Quicksand",sans-serif' }}>The Dragon Stone is fading. Journey through 20 magical realms, befriend legendary dragons, and unlock the power of knowledge!</p>
          <button onClick={() => setScreen("intro")} style={S.pri}>✨ Begin Your Quest</button>
        </div>
      </div>
    </div>
  );

  // ─── INTRO ──────────────────────────────────────
  if (screen === "intro") return (
    <div style={S.ctn}><StarField />
      <div style={{ ...S.cnt, justifyContent: "center" }}>
        <div style={{ animation: "fadeSlideUp 0.6s ease-out", maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
          <CharPortrait name="Griffith" size={56} />
          <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 18, color: "#ffd700", margin: "12px 0 14px" }}>Welcome, Young Dragon Master!</h2>
          <div style={{ background: "#1e293b", borderRadius: 14, padding: "16px 18px", border: "1px solid #334155", textAlign: "left", marginBottom: 20 }}>
            <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.65, margin: 0, fontFamily: '"Quicksand",sans-serif' }}>"I am Griffith, the wizard of Bracken Castle. The Dragon Stone has chosen <strong style={{ color: "#ffd700" }}>you</strong> as our newest Dragon Master!<br /><br />But dark clouds gather. The Stone is losing its magic. Only by journeying through <strong style={{ color: "#c084fc" }}>20 enchanted realms</strong> can you restore its power.<br /><br />First, you need a dragon companion..."</p>
          </div>
          <button onClick={() => setScreen("hatch")} style={S.pri}>🥚 Receive Your Dragon Egg</button>
        </div>
      </div>
    </div>
  );

  // ─── HATCH ──────────────────────────────────────
  if (screen === "hatch") return (
    <div style={S.ctn}><StarField />
      <div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}>
        <div style={{ animation: "fadeSlideUp 0.6s ease-out" }}>
          {!dName ? (
            <>
              <div style={{ fontSize: 64, marginBottom: 12, animation: "eggWobble 2s ease-in-out infinite" }}>🥚</div>
              <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 18, color: "#ffd700", margin: "0 0 6px" }}>Your Dragon Egg!</h2>
              <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 16, fontFamily: '"Quicksand",sans-serif' }}>Name your dragon to hatch it!</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", maxWidth: 280, margin: "0 auto" }}>
                <input value={nameIn} onChange={(e) => setNameIn(e.target.value)} placeholder="Dragon's name..." autoFocus
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "2px solid #ffd700", background: "#1e293b", color: "#ffd700", fontSize: 14, fontFamily: '"Quicksand",sans-serif', outline: "none" }}
                  onKeyDown={(e) => e.key === "Enter" && nameIn.trim() && setDName(nameIn.trim())} />
                <button onClick={() => nameIn.trim() && setDName(nameIn.trim())} disabled={!nameIn.trim()} style={{ ...S.pri, opacity: nameIn.trim() ? 1 : 0.4, padding: "10px 16px" }}>Hatch!</button>
              </div>
            </>
          ) : (
            <div style={{ animation: "fadeSlideUp 0.8s ease-out" }}>
              <DragonSVG quests={0} size={140} />
              <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 20, color: "#ffd700", margin: "10px 0 2px" }}>Meet {dName}!</h2>
              <p style={{ color: "#a7f3d0", fontSize: 13, marginBottom: 2, fontFamily: '"Quicksand",sans-serif', fontWeight: 600 }}>🐉 Hatchling</p>
              <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 20, fontFamily: '"Quicksand",sans-serif' }}>{dName} will grow stronger and unlock 7 powers as you complete quests!</p>
              <button onClick={async () => { const d = { dragonName: dName, quests: {}, totalStars: 0 }; await save(d); setScreen("map"); }} style={S.pri}>🗺️ View the Quest Map</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── LOADING ──────────────────────────────────────
  if (screen === "loading" || !gd) return (
    <div style={S.ctn}><StarField /><div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}><div style={{ fontSize: 48, animation: "dragonFloat 2s ease-in-out infinite" }}>🐉</div><p style={{ color: "#94a3b8", fontSize: 13, marginTop: 10, fontFamily: '"Quicksand",sans-serif' }}>Loading...</p></div></div>
  );

  // ─── EVOLUTION ──────────────────────────────────────
  if (screen === "evolve" && evo) {
    const os = getDragonStage(evo.oldQ);
    const ns = getDragonStage(evo.newQ);
    const ni = getDragonStageIdx(evo.newQ);
    const allP = DRAGON_STAGES.filter((s) => s.power);
    return (
      <div style={S.ctn}><StarField />
        <div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}>
          <StatusBar gd={gd} onDragon={() => { }} />
          <div style={{ animation: "fadeSlideUp 0.8s ease-out" }}>
            <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 17, color: "#c084fc", margin: "0 0 14px" }}>✨ Dragon Evolution! ✨</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ textAlign: "center", opacity: 0.4 }}><DragonSVG quests={evo.oldQ} size={65} animate={false} /><p style={{ color: "#64748b", fontSize: 9, marginTop: 2, fontFamily: '"Quicksand",sans-serif' }}>{os.name}</p></div>
              <div style={{ fontSize: 24, color: "#ffd700", animation: "pulse 1s ease-in-out infinite" }}>→</div>
              <div style={{ textAlign: "center" }}><div style={{ animation: "dragonFloat 2s ease-in-out infinite" }}><DragonSVG quests={evo.newQ} size={110} /></div><p style={{ color: "#ffd700", fontSize: 12, fontWeight: 700, marginTop: 2, fontFamily: '"Quicksand",sans-serif' }}>{ns.name}</p></div>
            </div>
            <h3 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 18, color: "#ffd700", margin: "0 0 2px" }}>{gd.dragonName}</h3>
            <p style={{ color: "#a7f3d0", fontSize: 13, margin: "0 0 14px", fontFamily: '"Quicksand",sans-serif' }}>has evolved after {evo.newQ} quests!</p>
            {ns.power && (
              <div style={{ background: "linear-gradient(135deg,#1e293b,#0f172a)", borderRadius: 14, padding: "14px 16px", border: "1px solid #ffd70044", marginBottom: 14, animation: "fadeSlideUp 1s ease-out 0.5s both" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{ns.power}</div>
                <p style={{ color: "#ffd700", fontSize: 14, fontWeight: 700, margin: "0 0 2px", fontFamily: '"Quicksand",sans-serif' }}>New Power: {ns.powerName}!</p>
                <p style={{ color: "#94a3b8", fontSize: 11, margin: 0, fontFamily: '"Quicksand",sans-serif' }}>{ns.powerDesc}</p>
              </div>
            )}
            <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, border: "1px solid #1e293b" }}>
              <p style={{ color: "#64748b", fontSize: 10, fontWeight: 700, margin: "0 0 6px", letterSpacing: 1 }}>ALL POWERS</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
                {allP.map((s, i) => { const u = ni >= DRAGON_STAGES.indexOf(s); return (<div key={i} style={{ background: u ? "#1e293b" : "#0a0a1a", borderRadius: 7, padding: "4px 8px", fontSize: 10, color: u ? "#e2e8f0" : "#334155", border: `1px solid ${u ? "#334155" : "#1e293b"}`, fontFamily: '"Quicksand",sans-serif' }}>{s.power} {s.powerName}{u ? "" : " 🔒"}</div>); })}
              </div>
            </div>
            <button onClick={goMap} style={S.pri}>🗺️ Continue Adventure</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DRAGON VIEW ──────────────────────────────────────
  if (screen === "dragon_view") {
    const si = getDragonStageIdx(qc);
    const stage = getDragonStage(qc);
    const ns = DRAGON_STAGES.find((s) => s.minQuests > qc);
    return (
      <div style={S.ctn}><StarField />
        <div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}>
          <div style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
            <DragonSVG quests={qc} size={150} />
            <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 20, color: "#ffd700", margin: "10px 0 2px" }}>{gd.dragonName}</h2>
            <p style={{ color: "#a7f3d0", fontSize: 13, margin: "0 0 14px", fontWeight: 600, fontFamily: '"Quicksand",sans-serif' }}>🐉 {stage.name} • {qc} quests completed</p>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: "12px 16px", border: "1px solid #334155", maxWidth: 280, margin: "0 auto 10px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", fontFamily: '"Quicksand",sans-serif', marginBottom: 6 }}><span>⭐ {gd.totalStars} Stars</span><span>📜 {qc}/20 Quests</span></div>
              {ns && <p style={{ color: "#a78bfa", fontSize: 10, margin: "4px 0 0", fontFamily: '"Quicksand",sans-serif' }}>Next evolution: <strong>{ns.name}</strong> at {ns.minQuests} quests ({ns.minQuests - qc} to go!)</p>}
            </div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: "12px 16px", border: "1px solid #334155", maxWidth: 280, margin: "0 auto 14px" }}>
              <p style={{ color: "#64748b", fontSize: 10, fontWeight: 700, margin: "0 0 6px", letterSpacing: 1, textAlign: "left" }}>POWERS ({DRAGON_STAGES.filter((s) => s.power && si >= DRAGON_STAGES.indexOf(s)).length}/7)</p>
              {DRAGON_STAGES.filter((s) => s.power).map((s, i) => {
                const u = si >= DRAGON_STAGES.indexOf(s);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderTop: i ? "1px solid #0f172a" : "none" }}>
                    <span style={{ fontSize: 18, opacity: u ? 1 : 0.3 }}>{s.power}</span>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: u ? "#e2e8f0" : "#475569", fontFamily: '"Quicksand",sans-serif' }}>{s.powerName}{u ? " ✓" : " 🔒"}</p>
                      <p style={{ margin: 0, fontSize: 9, color: u ? "#94a3b8" : "#334155", fontFamily: '"Quicksand",sans-serif' }}>{u ? s.powerDesc : `Unlocks at ${s.minQuests} quests`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={goMap} style={S.sec}>← Back to Map</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAP ──────────────────────────────────────
  if (screen === "map") {
    const grps = [REALMS.slice(0, 7), REALMS.slice(7, 14), REALMS.slice(14, 20)];
    const th = MAP_THEMES[mapPg];
    const rms = grps[mapPg];
    return (
      <div style={{ ...S.ctn, background: th.bg }}><StarField />
        <div style={S.cnt}>
          <StatusBar gd={gd} onDragon={() => setScreen("dragon_view")} />
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 16, color: th.accent, margin: "0 0 1px" }}>{th.name}</h2>
            <p style={{ color: "#64748b", fontSize: 10, margin: 0, fontFamily: '"Quicksand",sans-serif' }}>{th.sub}</p>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            {MAP_THEMES.map((t, i) => (<button key={i} onClick={() => setMapPg(i)} style={{ flex: 1, padding: "6px 3px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: '"Quicksand",sans-serif', background: mapPg === i ? t.accent + "33" : "#1e293b", color: mapPg === i ? t.accent : "#475569" }}>{t.emojis[0]} {["1–7", "8–14", "15–20"][i]}</button>))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 6, fontSize: 14, opacity: 0.25 }}>{th.emojis.map((e, i) => (<span key={i}>{e}</span>))}</div>
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 6 }}>
            {rms.map((r, i) => {
              const done = !!gd.quests[r.id]; const unlk = r.id === 1 || gd.quests[r.id - 1]; const lk = !done && !unlk;
              return (
                <div key={r.id}>
                  {i > 0 && <div style={{ width: 3, height: 16, background: th.path, margin: "0 auto", borderRadius: 2 }} />}
                  <button onClick={lk ? undefined : () => { setRealm(r); setChIdx(0); setQStars(3); setHintUsed(false); setScreen("quest_intro"); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: lk ? "#1a1a2a" : done ? r.color + "15" : "#1e293b", border: `2px solid ${lk ? "#333" : done ? r.color + "66" : r.color + "44"}`, borderRadius: 12, cursor: lk ? "default" : "pointer", opacity: lk ? 0.4 : 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: r.color + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: `1px solid ${r.color}44` }}>{r.icon}</div>
                    <div style={{ flex: 1, textAlign: "left" }}><p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#e2e8f0", fontFamily: '"Quicksand",sans-serif' }}>{r.id}. {r.title}</p><p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b", fontFamily: '"Quicksand",sans-serif' }}>{r.dragon} & {r.master}</p></div>
                    <div style={{ flexShrink: 0 }}>{done && <span style={{ fontSize: 11 }}>{"⭐".repeat(gd.quests[r.id])}</span>}{lk && <span style={{ fontSize: 13 }}>🔒</span>}{!lk && !done && <span style={{ fontSize: 10, color: r.color, fontWeight: 700 }}>GO →</span>}</div>
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={async () => { if (window.confirm("Start a brand new adventure?")) { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } setGd(null); setDName(""); setNameIn(""); setScreen("title"); } }} style={{ background: "none", border: "none", color: "#475569", fontSize: 9, cursor: "pointer", marginTop: 4, fontFamily: '"Quicksand",sans-serif' }}>🔄 Reset</button>        </div>
      </div>
    );
  }

  // ─── QUEST INTRO ──────────────────────────────────────
  if (screen === "quest_intro" && realm) return (
    <div style={S.ctn}><StarField />
      <div style={S.cnt}>
        <StatusBar gd={gd} onDragon={() => setScreen("dragon_view")} />
        <div style={{ animation: "fadeSlideUp 0.6s ease-out" }}>
          <SceneIllustration realm={realm} />
          <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 16, color: realm.color, margin: "0 0 1px", textAlign: "center" }}>Realm {realm.id}: {realm.title}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 8, marginTop: 6 }}>
            <CharPortrait name={realm.master} size={30} />
            <div style={{ textAlign: "left" }}><p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#e2e8f0", fontFamily: '"Quicksand",sans-serif' }}>{realm.master}</p><p style={{ margin: 0, fontSize: 9, color: "#64748b" }}>Dragon: {realm.dragon}</p></div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 12, padding: "12px 16px", border: `1px solid ${realm.color}33`, marginBottom: 12, textAlign: "left", maxHeight: 200, overflowY: "auto" }}>
            <p style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.6, margin: 0, fontFamily: '"Quicksand",sans-serif' }}>{realm.intro}</p>
          </div>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 12 }}>
            {realm.challenges.map((c, i) => (<div key={i} style={{ background: "#0f172a", borderRadius: 7, padding: "4px 8px", fontSize: 10, color: "#64748b" }}>{c.type === "science" ? "🔬" : c.type === "math" ? "🔢" : "🧩"} {c.type}</div>))}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={goMap} style={S.sec}>← Back</button>
            <button onClick={() => setScreen("challenge")} style={{ ...S.pri, background: `linear-gradient(135deg,${realm.color},${realm.color}bb)` }}>⚔️ Begin Quest</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── CHALLENGE ──────────────────────────────────────
  if (screen === "challenge" && realm) {
    const ch = realm.challenges[chIdx];
    return (
      <div style={S.ctn}><StarField />
        <div style={S.cnt}>
          <StatusBar gd={gd} onDragon={() => setScreen("dragon_view")} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <span style={{ color: realm.color, fontSize: 16 }}>{realm.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 3 }}>{realm.challenges.map((_, i) => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < chIdx ? "#22c55e" : i === chIdx ? realm.color : "#334155" }} />))}</div>
              <p style={{ color: "#64748b", fontSize: 9, margin: "2px 0 0", fontFamily: '"Quicksand",sans-serif' }}>Challenge {chIdx + 1}/{realm.challenges.length}</p>
            </div>
          </div>
          <Challenge key={`${realm.id}-${chIdx}`} challenge={ch} griffithHint={hintUsed}
            onCorrect={() => { if (chIdx < realm.challenges.length - 1) { setChIdx(chIdx + 1); setHintUsed(false); } else { setScreen("quest_complete"); } }} />
          {!hintUsed && <button onClick={() => { setHintUsed(true); setQStars(Math.max(1, qStars - 1)); }} style={{ ...S.sec, marginTop: 12, fontSize: 11 }}>🧙‍♂️ Ask Griffith for a Hint (-1 ⭐)</button>}
        </div>
      </div>
    );
  }

  // ─── QUEST COMPLETE ──────────────────────────────────────
  if (screen === "quest_complete" && realm) {
    const prev = gd.quests[realm.id] || 0;
    const earned = Math.max(qStars, prev);
    const oldQC = qc;
    const newQC = gd.quests[realm.id] ? qc : qc + 1; // only increment if first time
    const oldSI = getDragonStageIdx(oldQC);
    const newSI = getDragonStageIdx(newQC);
    const evolved = newSI > oldSI;
    const isFinale = realm.id === 20 && !gd.quests[20];

    const cont = async () => {
      const nd = { ...gd, totalStars: gd.totalStars + (earned - prev), quests: { ...gd.quests, [realm.id]: earned } };
      await save(nd);
      if (isFinale) { setScreen("finale"); }
      else if (evolved) { setEvo({ oldQ: oldQC, newQ: newQC }); setScreen("evolve"); }
      else { goMap(); }
    };

    return (
      <div style={S.ctn}><StarField />
        <div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}>
          <StatusBar gd={gd} onDragon={() => { }} />
          <div style={{ animation: "fadeSlideUp 0.6s ease-out" }}>
            <div style={{ fontSize: 44, marginBottom: 4 }}>🎉</div>
            <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 18, color: "#ffd700", margin: "0 0 10px" }}>Quest Complete!</h2>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{"⭐".repeat(earned)}{"☆".repeat(3 - earned)}</div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: "12px 16px", border: `1px solid ${realm.color}33`, marginBottom: 14, textAlign: "left", maxHeight: 170, overflowY: "auto" }}>
              <p style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.55, margin: 0, fontFamily: '"Quicksand",sans-serif' }}>{realm.outro}</p>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", border: "1px solid #1e293b", marginBottom: 14, maxWidth: 260, margin: "0 auto 14px" }}>
              <p style={{ color: "#fbbf24", fontSize: 12, margin: "0 0 3px", fontWeight: 700, fontFamily: '"Quicksand",sans-serif' }}>Quest {realm.id} of 20 complete!</p>
              {evolved && <p style={{ color: "#22c55e", fontSize: 12, margin: "3px 0 0", fontWeight: 700, fontFamily: '"Quicksand",sans-serif', animation: "pulse 1s infinite" }}>🐉 {gd.dragonName} is evolving!</p>}
            </div>
            <button onClick={cont} style={S.pri}>{isFinale ? "🏆 See the Grand Finale!" : evolved ? `🐉 See ${gd.dragonName} Evolve!` : "🗺️ Back to Map"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── GRAND FINALE ──────────────────────────────────────
  if (screen === "finale") {
    const finalStage = getDragonStage(20);
    return (
      <div style={S.ctn}><StarField />
        <div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}>
          <div style={{ animation: "fadeSlideUp 1s ease-out" }}>
            <div style={{ fontSize: 48, marginBottom: 8, animation: "pulse 2s ease-in-out infinite" }}>🏆</div>
            <h1 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 22, color: "#ffd700", margin: "0 0 4px", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>The Dragon Stone is Restored!</h1>
            <p style={{ color: "#c084fc", fontSize: 14, margin: "0 0 16px", fontFamily: '"Quicksand",sans-serif' }}>All 20 realms conquered!</p>

            <DragonSVG quests={20} size={160} />
            <h3 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 18, color: "#ffd700", margin: "8px 0 2px" }}>{gd.dragonName}</h3>
            <p style={{ color: "#a7f3d0", fontSize: 13, margin: "0 0 16px", fontWeight: 600, fontFamily: '"Quicksand",sans-serif' }}>🐉 {finalStage.name} — All 7 Powers Unlocked!</p>

            <div style={{ background: "#1e293b", borderRadius: 14, padding: "16px 18px", border: "1px solid #ffd70033", marginBottom: 16, textAlign: "left" }}>
              <p style={{ color: "#64748b", fontSize: 10, fontWeight: 700, margin: "0 0 8px", letterSpacing: 1 }}>YOUR JOURNEY</p>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 10 }}>
                <div style={{ textAlign: "center" }}><p style={{ color: "#ffd700", fontSize: 22, fontWeight: 700, margin: 0 }}>20</p><p style={{ color: "#64748b", fontSize: 10, margin: 0 }}>Realms</p></div>
                <div style={{ textAlign: "center" }}><p style={{ color: "#ffd700", fontSize: 22, fontWeight: 700, margin: 0 }}>⭐ {gd.totalStars}</p><p style={{ color: "#64748b", fontSize: 10, margin: 0 }}>Stars</p></div>
                <div style={{ textAlign: "center" }}><p style={{ color: "#ffd700", fontSize: 22, fontWeight: 700, margin: 0 }}>7</p><p style={{ color: "#64748b", fontSize: 10, margin: 0 }}>Powers</p></div>
              </div>
              <p style={{ color: "#64748b", fontSize: 10, fontWeight: 700, margin: "8px 0 6px", letterSpacing: 1 }}>POWERS MASTERED</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                {DRAGON_STAGES.filter((s) => s.power).map((s, i) => (<div key={i} style={{ background: "#0f172a", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#e2e8f0", border: "1px solid #334155" }}>{s.power} {s.powerName}</div>))}
              </div>
              <p style={{ color: "#64748b", fontSize: 10, fontWeight: 700, margin: "10px 0 6px", letterSpacing: 1 }}>DRAGONS BEFRIENDED</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                {REALMS.map((r) => (<span key={r.id} style={{ fontSize: 10, color: r.color, fontFamily: '"Quicksand",sans-serif' }}>{r.icon}{r.dragon}{r.id < 20 ? " •" : ""} </span>))}
              </div>
            </div>

            <div style={{ background: "#0f172a", borderRadius: 12, padding: "14px 16px", border: "1px solid #334155", marginBottom: 16 }}>
              <CharPortrait name="Griffith" size={36} />
              <p style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.5, margin: "8px 0 0", fontFamily: '"Quicksand",sans-serif', fontStyle: "italic" }}>"You have journeyed through earth and fire, water and wind, time and sound. Every challenge made you stronger. Every dragon you befriended made the world brighter. The Dragon Stone blazes with power once more — and it's all because of you, young Dragon Master. This isn't an ending. It's the beginning of everything."</p>
              <p style={{ color: "#ffd700", fontSize: 11, margin: "6px 0 0", fontWeight: 700 }}>— Griffith the Wizard</p>
            </div>

            <button onClick={goMap} style={S.pri}>🗺️ Return to Map (Replay Quests!)</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FALLBACK ──────────────────────────────────────
  return (
    <div style={S.ctn}><StarField />
      <div style={{ ...S.cnt, justifyContent: "center", textAlign: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: 13 }}>Something went wrong!</p>
        <button onClick={goMap} style={{ ...S.pri, marginTop: 10 }}>🗺️ Return to Map</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */
const S = {
  ctn: { background: "linear-gradient(170deg,#0a0a1a,#1a0a2e 40%,#0f172a)", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: '"Quicksand",sans-serif', position: "relative", overflow: "hidden" },
  cnt: { maxWidth: 460, width: "100%", margin: "0 auto", padding: "14px 12px", display: "flex", flexDirection: "column", flex: 1, position: "relative", zIndex: 1 },
  pri: { background: "linear-gradient(135deg,#ffd700,#f59e0b)", color: "#1a0a2e", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: '"Quicksand",sans-serif', boxShadow: "0 4px 20px rgba(255,215,0,0.3)" },
  sec: { background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 10, padding: "9px 16px", fontSize: 12, cursor: "pointer", fontFamily: '"Quicksand",sans-serif' },
};

const ss = document.createElement("style");
ss.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Quicksand:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{margin:0;overflow-x:hidden}
@keyframes twinkle{0%,100%{opacity:0.1}50%{opacity:0.8}}
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes dragonFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes eggWobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
@keyframes fireFlicker{from{transform:scaleY(1)}to{transform:scaleY(1.3)}}
button:hover{filter:brightness(1.1)}button:active{transform:scale(0.97)!important}
`;
document.head.appendChild(ss);
