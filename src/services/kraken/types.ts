export type TickerPayload = {
  method: string;
  params: {
    channel: string;
    symbol: string[];
  };
};

export type TickerMessage = {
  channel: 'ticker';
  type: 'snapshot' | 'update';
  data: TickerData[];
};

export type TickerData = {
  symbol: string; // e.g. "BTC/USD"
  bid: number; // best bid price
  bid_qty: number; // quantity at best bid
  ask: number; // best ask price
  ask_qty: number; // quantity at best ask
  last: number; // last trade price
  volume: number; // trading volume (24h)
  vwap: number; // volume weighted avg price (24h)
  low: number; // 24h low
  high: number; // 24h high
  change: number; // absolute change vs prior 24h
  change_pct: number; // percentage change vs prior 24h
};
