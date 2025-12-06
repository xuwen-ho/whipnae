export const bundles = [
  {
    id: 'tech-bundle',
    title: 'Tech Bundle',
    riskLevel: '7/10',
    description: 'The top stocks in the semiconductor industry (Nvidia, Qualcomm, Entegris, etc.).',
    stocks: ['NVDA', 'QCOM', 'ENTG', 'AMD', 'TSM', 'ASML'],
    imageUrl: '/images/bundles/tech-bundle.png',
    whatsInBundle:
      'This growth‑oriented bundle focuses on semiconductors and core AI infrastructure—companies that power data centers, edge AI, and advanced manufacturing. It targets long‑term capital appreciation with higher cyclicality around product and capex cycles. Best for investors with a 5+ year horizon and medium‑to‑high risk tolerance seeking leveraged exposure to AI and compute demand.',
    atAGlance: [
      'AI and accelerator tailwinds with cyclical swings',
      'Exposure to data center, edge AI, handsets and specialty materials',
      'Key risks: valuation, supply chain, inventory corrections',
    ],
    pastReturns: {
      ytd: '+28% (placeholder)',
      oneY: '+45% (placeholder)',
      threeY: '+85% (placeholder)',
      fiveY: '+220% (placeholder)',
      note: 'Weighted composite of bundle assets; illustrative figures.'
    },
    assets: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', targetAllocation: 35, reason: 'AI/data center leadership with platform moat', price: '—' },
      { symbol: 'QCOM', name: 'Qualcomm Incorporated', targetAllocation: 20, reason: 'Edge AI and diversified licensing', price: '—' },
      { symbol: 'ENTG', name: 'Entegris, Inc.', targetAllocation: 10, reason: 'Specialty materials for advanced nodes/packaging', price: '—' },
      { symbol: 'AMD',  name: 'Advanced Micro Devices, Inc.', targetAllocation: 15, reason: 'CPU/GPU share gains and AI accelerators', price: '—' },
      { symbol: 'TSM',  name: 'Taiwan Semiconductor Manufacturing Co.', targetAllocation: 10, reason: 'Leading-edge foundry capacity', price: '—' },
      { symbol: 'ASML', name: 'ASML Holding N.V.', targetAllocation: 10, reason: 'EUV lithography choke point', price: '—' },
    ],
  },
  {
    id: 'electric-autonomous-bundle',
    title: 'Motor Bundle',
    riskLevel: '8/10',
    description: 'Traded companies in the electric and autonomous vehicle industry.',
    stocks: ['GM', 'BIDU', 'TSLA', 'MBLY', 'BYDDY', 'NIO'],
    imageUrl: '/images/bundles/electric-autonomous-bundle.png',
    whatsInBundle:
      'A thematic basket for the EV transition and autonomy. It blends established OEM scale with autonomy platforms and select EV leaders to capture hardware scale plus software margins. Returns tend to be episodic and policy‑sensitive; suited to patient investors comfortable with volatility and a long runway to adoption.',
    atAGlance: [
      'EV adoption and autonomy platforms in long, uneven cycles',
      'Blend of US OEM scale with China AV/AI exposure',
      'Key risks: regulation, unit economics, capital intensity',
    ],
    pastReturns: {
      ytd: '+7% (placeholder)',
      oneY: '+12% (placeholder)',
      threeY: '-10% (placeholder)',
      fiveY: '+20% (placeholder)',
      note: 'Weighted composite; cyclic and policy‑sensitive sector.'
    },
    assets: [
      { symbol: 'GM',    name: 'General Motors Company', targetAllocation: 30, reason: 'Scale manufacturing and EV transition', price: '—' },
      { symbol: 'BIDU',  name: 'Baidu, Inc.',           targetAllocation: 20, reason: 'Apollo autonomous platform and AI', price: '—' },
      { symbol: 'TSLA',  name: 'Tesla, Inc.',           targetAllocation: 25, reason: 'EV leader with software margin optionality', price: '—' },
      { symbol: 'MBLY',  name: 'Mobileye Global Inc.',  targetAllocation: 10, reason: 'ADAS to autonomy silicon/software', price: '—' },
      { symbol: 'BYDDY', name: 'BYD Company Ltd. ADR',  targetAllocation: 10, reason: 'Vertically integrated EV champion (China)', price: '—' },
      { symbol: 'NIO',   name: 'NIO Inc.',              targetAllocation: 5,  reason: 'Premium EV brand with swapping infra', price: '—' },
    ],
  },
  {
    id: 'digital-bundle',
    title: 'Digital Bundle',
    riskLevel: '6/10',
    description: 'The top performers in the rapidly growing cloud computing industry, including Salesforce, Google, and Nutanix.',
    stocks: ['CRM', 'GOOGL', 'NTNX', 'MSFT', 'AMZN', 'SNOW'],
    imageUrl: '/images/bundles/digital-bundle.png',
    whatsInBundle:
      'A diversified mix of cloud infrastructure, enterprise SaaS, and data platforms. The aim is durable, above‑market growth as organizations modernize and adopt AI‑enabled tools. Volatility tracks IT budgets and macro cycles. Appropriate for investors seeking secular growth with a balanced risk profile and a 3–5+ year horizon.',
    atAGlance: [
      'Secular shift to cloud + AI‑enabled productivity',
      'Diversified: enterprise SaaS, hyperscaler, hybrid multicloud',
      'Key risks: IT budget cycles, pricing pressure, FX',
    ],
    pastReturns: {
      ytd: '+12% (placeholder)',
      oneY: '+22% (placeholder)',
      threeY: '+35% (placeholder)',
      fiveY: '+75% (placeholder)',
      note: 'Composite of large‑cap platform + SaaS + hybrid cloud.'
    },
    assets: [
      { symbol: 'GOOGL', name: 'Alphabet Inc.',          targetAllocation: 30, reason: 'Ads, Cloud, AI platform exposure', price: '—' },
      { symbol: 'CRM',   name: 'Salesforce, Inc.',       targetAllocation: 25, reason: 'Enterprise CRM + data/AI add‑ons', price: '—' },
      { symbol: 'NTNX',  name: 'Nutanix, Inc.',          targetAllocation: 15, reason: 'Hybrid multicloud orchestration', price: '—' },
      { symbol: 'MSFT',  name: 'Microsoft Corporation',  targetAllocation: 15, reason: 'Productivity + Azure + Copilot', price: '—' },
      { symbol: 'AMZN',  name: 'Amazon.com, Inc.',       targetAllocation: 10, reason: 'AWS hyperscale + retail data flywheel', price: '—' },
      { symbol: 'SNOW',  name: 'Snowflake Inc.',         targetAllocation: 5,  reason: 'Data cloud and consumption model', price: '—' },
    ],
  },
  {
    id: 'travel-bundle',
    title: 'Travel Bundle',
    riskLevel: '5/10',
    description: 'A diversified selection of stocks in the hospitality and travel industry, from Hilton to Delta to RyanAir.',
    stocks: ['HLT', 'DAL', 'RYAAY', 'MAR', 'BKNG', 'ABNB', 'RCL'],
    imageUrl: '/images/bundles/travel-bundle.png',
    whatsInBundle:
      'Broad exposure to the travel ecosystem—hospitality, airlines, and online platforms. It aims to participate in normalized demand, pricing power, and loyalty economics while acknowledging macro and fuel‑cost sensitivities. Designed for balanced investors who can tolerate cyclicality in exchange for steady mid‑cycle growth potential.',
    atAGlance: [
      'Normalizing travel demand; loyalty ecosystems drive resilience',
      'Mix of hospitality, US network carrier, European LCC',
      'Key risks: fuel costs, macro slowdowns, geopolitics',
    ],
    pastReturns: {
      ytd: '+6% (placeholder)',
      oneY: '+10% (placeholder)',
      threeY: '+20% (placeholder)',
      fiveY: '+35% (placeholder)',
      note: 'Balanced exposure across hospitality and airlines.'
    },
    assets: [
      { symbol: 'HLT',  name: 'Hilton Worldwide Holdings Inc.', targetAllocation: 25, reason: 'Asset‑light model + loyalty engine', price: '—' },
      { symbol: 'DAL',  name: 'Delta Air Lines, Inc.',           targetAllocation: 20, reason: 'Premium network carrier with leverage', price: '—' },
      { symbol: 'RYAAY',name: 'Ryanair Holdings plc',            targetAllocation: 15, reason: 'Cost leadership in Europe', price: '—' },
      { symbol: 'MAR',  name: 'Marriott International, Inc.',    targetAllocation: 15, reason: 'Global brand portfolio + loyalty', price: '—' },
      { symbol: 'BKNG', name: 'Booking Holdings Inc.',           targetAllocation: 10, reason: 'OTAs and travel demand capture', price: '—' },
      { symbol: 'ABNB', name: 'Airbnb, Inc.',                    targetAllocation: 10, reason: 'Alt accommodations platform scale', price: '—' },
      { symbol: 'RCL',  name: 'Royal Caribbean Group',           targetAllocation: 5,  reason: 'Cruise recovery and pricing power', price: '—' },
    ],
  },
  {
    id: 'media-bundle',
    title: 'Media Bundle',
    riskLevel: '6/10',
    description: 'A curated selection of the largest streaming and gaming companies.',
    stocks: ['NFLX', 'SPOT', 'U', 'DIS', 'RBLX', 'EA'],
    imageUrl: '/images/bundles/media-bundle.png',
    whatsInBundle:
      'A cross‑section of streaming scale, audio platforms, and interactive 3D technologies. It targets growth from subscriber monetization, advertising, and creator economies, but can be choppy around content and product cycles. Suited for growth‑seeking investors who accept higher volatility for long‑term upside.',
    atAGlance: [
      'Streaming scale + audio platform + 3D engine exposure',
      'Diversified monetization: subs, ads, creator economy',
      'Key risks: churn, content spend, creator cycles',
    ],
    pastReturns: {
      ytd: '+9% (placeholder)',
      oneY: '+18% (placeholder)',
      threeY: '+25% (placeholder)',
      fiveY: '+40% (placeholder)',
      note: 'Blend of streaming, audio, and interactive content.'
    },
    assets: [
      { symbol: 'NFLX', name: 'Netflix, Inc.',            targetAllocation: 30, reason: 'Global scale + ad tier rollout', price: '—' },
      { symbol: 'SPOT', name: 'Spotify Technology S.A.',  targetAllocation: 20, reason: 'Two‑sided audio marketplace', price: '—' },
      { symbol: 'U',    name: 'Unity Software Inc.',      targetAllocation: 15, reason: 'Real‑time 3D engine + services', price: '—' },
      { symbol: 'DIS',  name: 'The Walt Disney Company',  targetAllocation: 15, reason: 'Franchises + parks + streaming mix', price: '—' },
      { symbol: 'RBLX', name: 'Roblox Corporation',       targetAllocation: 10, reason: 'User‑generated content platform', price: '—' },
      { symbol: 'EA',   name: 'Electronic Arts Inc.',     targetAllocation: 10, reason: 'Sports IP + live services', price: '—' },
    ],
  },
  {
    id: 'gold-bundle',
    title: 'Gold Bundle',
    riskLevel: '3/10',
    description: 'A bundle of gold-related assets for a stable investment.',
    stocks: ['GLD', 'IAU', 'GOLD', 'NEM', 'AEM', 'GDX'],
    imageUrl: '/images/bundles/gold-bundle.png',
    whatsInBundle:
      'A defensive sleeve combining bullion trackers with select miners for operating leverage. It seeks diversification versus equities and potential support during inflation or risk‑off periods, generally with lower drawdowns than growth‑heavy baskets. Ideal for conservative investors or as a stabilizer within a broader portfolio.',
    atAGlance: [
      'Inflation hedge and portfolio diversifier',
      'Blend of bullion ETFs and miners for beta',
      'Key risks: real rates, USD strength, mining costs',
    ],
    pastReturns: {
      ytd: '+11% (placeholder)',
      oneY: '+16% (placeholder)',
      threeY: '+28% (placeholder)',
      fiveY: '+50% (placeholder)',
      note: 'Composite of bullion proxies and select miners.'
    },
    assets: [
      { symbol: 'GLD',  name: 'SPDR Gold Shares',              targetAllocation: 40, reason: 'Liquid bullion exposure', price: '—' },
      { symbol: 'IAU',  name: 'iShares Gold Trust',            targetAllocation: 20, reason: 'Lower expense bullion ETF', price: '—' },
      { symbol: 'GOLD', name: 'Barrick Gold Corporation',      targetAllocation: 15, reason: 'Miner leverage to gold price', price: '—' },
      { symbol: 'NEM',  name: 'Newmont Corporation',           targetAllocation: 10, reason: 'Largest gold miner scale', price: '—' },
      { symbol: 'AEM',  name: 'Agnico Eagle Mines Limited',    targetAllocation: 10, reason: 'Quality assets and execution', price: '—' },
      { symbol: 'GDX',  name: 'VanEck Gold Miners ETF',        targetAllocation: 5,  reason: 'Diversified miners exposure', price: '—' },
    ],
  },
  {
    id: 'crypto-bundle',
    title: 'Crypto Bundle',
    riskLevel: '9/10',
    description: 'A bundle of cryptocurrencies for high-risk, high-reward potential.',
    stocks: ['BTC', 'ETH', 'SOL', 'AVAX', 'MATIC'],
    imageUrl: '/images/bundles/crypto-bundle.png',
    whatsInBundle:
      'A concentrated, high‑volatility allocation to core crypto assets with a growth L1 kicker. It targets asymmetric upside tied to adoption, liquidity cycles, and on‑chain activity, but can see deep drawdowns. Intended for aggressive, long‑horizon investors using a small portfolio sleeve.',
    atAGlance: [
      'High volatility, beta to global liquidity cycles',
      'Core platforms (BTC/ETH) with a growth L1 kicker',
      'Key risks: regulation, security, market structure',
    ],
    pastReturns: {
      ytd: '+35% (placeholder)',
      oneY: '+80% (placeholder)',
      threeY: '+120% (placeholder)',
      fiveY: '+300% (placeholder)',
      note: 'Illustrative and volatile; composite across components.'
    },
    assets: [
      { symbol: 'BTC',  name: 'Bitcoin',                  targetAllocation: 50, reason: 'Digital scarcity; macro alt', price: '—' },
      { symbol: 'ETH',  name: 'Ethereum',                 targetAllocation: 30, reason: 'Smart contracts and L2 growth', price: '—' },
      { symbol: 'SOL',  name: 'Solana',                   targetAllocation: 10, reason: 'High‑throughput L1 for apps', price: '—' },
      { symbol: 'AVAX', name: 'Avalanche',                targetAllocation: 5,  reason: 'Subnets and DeFi/NFT activity', price: '—' },
      { symbol: 'MATIC',name: 'Polygon',                  targetAllocation: 5,  reason: 'Scaling and consumer apps', price: '—' },
    ],
  },
];
