// Bot for the lifesteal server.
const mineflayer = require('mineflayer')

const sleep = ms => new Promise(res => setTimeout(res, ms))

// ======================================================
// Natural Username Generator (Option 3 Expanded)
// ======================================================

const words = [
  // original (deduplicated)
  "pixel", "craft", "void", "block", "nova", "shadow", "orbit", "flare",
  "frost", "ember", "storm", "echo", "vortex", "lunar", "solar", "rift",
  "spark", "phantom", "cosmo", "nebula", "drift", "flux", "glitch",
  "myth", "zen", "byte", "core", "pulse", "static", "arc",

  // added (all unique)
  "cool", "chill", "savage", "epic", "real", "toxic", "silent", "dark", "chaotic",
  "gamer", "noob", "pro", "clutch", "boss", "legend", "grind", "sweat",
  "wolf", "fox", "raven", "dragon", "tiger", "lion", "bear", "hawk", "ghost",
  "king", "queen", "lord", "titan", "beast", "alpha", "reaper", "slayer", "warden",
  "eclipse", "night", "dusk", "neon", "ash", "blaze", "smoke", "fury",
  "cipher", "enigma", "arcane", "omega", "sigma", "prime",
  "lucky", "glow", "aura", "star", "comet", "meteor",
  "matrix", "quantum", "signal", "vector", "kernel", "binary", "syntax",
  "rogue", "nomad", "stray", "wander", "riftwalk", "sentinel",
  "iron", "steel", "obsidian", "onyx", "crimson", "ivory"
]


const suffixes = [
  // original
  "x", "z", "fx", "tv", "irl", "gg", "lol", "dev", "exe", "fps",

  // added
  "xd", "qt", "op", "pro", "god", "bot", "ai", "net", "live", "hub",
  "yt", "ttv", "stream", "clips", "vod",
  "420", "69", "67", "777", "999", "101",
  "v2", "v3", "v4", "plus", "max",
  "official", "real", "main",
  "mc", "craft", "pvp", "uhc", "bedrock",
  "one", "two", "three"
]

const separators = ["", "", "", "_", "."]

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function maybe(prob) {
  return Math.random() < prob
}

function generateNaturalUsername() {
  let username = ""

  const word1 = random(words)
  const word2 = random(words)

  const style = Math.floor(Math.random() * 4)

  switch (style) {
    case 0:
      username = capitalize(word1)
      break
    case 1:
      username = capitalize(word1) + capitalize(word2)
      break
    case 2:
      username = word1 + random(separators) + word2
      break
    case 3:
      username = word1
      break
  }

  if (maybe(0.3)) {
    username += random(suffixes)
  }

  if (maybe(0.4)) {
    const n = Math.floor(Math.random() * 3)
    if (n === 0) username += Math.floor(Math.random() * 10)
    if (n === 1) username += Math.floor(Math.random() * 100)
    if (n === 2) username += Math.floor(Math.random() * 1000)
  }

  return username
}

// Prevent duplicate usernames
const usedNames = new Set()

function getUniqueUsername() {
  let name
  do {
    name = generateNaturalUsername()
  } while (usedNames.has(name))
  usedNames.add(name)
  return name
}

// ======================================================
// Run a single bot with given username
// ======================================================

function createBot(username) {
  return new Promise((resolve) => {
    const bot = mineflayer.createBot({
      host: 'java.adderall.ir',
      port: 25565,
      username,
      version: '1.21.7'
    })

    async function dropSpecificItems(names = []) {
      if (!bot.inventory) return
      for (const item of bot.inventory.items()) {
        if (names.includes(item.name)) {
          try {
            await bot.tossStack(item)
            console.log(`✔ Dropped ${item.name} x${item.count}`)
            await sleep(300)
          } catch (err) {
            console.log(`❌ Failed to drop ${item.name}:`, err.message)
          }
        }
      }
    }

    bot.on('messagestr', msg => console.log(`[${username} CHAT]`, msg))

    bot.once('spawn', async () => {
      console.log(`✅ Bot spawned as ${username}`)

      try {
        bot.chat('/register notmypassword1 notmypassword1')
        await sleep(2000)

        bot.chat('/login notmypassword1')
        await sleep(2000)

        bot.chat('/server lifesteal')
        await sleep(2000)

        // Warp GUI
        bot.chat('/warps')
        await sleep(2000)
        if (bot.currentWindow) {
          await bot.clickWindow(14, 0, 0)
          console.log(`[${username}] ✔ Clicked warp slot`)
          await sleep(5000)
          if (bot.currentWindow) {
            bot.closeWindow(bot.currentWindow)
            console.log(`[${username}] ✔ Closed Warp GUI`)
          }
        }

        // Rewards GUI
        await sleep(3000)
        bot.chat('/rewards')
        await sleep(2000)
        if (bot.currentWindow) {
          await bot.clickWindow(10, 0, 0)
          console.log(`[${username}] ✔ Clicked daily reward`)
          await sleep(1000)
          if (bot.currentWindow) {
            bot.closeWindow(bot.currentWindow)
            console.log(`[${username}] ✔ Closed rewards GUI`)
          }
        }

        await dropSpecificItems(['amethyst_shard'])

        await sleep(2000)
        bot.quit()
        resolve()

      } catch (err) {
        console.log(`[${username}] ❌ Error:`, err)
        bot.quit()
        resolve()
      }
    })

    bot.on('end', () => {
      console.log(`[${username}] Disconnected.`)
      resolve()
    })
  })
}

// ======================================================
// Run bots sequentially
// ======================================================

async function runAllBots() {
  for (let i = 0; i < 100; i++) {
    const username = getUniqueUsername()
    console.log(`\n🚀 Starting bot: ${username}`)
    await createBot(username)
    await sleep(2000)
  }
  console.log("✅ Finished running all 100 bots")
}

runAllBots()
