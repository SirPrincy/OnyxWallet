export interface CryptoAsset {
  code: string;
  name: string;
  symbol: string;
  description: string;
}

export const SUPPORTED_CRYPTO: CryptoAsset[] = [
  {
    code: 'BTC',
    name: 'Bitcoin',
    symbol: '₿',
    description: 'Le "roi". Il détient plus de 55 % de la domination du marché. C’est l\'or numérique.'
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    description: 'Indispensable pour tout ce qui est contrats intelligents (Smart Contracts) et applications décentralisées.'
  },
  {
    code: 'USDT',
    name: 'Tether',
    symbol: '₮',
    description: 'Ces jetons indexés sur le dollar sont en réalité les plus utilisés au quotidien pour les échanges et les transferts rapides.'
  },
  {
    code: 'USDC',
    name: 'USD Coin',
    symbol: '$',
    description: 'Stablecoin indexé sur le dollar, largement utilisé pour les échanges sécurisés.'
  },
  {
    code: 'SOL',
    name: 'Solana',
    symbol: 'S',
    description: 'Très populaire en 2026 pour sa rapidité et ses frais quasi nuls, elle a dépassé de nombreux anciens projets.'
  },
  {
    code: 'BNB',
    name: 'Binance Coin',
    symbol: 'BNB',
    description: 'Elle alimente tout l\'écosystème de la plus grosse plateforme d\'échange mondiale.'
  }
];
