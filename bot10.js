// bot9.js
const mineflayer = require('mineflayer')

const sleep = ms => new Promise(res => setTimeout(res, ms))

// Run a single bot with given username
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
        bot.chat('/oneblock')
        await sleep(2000)

        // Warp GUI
        bot.chat('/warp')
        await sleep(2000)
        if (bot.currentWindow) {
          await bot.clickWindow(23, 0, 0)
          console.log(`[${username}] ✔ Clicked warp slot (22)`)
          await sleep(4000)
          if (bot.currentWindow) {
            bot.closeWindow(bot.currentWindow)
            console.log(`[${username}] ✔ Closed Warp GUI`)
          }
        }

         // Kits GUI
      bot.chat('/kits')
      await sleep(2000)
      if (bot.currentWindow) {
        await bot.clickWindow(20, 0, 0) // 1hr kit
        console.log('✔ Clicked kit slot 23')
        await sleep(1000)
        if (bot.currentWindow) {
          bot.closeWindow(bot.currentWindow)
          console.log("✔ Closed Kits GUI")
        } else {
          console.log("⚠ Kits GUI already closed")
        }
      } else {
        console.log('⚠ Kits GUI not open')
      }

      // rewards GUI
      bot.chat('/rewards')
      await sleep(2000)
      if (bot.currentWindow) {
        await bot.clickWindow(11, 0, 0) // daily reward kit
        console.log('✔ Clicked reward slot 11')
        await sleep(1000)
        if (bot.currentWindow) {
          bot.closeWindow(bot.currentWindow)
          console.log("✔ Closed rewards GUI")
        } else {
          console.log("⚠ rewards GUI already closed")
        }
      } else {
        console.log('⚠ rewards GUI not open')
      }

      // Drop everything except armor/offhand
      //await dropInventoryWorking({ keepArmor: true, keepOffhand: true })
      //console.log('✅ Finished dropping inventory (kept armor/offhand)')
      await dropSpecificItems(['tripwire_hook', 'clock'])

        // quit when done
        await sleep(2000)
        bot.quit()
        resolve()

      } catch (err) {
        console.log(`[${username}] ❌ Error in sequence:`, err)
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

// Helper function to generate a random string (e.g., for username)
function generateRandomUsername() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  for (let i = 0; i < 8; i++) {  // You can change the length of the random username
    username += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return username;
}

// Run bots sequentially
async function runAllBots() {
  for (let i = 0; i < 100; i++) {
    const randomUsername = generateRandomUsername();  // Random username generation
    console.log(`\n🚀 Starting bot: ${randomUsername}`)
    await createBot(randomUsername)  // Pass the random username to createBot
    await sleep(5000) // small pause before next
  }
  console.log("✅ Finished running all 100 bots")
}

runAllBots()
