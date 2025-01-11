'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

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

interface Transaction {
  cate_id: string
  chain: string
  time_at: number
  sends?: Array<{
    amount: number
    token_id: string
  }>
  receives?: Array<{
    amount: number
    token_id: string
  }>
  tx: {
    name: string
    status: number
    usd_gas_fee: number
  }
  project_id: string | null
  protocol?: Protocol
  other_addr?: string
  token_dict?: Record<string, {
    symbol: string
    decimals: number
    price: number
    name: string
    logo_url: string
  }>
}

interface DebankResponse {
  total_usd_value: number
  chain_list: ChainBalance[]
}

interface DebankTxResponse {
  history_list: Transaction[]
}

export function Dashboard() {
  const [data, setData] = useState<DebankResponse>({
    total_usd_value: 0,
    chain_list: []
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          cate_id: tx.cate_id || '',
          chain: tx.chain || '',
          time_at: tx.time_at || Date.now() / 1000,
          project_id: tx.project_id,
          protocol: tx.protocol || null,
          sends: tx.sends?.map((send: any) => ({
            amount: send.amount,
            token_id: send.token_id,
          })) || [],
          receives: tx.receives?.map((receive: any) => ({
            amount: receive.amount,
            token_id: receive.token_id,
          })) || [],
          token_dict: tx.token_dict || {},
          tx: {
            name: tx.tx?.name || 'Unknown Transaction',
            status: tx.tx?.status || 0,
            usd_gas_fee: typeof tx.tx?.usd_gas_fee === 'number' ? tx.tx.usd_gas_fee : 0
          }
        })))
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchData, 30000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
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

  if (loading) {
    return (
      <div className="space-y-8">
        <LoadingCard />
        <Card className="p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
        <LoadingCard />
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
    <div className="space-y-8">
      {/* Total Balance */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Total Balance</h2>
        <div className="text-4xl font-bold text-primary">
          ${formatUsdValue(data.total_usd_value)}
        </div>
      </Card>

      {/* Chain Balances */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Chain Balances</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.chain_list
            .filter(chain => chain.usd_value > 0) // Only show chains with balance > 0
            .map((chain) => (
              <div key={chain.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                <Image
                  src={chain.logo_url}
                  alt={chain.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                  unoptimized
                />
                <div>
                  <div className="font-medium">{chain.name}</div>
                  <div className="text-sm text-muted-foreground">
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

      {/* Recent Transactions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions
            .filter(tx => !tx.cate_id?.includes('scam')) // Filter out scam transactions
            .map((tx) => (
              <div key={tx.time_at} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {tx.protocol?.logo_url && (
                    <Image
                      src={tx.protocol.logo_url}
                      alt={tx.protocol.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {tx.protocol?.name || tx.project_id || 'Unknown Protocol'}
                      {' - '}
                      {tx.tx.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(tx.time_at * 1000, { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {tx.sends?.map((send, i) => (
                      <div key={i} className="text-red-500">
                        -{send.amount} {tx.token_dict?.[send.token_id]?.symbol || 'tokens'}
                      </div>
                    ))}
                    {tx.receives?.map((receive, i) => (
                      <div key={i} className="text-green-500">
                        +{receive.amount} {tx.token_dict?.[receive.token_id]?.symbol || 'tokens'}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gas: ${formatUsdValue(tx.tx.usd_gas_fee)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
} 