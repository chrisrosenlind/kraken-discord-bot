import WebSocket from 'ws';
import type { TickerData, TickerMessage, TickerPayload } from './types.js';

type KrakenClientProps = {
  url: string;
};

export class KrakenClient {
  private ws: WebSocket;
  private isConnected = false;
  public pairs: Map<string, TickerData> = new Map();

  constructor({ url }: KrakenClientProps) {
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.isConnected = true;
      console.log('Connected to Kraken WS');
    });

    this.ws.on('message', (msg: Buffer) => {
      const { data, channel }: TickerMessage = JSON.parse(msg.toString());
      if (data?.length && channel === 'ticker') {
        for (const item of data) {
          item.symbol.length && this.pairs.set(item.symbol, item);
        }
      }
    });

    this.ws.on('close', () => {
      this.isConnected = false;
      console.warn('WS connection closed');
    });

    this.ws.on('error', (err) => {
      console.error('WS error:', err);
    });
  }

  public addPairAndAwait(pair: string): Promise<TickerData> {
    const normalizedPair = pair.toUpperCase();

    const hasData = this.pairs.get(normalizedPair);

    if (hasData) {
      return Promise.resolve(hasData);
    }

    return new Promise((resolve) => {
      const payload: TickerPayload = {
        method: 'subscribe',
        params: { channel: 'ticker', symbol: [normalizedPair] },
      };

      const onMessage = (msg: Buffer) => {
        const { data, channel }: TickerMessage = JSON.parse(msg.toString());
        if (data?.length && channel === 'ticker') {
          for (const item of data) {
            if (item.symbol === normalizedPair) {
              this.pairs.set(item.symbol, item);
              resolve(item);
              this.ws.off('message', onMessage);
              return;
            }
          }
        }
      };

      this.ws.on('message', onMessage);
      this.ws.send(JSON.stringify(payload));
    });
  }

  public async waitUntilConnected(): Promise<void> {
    if (this.isConnected) return;
    return new Promise((resolve) => {
      this.ws.once('open', () => resolve());
    });
  }

  public getPair(pair: string): TickerData | undefined {
    return this.pairs.get(pair.toUpperCase());
  }

  public close() {
    this.ws.close();
  }
}
