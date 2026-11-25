// Illustrative code for the figures. It shows the shape of the protocol, not published contracts.

export const SOL_CLEARING = `// Illustrative. Not the published contracts.
interface ILongtableClearing {
  // Mint at time T against the clearinghouse backstop
  function mintOnBackstop(
    address issuer,
    bytes32 security,   // the underlying share
    uint256 quantity,
    uint64  settleBy    // the tradfi leg, e.g. T+1
  ) external returns (bytes32 obligationId);

  // Net every open obligation in the cycle
  function closeCycle(uint32 cycle)
    external returns (int256[] memory netDues);
}`

export const TS_RFQ = `// Illustrative RFQ fill, settled post-trade
const quote = await solver.quote({ token: "TSLAx", side: "buy", qty: 500 })

const fill = await clearing.mintOnBackstop({
  issuer:   quote.issuer,
  security: quote.security,
  quantity: quote.qty,
  settleBy: tPlus(1),
})

// Cash proceeds pay for the share, post-trade
await clearing.settle(fill.obligationId, { from: "proceeds" })`

export function cycleJson(dues: [string, string, number, number, string][]) {
  const net = (k: string, w: number) => (k === 'r' ? `+${w}` : k === 'p' ? `-${w}` : '0')
  const rows = dues.map(([c, a, , w, k]) => `    { "member": "${c}", "net": "${net(k, w)}", "status": "${a.toLowerCase()}" }`).join(',\n')
  return `// Illustrative net dues, published every cycle
{
  "cycle": 1,
  "of": 3,
  "publishedAt": "08:00Z",
  "dues": [
${rows}
  ]
}`
}

export const SOL_SOLVER = `// Illustrative solver adapter (template contract)
interface ISolverAdapter {
  // Quote a primary-issued token against an RFQ taker order
  function quote(bytes32 security, uint256 qty)
    external returns (uint256 price, address issuer);

  // Fill on the backstop; the share settles post-trade
  function fill(bytes32 quoteId)
    external returns (bytes32 obligationId);
}`
