export const PROTOCOL_LOGOS: Record<string, string> = {
  base_aerodrome: 'https://static.debank.com/image/project/logo_url/base_aerodrome/f02d753bc321dc8ba480f0424a686482.png',
  base_uniswapv2: 'https://static.debank.com/image/project/logo_url/uniswap2/4aa676fd3d1766899f1725c4c41d434a.png',
  morpho: 'https://static.debank.com/image/project/logo_url/morpho/d75d8d2d05653b7c7f1eda7bc27e2838.png',
  kyberswap: 'https://static.debank.com/image/project/logo_url/kyberswap/1bfad05d72c9921c8e8cde4c0e52a1e0.png',
  // Add more as needed
}

export function getProtocolImage(protocolId: string | null): string {
  if (!protocolId) return '/placeholder-protocol.png' // Add a default protocol image
  return PROTOCOL_LOGOS[protocolId] || '/placeholder-protocol.png'
} 