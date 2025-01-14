'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { getProtocolImage } from '@/utils/protocol-images'
import Link from 'next/link'
import { Header } from '@/components/Header'

interface ChainBalance {
  id: string
  name: string
  logo_url: string
  usd_value: number
}

interface Protocol {
  id: string
  name: string
  logo_url: string
  chain: string
}

interface DecodedTx {
  from_addr: string
  id: string
  name: string
  status: number
  to_addr: string
  value: number
  eth_gas_fee?: number
  usd_gas_fee?: number
}

interface Transaction {
  cate_id: string | null
  chain: string
  id: string
  is_scam: boolean
  project_id: string | null
  time_at: number
  other_addr?: string
  sends?: Array<{
    amount: number
    token_id: string
    to_addr?: string
  }>
  receives?: Array<{
    amount: number
    token_id: string
    from_addr?: string
  }>
  tx: DecodedTx
  token_dict?: Record<string, {
    symbol: string
    name: string
    decimals: number
    logo_url: string
    price: number
    optimized_symbol?: string
    is_scam?: boolean
    is_erc721?: boolean
    inner_id?: string
    collection?: {
      name: string
    }
  }>
  token_approve?: {
    spender: string
    token_id: string
    value: number
  }
  project_dict?: Record<string, {
    logo_url: string
    name: string
  }>
  cate_dict?: CategoryDict
}

interface DebankResponse {
  total_usd_value: number
  chain_list: ChainBalance[]
}

interface DebankTxResponse {
  history_list: Transaction[]
}

interface TokenBalance {
  id: string
  chain: string
  name: string
  symbol: string
  display_symbol: string | null
  optimized_symbol: string
  decimals: number
  logo_url: string | null
  protocol_id: string
  price: number
  price_24h_change?: number
  is_verified: boolean
  is_core: boolean
  is_wallet: boolean
  time_at: number
  amount: number
  raw_amount: number
}

interface ChainBalance {
  id: string
  name: string
  logo_url: string
  usd_value: number
}

interface Protocol {
  id: string
  name: string
  logo_url: string
  chain: string
}

interface DecodedTx {
  from_addr: string
  id: string
  name: string
  status: number
  to_addr: string
  value: number
  eth_gas_fee?: number
  usd_gas_fee?: number
}

interface Transaction {
  cate_id: string | null
  chain: string
  id: string
  is_scam: boolean
  project_id: string | null
  time_at: number
  other_addr?: string
  sends?: Array<{
    amount: number
    token_id: string
    to_addr?: string
  }>
  receives?: Array<{
    amount: number
    token_id: string
    from_addr?: string
  }>
  tx: DecodedTx
  token_dict?: Record<string, {
    symbol: string
    name: string
    decimals: number
    logo_url: string
    price: number
    optimized_symbol?: string
    is_scam?: boolean
    is_erc721?: boolean
    inner_id?: string
    collection?: {
      name: string
    }
  }>
  token_approve?: {
    spender: string
    token_id: string
    value: number
  }
  project_dict?: Record<string, {
    logo_url: string
    name: string
  }>
  cate_dict?: CategoryDict
}

interface DebankResponse {
  total_usd_value: number
  chain_list: ChainBalance[]
}

interface DebankTxResponse {
  history_list: Transaction[]
}

interface TokenBalance {
  id: string
  chain: string
  name: string
  symbol: string
  display_symbol: string | null
  optimized_symbol: string
  decimals: number
  logo_url: string | null
  protocol_id: string
  price: number
  price_24h_change?: number
  is_verified: boolean
  is_core: boolean
  is_wallet: boolean
  time_at: number
  amount: number
  raw_amount: number
}

type CategoryDict = {
  [key: string]: {
    id: string;
    name: string;
  };
};

// Add new interface for the portfolio response
interface PortfolioResponse {
  data: {
    chain: string
    id: string
    name: string
    logo_url: string
    portfolio_item_list: Array<{
      name: string
      detail: {
        description?: string
        supply_token_list: Array<{
          amount: number
          chain: string
          decimals: number
          id: string
          logo_url: string | null
          name: string
          optimized_symbol: string
          price: number
          symbol: string
        }>
        reward_token_list?: Array<{
          amount: number
          chain: string
          decimals: number
          id: string
          logo_url: string
          name: string
          optimized_symbol: string
          price: number
          symbol: string
        }>
      }
      stats: {
        net_usd_value: number
      }
    }>
  }[]
}

export function Dashboard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const [data, setData] = useState<DebankResponse>({
    total_usd_value: 0,
    chain_list: []
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse['data']>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch total balance through proxy
        const balanceRes = await fetch(
          '/api/stats/debank?endpoint=user/total_balance&id=0xddc23d34ea2f6920d15995607d00def9478ded6d'
        )
        
        const balanceData = await balanceRes.json()
        
        if (balanceRes.ok && balanceData) {
          setData({
            total_usd_value: Number(balanceData.total_usd_value) || 0,
            chain_list: Array.isArray(balanceData.chain_list) 
              ? balanceData.chain_list.map((chain: any) => ({
                  id: chain.id || '',
                  name: chain.name || 'Unknown Chain',
                  logo_url: chain.logo_url || '/placeholder.png',
                  usd_value: Number(chain.usd_value) || 0
                }))
              : []
          })
        } else {
          throw new Error(balanceData.error || 'Failed to fetch balance data')
        }

        // Fetch transaction history through proxy
        const txRes = await fetch(
          '/api/stats/debank?endpoint=user/history_list&id=0xddc23d34ea2f6920d15995607d00def9478ded6d&chain_id=base&page_count=20'
        )
        
        if (!txRes.ok) {
          const errorText = await txRes.text()
          throw new Error(`Failed to fetch transaction data: ${errorText}`)
        }
        
        const txData = await txRes.json()
        
        // Validate transaction data
        if (!Array.isArray(txData?.history_list)) {
          throw new Error('Invalid transaction data format received')
        }
        
        setTransactions(txData.history_list.map((tx: any) => ({
          ...tx,
          project_dict: txData.project_dict || {},
          token_dict: txData.token_dict || {}
        })))
        
        // Fetch token list
        const tokenRes = await fetch(
          '/api/stats/debank?endpoint=user/token_list&id=0xddc23d34ea2f6920d15995607d00def9478ded6d&chain_id=base&is_all=true'
        )
        
        if (!tokenRes.ok) {
          throw new Error('Failed to fetch token data')
        }
        
        const tokenData = await tokenRes.json()
        setTokens(tokenData)
        
        // Add new portfolio fetch
        const portfolioRes = await fetch(
          '/api/stats/debank?endpoint=user/complex_protocol_list&id=0xddc23d34ea2f6920d15995607d00def9478ded6d&chain_id=base'
        )

        if (!portfolioRes.ok) {
          throw new Error('Failed to fetch portfolio data')
        }

        const portfolioData = await portfolioRes.json()
        
        if (!Array.isArray(portfolioData)) {
          throw new Error('Invalid portfolio data format')
        }

        setPortfolioData(portfolioData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const LoadingCard = () => (
    <Card className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-12 bg-gray-200 rounded w-1/2"></div>
    </Card>
  )

  const formatUsdValue = (value: number) => {
    try {
      return value.toLocaleString(undefined, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      })
    } catch (error) {
      console.error('Error formatting USD value:', error)
      return '0.00'
    }
  }

  const getTransactionName = (tx: any, cateDict?: CategoryDict) => {
    // If there's a category ID and we have the dictionary, use the mapped name
    if (tx.cate_id && cateDict && cateDict[tx.cate_id]) {
      return cateDict[tx.cate_id].name;
    }
    
    // If there's a transaction with a name, use it
    if (tx.tx?.name) {
      return tx.tx.name;
    }

    // For transactions without a name but with sends/receives
    if (tx.sends?.length > 0) {
      return "Send";
    }
    if (tx.receives?.length > 0) {
      return "Receive";
    }

    return "Unnamed Transaction";
  };

  const formatNumber = (num: number) => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.01) return '<0.01'
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(2) + 'K'
    return num.toFixed(Math.abs(num) < 1 ? 4 : 2)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="pointer-events-none fixed z-[999] h-3 w-3 rounded-full transition-transform duration-200 ease-out"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#df1f21'
          }}
        />
        <div className="pointer-events-none fixed z-[998] h-8 w-8 rounded-full border transition-transform duration-300 ease-out"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)',
            borderColor: '#df1f21'
          }}
        />

        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
          <div className="backdrop-blur-md bg-background/70 rounded-full border px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-40 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex items-center gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-20 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-24 mb-12">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="h-10 w-32 bg-gray-200 rounded mb-8 mt-2 animate-pulse" />
            
            <div className="space-y-4">
              <Card className="p-6">
                <div className="h-8 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
              </Card>

              <Card className="p-6">
                <div className="h-8 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2 p-2 border rounded-lg">
                      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-20 bg-gray-200 rounded mb-1 animate-pulse" />
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="h-8 w-24 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded mb-1 animate-pulse" />
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>

        <footer className="border-t py-12 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-8">
                <div className="h-7 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className="pointer-events-none fixed z-[999] h-3 w-3 rounded-full transition-transform duration-200 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#df1f21'
        }}
      />
      <div
        className="pointer-events-none fixed z-[998] h-8 w-8 rounded-full border transition-transform duration-300 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          borderColor: '#df1f21'
        }}
      />

      <Header />

      <main className="flex-1 pt-24 mb-12">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-8 mt-2">Stats</h1>
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-2">AUM (Assets Under Management)</h2>
              <div className="text-4xl font-bold text-primary">
                ${formatUsdValue(data.total_usd_value)}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Chain Balances</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.chain_list
                  .filter(chain => chain.usd_value > 0)
                  .sort((a, b) => b.usd_value - a.usd_value)
                  .map((chain) => (
                    <div key={chain.id} className="flex items-center space-x-2 p-2 border rounded-lg">
                      <Image
                        src={chain.logo_url}
                        alt={chain.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                        unoptimized
                      />
                      <div>
                        <div className="font-medium text-sm">{chain.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ${formatUsdValue(chain.usd_value)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {data.chain_list.filter(chain => chain.usd_value > 0).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No chain balances found
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left column - Wallet */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">Wallet</h2>
                  <div className="space-y-2 md:space-y-4">
                    {tokens
                      .sort((a, b) => (b.price * b.amount) - (a.price * a.amount))
                      .slice(0, 10)
                      .map((token) => {
                        const usdValue = token.price * token.amount
                        const priceChange = token.price_24h_change || 0
                        
                        return (
                          <div key={token.id} className="flex items-center justify-between p-2 md:p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex items-center gap-2 min-w-0">
                              <Image
                                src={
                                  token.symbol === 'mwcbBTC' 
                                    ? '/cbtc.png' 
                                    : token.logo_url 
                                      ? token.logo_url 
                                      : '/imageplace.png'
                                }
                                alt={token.name}
                                width={20}
                                height={20}
                                className="rounded-full shrink-0"
                                unoptimized
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate">{token.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatNumber(token.amount)} {token.optimized_symbol}
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-medium text-sm">${formatUsdValue(usdValue)}</div>
                              {priceChange !== 0 && (
                                <div className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center ${
                                  priceChange > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                  {priceChange > 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Right column - Assets */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">Protocol</h2>
                  <div className="space-y-4">
                    {portfolioData && portfolioData.length > 0 ? (
                      portfolioData.map((protocol) => (
                        <div key={protocol.id} className="space-y-3">
                          {/* Protocol Header */}
                          <div className="flex items-center gap-2 p-2">
                            <Image
                              src={protocol.logo_url}
                              alt={protocol.name}
                              width={20}
                              height={20}
                              className="rounded-full shrink-0"
                              unoptimized
                            />
                            <span className="font-medium text-sm md:text-base">{protocol.name}</span>
                            <span className="ml-auto text-sm">
                              ${formatUsdValue(protocol.portfolio_item_list.reduce(
                                (sum, item) => sum + item.stats.net_usd_value, 0
                              ))}
                            </span>
                          </div>

                          {/* Protocol Positions */}
                          {protocol.portfolio_item_list.map((item) => (
                            <div key={`${protocol.id}-${item.name}`} className="border rounded-lg p-3 md:p-4">
                              <div className="inline-block bg-gray-700 text-xs md:text-sm px-2 py-0.5 rounded mb-3">
                                {item.name}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-sm">
                                {/* Pool Column */}
                                <div>
                                  <div className="text-xs text-muted-foreground">Pool</div>
                                  <div className="font-medium truncate">
                                    {item.detail.supply_token_list.map(token => token.optimized_symbol).join('+')}
                                  </div>
                                </div>

                                {/* Balance Column */}
                                <div>
                                  <div className="text-xs text-muted-foreground">Balance</div>
                                  <div className="font-medium">
                                    {item.detail.supply_token_list.map((token, i) => (
                                      <div key={i} className="truncate">
                                        {formatNumber(token.amount)} {token.optimized_symbol}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Rewards/Value Column */}
                                {item.detail.reward_token_list && item.detail.reward_token_list.length > 0 ? (
                                  <div className="col-span-2 md:col-span-1">
                                    <div className="text-xs text-muted-foreground">Rewards</div>
                                    <div className="font-medium">
                                      {item.detail.reward_token_list.map((token, i) => (
                                        <div key={i} className="flex items-center justify-between md:block">
                                          <span className="truncate">
                                            {formatNumber(token.amount)} {token.optimized_symbol}
                                          </span>
                                          <span className="text-xs text-muted-foreground ml-1">
                                            (${formatUsdValue(token.amount * token.price)})
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="col-span-2 md:col-span-1">
                                    <div className="text-xs text-muted-foreground">USD Value</div>
                                    <div className="font-medium">
                                      ${formatUsdValue(item.stats.net_usd_value)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground text-sm">
                        {loading ? "Loading..." : error || "No portfolio data available"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Recent Transactions</h2>
              <div className="space-y-2 md:space-y-4">
                {transactions
                  .filter(tx => {
                    const tokenId = tx.token_approve?.token_id;
                    const tokenDict = tx.token_dict ?? {};
                    return !tx.is_scam && tokenId !== undefined ? !tokenDict[tokenId]?.is_scam : true;
                  })
                  .map((tx) => (
                    <div key={tx.id} className="flex items-start md:items-center gap-3 p-2 md:p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      {/* Left side - Icon and basic info */}
                      <div className="flex items-center gap-2 min-w-0 flex-[1.2]">
                        <Image
                          src={
                            tx.chain === 'base' && !tx.project_id
                              ? '/baseicon.png'
                              : tx.project_id && tx.project_dict && tx.project_dict[tx.project_id]
                                ? tx.project_dict[tx.project_id].logo_url
                                : tx.project_id?.includes('uniswap')
                                  ? '/uni.png'
                                  : getProtocolImage(tx.project_id) || '/avatar2.png'
                          }
                          alt={tx.project_id && tx.project_dict && tx.project_dict[tx.project_id]
                            ? tx.project_dict[tx.project_id].name
                            : tx.project_id?.replace('base_', '') || 'Unknown Protocol'}
                          width={24}
                          height={24}
                          className="rounded-full shrink-0"
                          unoptimized
                        />
                        <div className="min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-1">
                            <span className="font-medium text-sm truncate max-w-[120px]">
                              {tx.project_id && tx.project_dict && tx.project_dict[tx.project_id]
                                ? tx.project_dict[tx.project_id].name
                                : tx.project_id?.replace('base_', '') || 'Transfer'}
                            </span>
                            <span className="text-gray-600 text-sm">
                              {getTransactionName(tx, tx.cate_dict)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(tx.time_at * 1000, { addSuffix: true })}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Transaction details */}
                      <div className="text-right flex flex-col items-end justify-center gap-1 flex-[0.8] min-w-[180px]">
                        <div className="flex flex-col items-end gap-1 w-full">
                          {tx.sends?.map((send, i) => {
                            const token = tx.token_dict?.[send.token_id]
                            const amount = Number(send.amount)
                            const usdValue = token?.price ? (token.price * amount) : 0
                            return (
                              <div key={i} className="text-red-500 text-xs flex items-center justify-end gap-1 w-full">
                                {token?.logo_url && (
                                  <Image
                                    src={token.logo_url}
                                    alt={token.symbol}
                                    width={14}
                                    height={14}
                                    className="rounded-full"
                                    unoptimized
                                  />
                                )}
                                <div className="flex items-center gap-1 overflow-hidden">
                                  <span className="whitespace-nowrap">
                                    -{formatNumber(amount)}
                                  </span>
                                  <span className="truncate max-w-[80px]">
                                    {token?.optimized_symbol || token?.symbol || 'Unknown'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                                  ${formatUsdValue(usdValue)}
                                </span>
                              </div>
                            )
                          })}
                          {tx.receives?.map((receive, i) => {
                            const token = receive.token_id === 'base'
                              ? tx.token_dict?.['base']
                              : tx.token_dict?.[receive.token_id]
                            const amount = Number(receive.amount)
                            const usdValue = token?.price ? (token.price * amount) : 0
                            return (
                              <div key={i} className="text-green-500 text-xs flex items-center justify-end gap-1 w-full">
                                {(token?.logo_url || receive.token_id === 'base') && (
                                  <Image
                                    src={token?.logo_url || '/eth.png'}
                                    alt={token?.symbol || 'ETH'}
                                    width={14}
                                    height={14}
                                    className="rounded-full"
                                    unoptimized
                                  />
                                )}
                                <div className="flex items-center gap-1 overflow-hidden">
                                  <span className="whitespace-nowrap">
                                    +{formatNumber(amount)}
                                  </span>
                                  <span className="truncate max-w-[80px]">
                                    {receive.token_id === 'base' ? 'ETH' : (token?.optimized_symbol || token?.symbol || 'Unknown')}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                                  ${formatUsdValue(usdValue)}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                        {(tx.tx?.eth_gas_fee || tx.tx?.usd_gas_fee) && (
                          <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                            Gas: {tx.tx?.eth_gas_fee ? `${formatNumber(tx.tx.eth_gas_fee)} ETH` : ''} 
                            {tx.tx?.usd_gas_fee ? ` ($${formatUsdValue(tx.tx.usd_gas_fee)})` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-8">
              <Image src="/aicrostrategy.png" alt="AicroStrategy Logo" width={140} height={28} />
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} AicroStrategy
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="https://t.me/aicrostrategy_dao" className="text-muted-foreground hover:text-primary" target="_blank">
                Telegram
              </Link>
              <Link href="https://x.com/AicroStrategy" className="text-muted-foreground hover:text-primary" target="_blank">
                Twitter
              </Link>
              <Link href="https://github.com/aicrostrategy" className="text-muted-foreground hover:text-primary" target="_blank">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 