export interface Currency {
  code: string;
  symbol: string;
  label: string;
  description?: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    label: 'Dollar Américain',
    description: 'Utilisé dans environ 90 % des transactions mondiales.'
  },
  {
    code: 'EUR',
    symbol: '€',
    label: 'Euro',
    description: 'La deuxième monnaie la plus échangée au monde.'
  },
  {
    code: 'MGA',
    symbol: 'Ar',
    label: 'Ariary Malgache',
    description: 'Monnaie nationale de Madagascar.'
  },
  {
    code: 'JPY',
    symbol: '¥',
    label: 'Yen Japonais',
    description: 'Très prisé pour le "carry trade" et comme valeur refuge en Asie.'
  },
  {
    code: 'GBP',
    symbol: '£',
    label: 'Livre Sterling',
    description: 'Reste majeure grâce à la place financière de Londres.'
  },
  {
    code: 'AUD',
    symbol: 'A$',
    label: 'Dollar Australien',
    description: 'Très lié au prix des matières premières (minerais).'
  },
  {
    code: 'CAD',
    symbol: 'C$',
    label: 'Dollar Canadien',
    description: 'Souvent corrélé au prix du pétrole.'
  },
  {
    code: 'CHF',
    symbol: 'CHF',
    label: 'Franc Suisse',
    description: 'La "valeur refuge" par excellence en cas de crise.'
  },
  {
    code: 'CNY',
    symbol: '¥',
    label: 'Yuan Chinois',
    description: 'Son utilisation progresse vite, surtout pour les échanges avec l\'Asie et l\'Afrique.'
  },
  {
    code: 'HKD',
    symbol: 'HK$',
    label: 'Dollar de Hong Kong',
    description: 'Un pont essentiel entre l\'Occident et la Chine.'
  },
  {
    code: 'NZD',
    symbol: 'NZ$',
    label: 'Dollar Néo-Zélandais',
    description: 'Complète le top 10 des monnaies les plus liquides.'
  }
];
