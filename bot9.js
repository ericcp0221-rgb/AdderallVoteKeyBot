const mineflayer = require('mineflayer')

let bot // global bot so all functions can access
let usernameCounter = 1 // Counter to append to the username

// simple sleep helper
const sleep = ms => new Promise(res => setTimeout(res, ms))

// 🔽 Main bot sequence
function createBot() {
  const username = `Metier12${usernameCounter}`  // Dynamic username based on the counter
  bot = mineflayer.createBot({
    host: 'java.adderall.ir',
    port: 25565,
    username: username,  // <----username with counter appended
    version: '1.21.7'
  })
  
  async function dropSpecificItems(names = []) {
    if (!bot.inventory) {
      console.log('⚠ Inventory not ready yet')
      return
    }

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

  // print in-game chat to terminal
  bot.on('messagestr', msg => console.log('[CHAT]', msg))

  bot.once('spawn', async () => {
    console.log('✅ Bot spawned, starting sequence...')

    try {
      // Register + login
      bot.chat('/register notmypassword1 notmypassword1')
      await sleep(2000)
      bot.chat('/login notmypassword1')
      await sleep(2000)
      bot.chat('/oneblock')
      await sleep(2000)

      bot.chat('/warp')
      await sleep(2000)
      if (bot.currentWindow) {
        await bot.clickWindow(23, 0, 0) // 23 slot (index 15)
        console.log('✔ Clicked warp slot (23)')
        await sleep(4000)
        if (bot.currentWindow) {
          bot.closeWindow(bot.currentWindow)
          console.log("✔ Closed Warp GUI")
        } else {
          console.log("⚠ Warp GUI already closed")
        }
      } else {
        console.log('⚠ Warp GUI not open')
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

    } catch (err) {
      console.log('❌ Sequence error:', err)
    }
  })

  // Detect disconnections and increment username counter
  bot.on('end', () => {
    console.log(`❌ Bot disconnected. Changing username...`)
    usernameCounter++ // Increment username number on disconnect
    createBot() // Recreate bot with new username
  })

  bot.on('error', (err) => {
    console.log(`⚠ Bot encountered an error: ${err.message}. Reconnecting...`)
    bot.end() // End the connection to trigger 'end' event and reconnect
  })
}

// start bot
createBot()
