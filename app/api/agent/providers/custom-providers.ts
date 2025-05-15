import { ActionProvider, Action, WalletProvider } from "@coinbase/agentkit";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fetch from "node-fetch";
import { z } from "zod";

// Initialize Solana connection with Alchemy RPC
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "YOUR-ALCHEMY-API-KEY";
const connection = new Connection(
  `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  "confirmed"
);

// Helper function to validate Solana address
function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get token balance
async function getTokenBalance(walletAddress: string) {
  try {
    if (!isValidSolanaAddress(walletAddress)) {
      throw new Error("Invalid Solana wallet address format");
    }
    const pubKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(pubKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return 0;
  }
}

interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
}

interface CoinGeckoApiResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
    usd_1h_change: number;
    usd_7d_change: number;
    usd_14d_change: number;
    usd_30d_change: number;
  };
}

// Cache for token list to avoid repeated API calls
let tokenListCache: CoinGeckoToken[] | null = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Helper function to get CoinGecko token list
async function getTokenList(): Promise<CoinGeckoToken[]> {
  const now = Date.now();
  
  if (tokenListCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return tokenListCache;
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    tokenListCache = await response.json() as CoinGeckoToken[];
    lastCacheUpdate = now;
    return tokenListCache;
  } catch (error) {
    throw new Error(`Failed to fetch token list: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to find token by ID or search term
async function findToken(searchTerm: string): Promise<CoinGeckoToken | null> {
  const tokens = await getTokenList();
  const normalizedSearch = searchTerm.toLowerCase();
  
  const exactMatch = tokens.find(token => token.id === normalizedSearch);
  if (exactMatch) return exactMatch;
  
  const symbolMatch = tokens.find(token => token.symbol.toLowerCase() === normalizedSearch);
  if (symbolMatch) return symbolMatch;
  
  const nameMatch = tokens.find(token => token.name.toLowerCase() === normalizedSearch);
  return nameMatch || null;
}

// Helper function to get token price data
async function getTokenPriceData(tokenId: string) {
  try {
    const token = await findToken(tokenId);
    if (!token) {
      throw new Error(`Token "${tokenId}" not found. Try using the token's ID (e.g., "bitcoin"), symbol (e.g., "btc"), or name (e.g., "Bitcoin").`);
    }

    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${token.id}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true&include_price_change_percentage_1h_in_currency=true&include_price_change_percentage_7d_in_currency=true&include_price_change_percentage_14d_in_currency=true&include_price_change_percentage_30d_in_currency=true`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as CoinGeckoApiResponse;
    
    if (!data[token.id]) {
      throw new Error("Token price data not found");
    }

    const priceData = data[token.id];
    
    return {
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      currentPrice: priceData.usd,
      priceChanges: {
        lastHour: priceData.usd_1h_change,
        last24Hours: priceData.usd_24h_change,
        last7Days: priceData.usd_7d_change,
        last14Days: priceData.usd_14d_change,
        last30Days: priceData.usd_30d_change
      },
      marketData: {
        volume24h: priceData.usd_24h_vol,
        marketCap: priceData.usd_market_cap
      },
      lastUpdated: new Date().toISOString(),
      tokenId: token.id
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching token data: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching token data');
  }
}

// Helper function to get recent transactions
async function getRecentTransactions(walletAddress: string, limit: number = 10) {
  try {
    if (!isValidSolanaAddress(walletAddress)) {
      throw new Error("Invalid Solana wallet address format");
    }
    const pubKey = new PublicKey(walletAddress);
    
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit });
    
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
          commitment: "confirmed"
        });

        const programIds = tx?.transaction.message.staticAccountKeys
          .filter((key: PublicKey) => !key.equals(pubKey))
          .map((key: PublicKey) => key.toString());

        let txType = "Unknown";
        if (tx?.meta?.logMessages) {
          const logs = tx.meta.logMessages.join(" ").toLowerCase();
          if (logs.includes("swap") || logs.includes("liquidity")) {
            txType = "DeFi";
          } else if (logs.includes("nft") || logs.includes("mint")) {
            txType = "NFT";
          } else if (logs.includes("token") || logs.includes("transfer")) {
            txType = "Token Transfer";
          }
        }

        return {
          signature: sig.signature,
          timestamp: sig.blockTime,
          type: txType,
          amount: tx?.meta?.postBalances?.[0] ? 
            (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / LAMPORTS_PER_SOL : 0,
          programIds,
          status: tx?.meta?.err ? "Failed" : "Success"
        };
      })
    );
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

// Add new interfaces for token risk analysis
interface TokenRiskMetrics {
  liquidityScore: number;
  holderConcentrationScore: number;
  transactionPatternScore: number;
  contractRiskScore: number;
  overallRiskScore: number;
  riskFactors: string[];
}

interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
}

interface OnChainTokenData {
  supply: number;
  decimals: number;
  mintAuthority: string | null;
  freezeAuthority: string | null;
}

// Add new interfaces for crypto news
interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  categories: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
}

interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  lastUpdated: string;
  trendingTopics: string[];
}

// Add new schemas for the tools
const tokenRiskAnalysisSchema = z.object({
  tokenAddress: z.string().describe("Solana token address to analyze for fraud/rugpull risk")
    .refine(isValidSolanaAddress, {
      message: "Invalid token address format. Please provide a valid Solana address."
    })
});

const cryptoNewsSchema = z.object({
  category: z.enum(['all', 'defi', 'nft', 'web3', 'trading']).default('all')
    .describe("Category of news to fetch (all, defi, nft, web3, or trading)"),
  limit: z.number().min(1).max(20).default(10)
    .describe("Maximum number of news articles to return (1-20)")
});

// Action schemas
const tokenPriceSchema = z.object({
  tokenId: z.string().describe("Token identifier (can be the token's ID like 'bitcoin', symbol like 'btc', or name like 'Bitcoin')")
});

const addressActivitySchema = z.object({
  walletAddress: z.string().describe("Solana wallet address to check activity for (must be a valid base58 address)"),
  timeRange: z.enum(["24h", "7d", "30d"]).default("7d").describe("Time range to check activity for (24h, 7d, or 30d)")
});

// Add retry utility function
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxRetries) break;
      
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      console.log(`Retry attempt ${attempt} of ${maxRetries}...`);
    }
  }
  
  throw lastError;
}

// Helper function to get on-chain token data
async function getOnChainTokenData(tokenAddress: string): Promise<OnChainTokenData> {
  try {
    if (!isValidSolanaAddress(tokenAddress)) {
      throw new Error("Invalid token address format");
    }

    const pubKey = new PublicKey(tokenAddress);
    const tokenInfo = await withRetry(async () => 
      connection.getParsedAccountInfo(pubKey)
    );
    
    if (!tokenInfo.value || !tokenInfo.value.data) {
      throw new Error("Token account not found");
    }

    const parsedData = (tokenInfo.value.data as any).parsed;
    if (!parsedData || !parsedData.info) {
      throw new Error("Invalid token data format");
    }

    return {
      supply: Number(parsedData.info.supply),
      decimals: parsedData.info.decimals,
      mintAuthority: parsedData.info.mintAuthority,
      freezeAuthority: parsedData.info.freezeAuthority
    };
  } catch (error) {
    console.error("Error fetching on-chain token data:", error);
    throw error;
  }
}

// Helper function to get token holders distribution
async function getTokenHoldersDistribution(tokenAddress: string): Promise<TokenHolder[]> {
  try {
    if (!isValidSolanaAddress(tokenAddress)) {
      throw new Error("Invalid token address format");
    }

    const pubKey = new PublicKey(tokenAddress);
    const tokenAccounts = await withRetry(async () => 
      connection.getTokenLargestAccounts(pubKey)
    );
    
    if (!tokenAccounts.value) {
      throw new Error("No token accounts found");
    }

    const totalSupply = tokenAccounts.value.reduce((sum, account) => sum + Number(account.amount), 0);
    
    return tokenAccounts.value.map(account => ({
      address: account.address.toString(),
      balance: Number(account.amount),
      percentage: (Number(account.amount) / totalSupply) * 100
    }));
  } catch (error) {
    console.error("Error fetching token holders:", error);
    return [];
  }
}

// Helper function to analyze holder concentration
function analyzeHolderConcentration(holders: TokenHolder[]): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 100;

  if (holders.length === 0) {
    return { score: 0, factors: ["No holder data available"] };
  }

  // Check top holder concentration
  const topHolder = holders[0];
  if (topHolder.percentage > 50) {
    score -= 30;
    factors.push(`Extreme concentration: Top holder owns ${topHolder.percentage.toFixed(2)}%`);
  } else if (topHolder.percentage > 30) {
    score -= 20;
    factors.push(`High concentration: Top holder owns ${topHolder.percentage.toFixed(2)}%`);
  }

  // Check top 10 holders concentration
  const top10Percentage = holders.slice(0, 10).reduce((sum, h) => sum + h.percentage, 0);
  if (top10Percentage > 90) {
    score -= 25;
    factors.push(`Extreme top 10 concentration: ${top10Percentage.toFixed(2)}%`);
  } else if (top10Percentage > 70) {
    score -= 15;
    factors.push(`High top 10 concentration: ${top10Percentage.toFixed(2)}%`);
  }

  return { score: Math.max(0, score), factors };
}

// Helper function to analyze transaction patterns
async function analyzeTransactionPatterns(tokenAddress: string): Promise<{ score: number; factors: string[] }> {
  try {
    const transactions = await getRecentTransactions(tokenAddress, 100);
    const factors: string[] = [];
    let score = 100;

    // Analyze transaction types
    const txTypes = transactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Check for failed transactions
    const failedTxs = transactions.filter(tx => tx.status === "Failed").length;
    if (failedTxs > transactions.length * 0.2) {
      score -= 20;
      factors.push("High rate of failed transactions");
    }

    // Check for unusual transaction patterns
    if (txTypes["Token Transfer"] > transactions.length * 0.8) {
      score -= 15;
      factors.push("Suspicious transaction pattern: High concentration of transfers");
    }

    // Check for rapid transactions
    const timeSpan = transactions.length > 1 
      ? transactions[0].timestamp! - transactions[transactions.length - 1].timestamp!
      : 0;
    if (timeSpan > 0 && transactions.length / timeSpan > 0.1) {
      score -= 10;
      factors.push("Unusual transaction frequency");
    }

    return { score: Math.max(0, score), factors };
  } catch (error) {
    console.error("Error analyzing transaction patterns:", error);
    return { score: 0, factors: ["Error analyzing transactions"] };
  }
}

// Helper function to analyze liquidity
async function analyzeLiquidity(tokenAddress: string): Promise<{ score: number; factors: string[] }> {
  try {
    const factors: string[] = [];
    let score = 100;

    const tokenData = await getOnChainTokenData(tokenAddress);
    const transactions = await getRecentTransactions(tokenAddress, 100);
    
    const totalVolume = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const avgVolume = totalVolume / (transactions.length || 1);
    
    if (avgVolume < 0.1) {
      score -= 20;
      factors.push("Very low average transaction volume");
    } else if (avgVolume < 1) {
      score -= 10;
      factors.push("Low average transaction volume");
    }

    if (transactions.length > 0) {
      const timeSpan = transactions[0].timestamp! - transactions[transactions.length - 1].timestamp!;
      const txPerDay = (transactions.length / (timeSpan / 86400)) || 0;
      
      if (txPerDay < 1) {
        score -= 15;
        factors.push("Very low transaction frequency (less than 1 tx per day)");
      } else if (txPerDay < 10) {
        score -= 5;
        factors.push("Low transaction frequency");
      }
    }

    if (tokenData.mintAuthority) {
      score -= 25;
      factors.push("Active mint authority - token supply can be increased");
    }

    if (tokenData.freezeAuthority) {
      score -= 15;
      factors.push("Active freeze authority - accounts can be frozen");
    }

    const uniqueAddresses = new Set(transactions.map(tx => tx.programIds).flat());
    if (uniqueAddresses.size < 3) {
      score -= 10;
      factors.push("Limited program interaction diversity");
    }

    return { score: Math.max(0, score), factors };
  } catch (error) {
    console.error("Error analyzing liquidity:", error);
    return { 
      score: 0, 
      factors: [`Error analyzing on-chain data: ${error instanceof Error ? error.message : 'Unknown error'}`] 
    };
  }
}

// Cache for news to avoid hitting API limits
let newsCache: {
  data: NewsResponse;
  timestamp: number;
} | null = null;
const NEWS_CACHE_DURATION = 300000; // 5 minutes in milliseconds

// Helper function to fetch crypto news
async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY;
    if (!CRYPTOCOMPARE_API_KEY) {
      throw new Error("CRYPTOCOMPARE_API_KEY not found in environment variables");
    }

    const response = await fetch(
      'https://min-api.cryptocompare.com/data/v2/news/?lang=EN',
      {
        headers: {
          'authorization': `Apikey ${CRYPTOCOMPARE_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`CryptoCompare API error: ${response.status}`);
    }

    const data = await response.json() as { Data: Array<{
      title: string;
      body: string;
      source: string;
      url: string;
      published_on: number;
      categories: string;
    }>};
    
    return data.Data.map(article => ({
      title: article.title,
      summary: article.body,
      source: article.source,
      url: article.url,
      publishedAt: new Date(article.published_on * 1000).toISOString(),
      categories: article.categories.split('|'),
      sentiment: article.categories.toLowerCase().includes('positive') ? 'positive' 
        : article.categories.toLowerCase().includes('negative') ? 'negative' 
        : 'neutral'
    }));
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    return [];
  }
}

// Helper function to fetch web3 news
async function fetchWeb3News(): Promise<NewsArticle[]> {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY) {
      throw new Error("NEWS_API_KEY not found in environment variables");
    }

    const query = encodeURIComponent('(web3 OR blockchain OR cryptocurrency OR "crypto" OR "defi" OR "nft")');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=20`,
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json() as {
      articles: Array<{
        title: string;
        description: string | null;
        content: string | null;
        url: string;
        publishedAt: string;
        source: {
          name: string;
        };
      }>;
    };
    
    return data.articles.map(article => ({
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) + '...',
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      categories: ['web3', 'blockchain'],
      sentiment: 'neutral'
    }));
  } catch (error) {
    console.error("Error fetching web3 news:", error);
    return [];
  }
}

// Helper function to analyze trending topics
function analyzeTrendingTopics(articles: NewsArticle[]): string[] {
  const wordFrequency: { [key: string]: number } = {};
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of']);
  
  articles.forEach(article => {
    const text = `${article.title} ${article.summary}`.toLowerCase();
    const words = text.split(/\W+/).filter(word => 
      word.length > 3 && !stopWords.has(word)
    );
    
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
  });

  return Object.entries(wordFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

// Helper function to get all news with caching
async function getAllNews(): Promise<NewsResponse> {
  const now = Date.now();
  
  if (newsCache && (now - newsCache.timestamp) < NEWS_CACHE_DURATION) {
    return newsCache.data;
  }

  try {
    const [cryptoNews, web3News] = await Promise.all([
      fetchCryptoNews(),
      fetchWeb3News()
    ]);

    const allArticles = [...cryptoNews, ...web3News]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const uniqueArticles = allArticles.filter((article, index, self) =>
      index === self.findIndex(a => 
        a.title.toLowerCase() === article.title.toLowerCase() ||
        a.url === article.url
      )
    );

    const trendingTopics = analyzeTrendingTopics(uniqueArticles);

    const response: NewsResponse = {
      articles: uniqueArticles,
      totalResults: uniqueArticles.length,
      lastUpdated: new Date().toISOString(),
      trendingTopics
    };

    newsCache = {
      data: response,
      timestamp: now
    };

    return response;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

// Action definitions
const actions: Action<any>[] = [
  {
    name: "get-token-price-with-sentiment",
    description: "Get detailed price data and market analysis for a token. The analysis will consider price changes across multiple timeframes (1h, 24h, 7d, 14d, 30d) and market metrics to provide insights about the token's performance.",
    schema: tokenPriceSchema,
    invoke: async (params: { tokenId: string }): Promise<string> => {
      try {
        const data = await getTokenPriceData(params.tokenId);
        return JSON.stringify(data, null, 2);
      } catch (error) {
        throw new Error(`Error analyzing token: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  },
  {
    name: "get-address-activity",
    description: "Analyze a Solana wallet address for recent activity and transactions",
    schema: addressActivitySchema,
    invoke: async (params: { walletAddress: string; timeRange?: "24h" | "7d" | "30d" }): Promise<string> => {
      try {
        if (!isValidSolanaAddress(params.walletAddress)) {
          throw new Error("Invalid Solana wallet address format");
        }

        const balance = await getTokenBalance(params.walletAddress);
        const transactions = await getRecentTransactions(params.walletAddress, 20);
        
        const now = Math.floor(Date.now() / 1000);
        const timeRanges = {
          "24h": now - 86400,
          "7d": now - 604800,
          "30d": now - 2592000
        };
        const timeRange = params.timeRange || "7d";
        const startTime = timeRanges[timeRange];
        
        const filteredTransactions = transactions.filter(tx => 
          tx.timestamp && tx.timestamp >= startTime
        );
        
        const analysis = {
          totalBalance: balance,
          transactionCount: filteredTransactions.length,
          transactionTypes: {
            defi: filteredTransactions.filter(tx => tx.type === "DeFi").length,
            nft: filteredTransactions.filter(tx => tx.type === "NFT").length,
            token: filteredTransactions.filter(tx => tx.type === "Token Transfer").length
          },
          recentActivity: filteredTransactions.slice(0, 5).map(tx => ({
            type: tx.type,
            amount: tx.amount,
            timestamp: new Date(tx.timestamp! * 1000).toISOString(),
            status: tx.status
          })),
          timeRange
        };

        return JSON.stringify(analysis, null, 2);
      } catch (error) {
        throw new Error(`Error checking address activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  },
  {
    name: "potential-rugpull-and-fraud-token-analysis",
    description: "Analyze a Solana token for potential fraud or rugpull risk by examining holder concentration, transaction patterns, and liquidity metrics",
    schema: tokenRiskAnalysisSchema,
    invoke: async (params: { tokenAddress: string }): Promise<string> => {
      try {
        // Verify token exists first
        try {
          await withRetry(async () => getOnChainTokenData(params.tokenAddress));
        } catch (error) {
          throw new Error(`Unable to fetch token data. This could be due to:
1. Invalid token address
2. Network connectivity issues
3. Token no longer exists
Please verify the token address and try again.`);
        }

        // Get all metrics with retry logic
        const holders = await getTokenHoldersDistribution(params.tokenAddress);
        const holderAnalysis = analyzeHolderConcentration(holders);
        const transactionAnalysis = await analyzeTransactionPatterns(params.tokenAddress);
        const liquidityAnalysis = await analyzeLiquidity(params.tokenAddress);

        // Calculate overall risk score (weighted average)
        const overallRiskScore = Math.round(
          (holderAnalysis.score * 0.4) + // 40% weight to holder concentration
          (transactionAnalysis.score * 0.3) + // 30% weight to transaction patterns
          (liquidityAnalysis.score * 0.3) // 30% weight to liquidity
        );

        // Combine all risk factors
        const allRiskFactors = [
          ...holderAnalysis.factors,
          ...transactionAnalysis.factors,
          ...liquidityAnalysis.factors
        ];

        // Add warning if we couldn't get all data
        if (holders.length === 0) {
          allRiskFactors.push("Warning: Could not fetch holder distribution data");
        }
        if (transactionAnalysis.score === 0) {
          allRiskFactors.push("Warning: Could not fetch transaction data");
        }

        const analysis: TokenRiskMetrics = {
          liquidityScore: liquidityAnalysis.score,
          holderConcentrationScore: holderAnalysis.score,
          transactionPatternScore: transactionAnalysis.score,
          contractRiskScore: 100,
          overallRiskScore,
          riskFactors: allRiskFactors
        };

        // Generate risk assessment message
        let riskLevel = "LOW";
        if (overallRiskScore < 40) {
          riskLevel = "EXTREMELY HIGH";
        } else if (overallRiskScore < 60) {
          riskLevel = "HIGH";
        } else if (overallRiskScore < 80) {
          riskLevel = "MEDIUM";
        }

        const response = {
          riskScore: overallRiskScore,
          riskLevel,
          detailedMetrics: analysis,
          summary: `Token Risk Analysis (${overallRiskScore}% risk score - ${riskLevel} RISK):
          ${allRiskFactors.length > 0 ? '\nRisk Factors:\n- ' + allRiskFactors.join('\n- ') : 'No significant risk factors detected'}`
        };

        return JSON.stringify(response, null, 2);
      } catch (error) {
        throw new Error(`Error analyzing token risk: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again in a few moments.`);
      }
    }
  },
  {
    name: "get-latest-crypto-news",
    description: "Get the latest cryptocurrency and web3 news, including trending topics and sentiment analysis",
    schema: cryptoNewsSchema,
    invoke: async (params: { category?: 'all' | 'defi' | 'nft' | 'web3' | 'trading', limit?: number }): Promise<string> => {
      try {
        const newsData = await getAllNews();
        
        let filteredArticles = newsData.articles;
        if (params.category && params.category !== 'all') {
          filteredArticles = newsData.articles.filter((article: NewsArticle) => 
            article.categories.some((cat: string) => 
              cat.toLowerCase().includes(params.category!.toLowerCase())
            )
          );
        }

        const limit = params.limit || 10;
        filteredArticles = filteredArticles.slice(0, limit);

        const response = {
          summary: {
            totalResults: newsData.totalResults,
            category: params.category || 'all',
            trendingTopics: newsData.trendingTopics,
            lastUpdated: newsData.lastUpdated
          },
          articles: filteredArticles.map((article: NewsArticle) => ({
            title: article.title,
            summary: article.summary,
            source: article.source,
            url: article.url,
            publishedAt: new Date(article.publishedAt).toLocaleString(),
            sentiment: article.sentiment,
            categories: article.categories
          }))
        };

        return JSON.stringify(response, null, 2);
      } catch (error) {
        throw new Error(`Error fetching crypto news: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
];

// Export the action provider
export function analyticsActionProvider(): ActionProvider<WalletProvider> {
  return {
    name: "analytics-provider",
    actionProviders: [],
    supportsNetwork: () => true,
    getActions: () => actions
  };
} 