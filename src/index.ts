export default function handler(req: any, res: any) {
  const body = req.body || {}
  const tool = body.tool
  const params = body.params

  if (req.method === 'GET') {
    return res.status(200).json({
      name: 'roll-dice-server',
      version: '1.0.0',
      tools: ['roll_dice', 'deal_blackjack', 'deal_poker'],
    })
  }

  if (req.method === 'POST') {
    if (tool === 'roll_dice') {
      const sides = params?.sides || 6
      const count = params?.count || 1
      const rolls = Array.from({ length: count }, () =>
        Math.floor(Math.random() * sides) + 1
      )
      const total = rolls.reduce((a: number, b: number) => a + b, 0)
      return res.status(200).json({
        result: 'Rolled ' + count + 'd' + sides + ': ' + rolls.join(', ') + ' (Total: ' + total + ')',
      })
    }

    if (tool === 'deal_blackjack') {
      const suits = ['S', 'H', 'D', 'C']
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
      const deck = suits.flatMap(suit => values.map(value => value + suit))
      const shuffled = deck.sort(() => Math.random() - 0.5)
      const playerHand = [shuffled[0], shuffled[1]]
      const dealerCard = shuffled[2]
      return res.status(200).json({
        result: 'Blackjack! Your hand: ' + playerHand.join(', ') + ' Dealer shows: ' + dealerCard,
      })
    }

    if (tool === 'deal_poker') {
      const suits = ['S', 'H', 'D', 'C']
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
      const deck = suits.flatMap(suit => values.map(value => value + suit))
      const shuffled = deck.sort(() => Math.random() - 0.5)
      const hand = shuffled.slice(0, 5)
      return res.status(200).json({
        result: 'Your Poker Hand: ' + hand.join(', '),
      })
    }

    return res.status(400).json({ error: 'Unknown tool' })
  }
}