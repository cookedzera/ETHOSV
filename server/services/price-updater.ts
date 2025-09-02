/**
 * Real-time ETH Price Update Service
 * Updates ETH/USD price every 15-20 seconds for accurate USD conversions
 */

interface PriceData {
  eth_usd: number;
  lastUpdated: number;
  source: string;
}

class PriceUpdaterService {
  private currentPrice: PriceData | null = null;
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;
  private readonly UPDATE_INTERVAL = 18000; // 18 seconds (15-20 range)

  // Multiple API sources for reliability
  private readonly apis = [
    {
      name: 'CoinGecko',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      parser: (data: any) => data.ethereum?.usd
    },
    {
      name: 'Binance',
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT',
      parser: (data: any) => parseFloat(data.price)
    },
    {
      name: 'Coinbase',
      url: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
      parser: (data: any) => parseFloat(data.data?.rates?.USD)
    }
  ];

  constructor() {
    // Initialize with first price fetch
    this.updatePrice();
  }

  /**
   * Start automatic price updates every 15-20 seconds
   */
  startUpdates(): void {
    if (this.updateInterval) {
      return; // Already running
    }

    console.log(`🔄 Starting real-time ETH price updates (every ${this.UPDATE_INTERVAL/1000}s)`);
    
    this.updateInterval = setInterval(() => {
      this.updatePrice();
    }, this.UPDATE_INTERVAL);
  }

  /**
   * Stop automatic price updates
   */
  stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('⏹️ Stopped ETH price updates');
    }
  }

  /**
   * Get current cached price or fetch if needed
   */
  getCurrentPrice(): PriceData {
    if (!this.currentPrice) {
      // Return fallback if no price cached yet
      return {
        eth_usd: 3400,
        lastUpdated: Date.now(),
        source: 'fallback'
      };
    }
    return this.currentPrice;
  }

  /**
   * Force update price immediately
   */
  async updatePrice(): Promise<void> {
    if (this.isUpdating) {
      return; // Prevent concurrent updates
    }

    this.isUpdating = true;

    try {
      for (const api of this.apis) {
        try {
          const response = await fetch(api.url, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'User-Agent': 'EthosRadar/1.0.0'
            },
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(5000)
          });

          if (response.ok) {
            const data = await response.json();
            const price = api.parser(data);
            
            if (price && price > 0 && price < 10000) { // Reasonable bounds check
              const newPrice: PriceData = {
                eth_usd: price,
                lastUpdated: Date.now(),
                source: api.name
              };

              // Only log if price changed significantly (>0.1%)
              const priceChanged = !this.currentPrice || 
                Math.abs(price - this.currentPrice.eth_usd) / this.currentPrice.eth_usd > 0.001;
              
              if (priceChanged) {
                console.log(`💰 ETH price updated: $${price} (${api.name})`);
              }

              this.currentPrice = newPrice;
              break; // Success, stop trying other APIs
            }
          }
        } catch (error) {
          // Continue to next API on error
          continue;
        }
      }
    } catch (error) {
      console.error('❌ Failed to update ETH price:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Get price update statistics
   */
  getStats() {
    return {
      currentPrice: this.currentPrice,
      isRunning: !!this.updateInterval,
      updateInterval: this.UPDATE_INTERVAL,
      isUpdating: this.isUpdating
    };
  }
}

// Export singleton instance
export const priceUpdater = new PriceUpdaterService();