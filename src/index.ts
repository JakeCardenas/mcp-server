import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
  name: 'roll-dice-server',
  version: '1.0.0',
})

// Roll Dice Tool
server.tool(
  'roll_dice',
  'Roll one or more dice',
  {
    sides: z.number().min(2).max(100).default(6).describe('Number of sides on the dice'),
    count: z.number().min(1).max(10).default(1).describe('Number of dice to roll'),
  },
  async ({ sides, count }) => {
    const rolls = Array.from({ length: count }, () =>
      Math.floor(Math.random() * sides) + 1
    )
    const total = rolls.reduce((a, b) => a + b, 0)
    return {
      content: [
        {
          type: 'text',
          text: `🎲 Rolled ${count}d${sides}: ${rolls.join(', ')} (Total: ${total})`,
        },
      ],
    }
  }
)

// Blackjack Tool
server.tool(
  'deal_blackjack',
  'Deal a hand of Blackjack',
  {},
  async () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const deck = suits.flatMap(suit => values.map(value => `${value}${suit}`))
    const shuffled = deck.sort(() => Math.random() - 0.5)
    const playerHand = [shuffled[0], shuffled[1]]
    const dealerHand = [shuffled[2], shuffled[3]]
    return {
      content: [
        {
          type: 'text',
          text: `🃏 Blackjack!\nYour hand: ${playerHand.join(', ')}\nDealer hand: ${dealerHand[0]}, 🂠`,
        },
      ],
    }
  }
)

// Poker Tool
server.tool(
  'deal_poker',
  'Deal a poker hand',
  {},
  async () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const deck = suits.flatMap(suit => values.map(value => `${value}${suit}`))
    const shuffled = deck.sort(() => Math.random() - 0.5)
    const hand = shuffled.slice(0, 5)
    return {
      content: [
        {
          type: 'text',
          text: `🃏 Your Poker Hand: ${hand.join(', ')}`,
        },
      ],
    }
  }
)

// Start server
const transport = new StdioServerTransport()
await server.connect(transport)