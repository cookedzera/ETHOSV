// Shared utility functions for vouch data formatting
// Used by both UserVouchIntel and EnhancedFarcasterProfile components

import { getEthUsdRate } from "@/hooks/use-exchange-rates";

// Format amounts from Wei to ETH - standardized across all components
export function formatVouchAmount(wei: string | number): string {
  const amount = typeof wei === 'string' ? wei : wei.toString();
  if (!amount || amount === '0') return '0.000';
  const eth = parseFloat(amount) / 1e18;
  return eth < 0.001 ? '<0.001' : eth.toFixed(3);
}

// Format vouch amounts with USD conversion - standardized across all components
export function formatVouchAmountWithUsd(amountWei: string | number, exchangeRatesData?: any): string {
  const ethAmount = formatVouchAmount(amountWei);
  const currentEthRate = getEthUsdRate(exchangeRatesData) || 3400;
  const amount = parseFloat(ethAmount.replace('<', ''));
  const usdValue = amount * currentEthRate;
  
  if (amount === 0) return '0.000 ETH ($0.00)';
  return `${ethAmount} ETH ($${usdValue.toFixed(2)})`;
}

// Calculate USD value from ETH amount - standardized across all components
export function calculateUsdValue(amountWei: string | number, exchangeRatesData?: any): number {
  const currentEthRate = getEthUsdRate(exchangeRatesData) || 3400;
  const ethAmount = formatVouchAmount(amountWei);
  const amount = parseFloat(ethAmount.replace('<', ''));
  return amount * currentEthRate;
}

// Prioritize v2 API user stats data over profile data - standardized logic
export function getVouchStats(userStats: any, profileStats: any) {
  const correctedUserStats = userStats?.success ? userStats.data : null;
  
  return {
    received: correctedUserStats?.vouch?.received || profileStats?.vouch?.received || { amountWeiTotal: "0", count: 0 },
    given: correctedUserStats?.vouch?.given || profileStats?.vouch?.given || { amountWeiTotal: "0", count: 0 }
  };
}