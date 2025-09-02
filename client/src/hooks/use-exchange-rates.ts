import { useQuery } from "@tanstack/react-query";

interface ExchangeRateData {
  eth_usd: number;
}

interface ExchangeRateResponse {
  success: boolean;
  data?: ExchangeRateData;
  error?: string;
}

export function useExchangeRates() {
  return useQuery<ExchangeRateResponse>({
    queryKey: ['/api/exchange-rates'],
    staleTime: 15 * 1000, // 15 seconds - matches server update frequency
    gcTime: 2 * 60 * 1000, // 2 minutes cache time
    refetchInterval: 18 * 1000, // Refetch every 18 seconds to match server updates
    refetchOnWindowFocus: true, // Fetch fresh price when user returns
    retry: 2,
  });
}

export function getEthUsdRate(exchangeData?: ExchangeRateResponse): number {
  if (exchangeData?.success && exchangeData.data?.eth_usd) {
    return exchangeData.data.eth_usd;
  }
  // Fallback to reasonable current price if API fails
  return 3400;
}