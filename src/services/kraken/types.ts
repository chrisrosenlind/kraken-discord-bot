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

export type InstrumentPayload = {
  method: string;
  params: {
    channel: string;
    include_tokenized_assets: boolean;
    snapshot: boolean;
  };
};

export type Asset = {
  borrowable: boolean; // flag if asset is borrowable
  collateral_value: number; // valuation as margin collateral (if applicable)
  id: string; // asset identifier
  margin_rate: number; // interest rate to borrow the asset
  precision: number; // maximum precision for asset ledger and balances
  precision_display: number; // recommended display precision
  multiplier: number; // multiplier of the tokenised asset (fixed conversion rate)
  status:
    | 'depositonly'
    | 'disabled'
    | 'enabled'
    | 'fundingtemporarilydisabled'
    | 'withdrawalonly'
    | 'workinprogress'; // status of asset
};
