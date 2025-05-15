# Agentic Web3 - Solana AI Assistant

An AI-powered assistant that helps users interact with the Solana blockchain through natural language. Built with Next.js and AgentKit, this project enables seamless Solana interactions using conversational AI, supporting token transfers, Jupiter swaps, and more.

## 🚀 Features

- 🤖 **AI-Powered Solana Interactions**: Natural language interface for Solana blockchain operations
- 💰 **Token Management**: Send and receive SPL tokens
- 🔄 **Jupiter Integration**: Execute token swaps through Jupiter aggregator
- 📊 **Analytics**: Track and analyze blockchain activities
- 🔒 **Secure Wallet Management**: Solana keypair-based wallet integration
- 🛠️ **Extensible Architecture**: Custom action providers for specific use cases

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org) - React framework for production
- [AgentKit](https://github.com/coinbase/agentkit) - AI agent framework for blockchain
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana blockchain interaction
- [Jupiter SDK](https://docs.jup.ag) - Solana DEX aggregator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [LangChain](https://js.langchain.com) - LLM application framework
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI streaming and chat UI

## 🏁 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Solana CLI tools (optional, for local development)
- OpenAI API key

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/agentic_web3.git
cd agentic_web3
```

2. Install dependencies:

```sh
npm install
```

3. Set up environment variables:

```sh
cp .env.example .env.local
```

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `SOLANA_PRIVATE_KEY`: Your Solana wallet private key (base58 encoded)
- `SOLANA_RPC_URL`: (Optional) Custom RPC URL for Solana
- `NETWORK_ID`: (Optional) Solana network ID (default: "solana-devnet")
- `CDP_API_KEY_NAME`: (Optional) For CDP API access
- `CDP_API_KEY_PRIVATE_KEY`: (Optional) For CDP API access

4. Start the development server:

```sh
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## ⚙️ Configuration

### Agent Capabilities

The agent is configured with the following action providers:

- **Wallet Actions**: View balances, send transactions
- **SPL Token Actions**: Token transfers and management
- **Jupiter Actions**: Token swaps and price quotes
- **Analytics Actions**: Track and analyze blockchain activities
- **CDP API Actions**: (Optional) Additional Coinbase CDP capabilities

### Agent Customization

The agent can be configured in:

- `/app/api/agent/prepare-agentkit.ts` - Agent and wallet configuration
- `/app/api/agent/create-agent.ts` - Agent instantiation and LLM setup
- `/app/api/agent/providers/` - Custom action providers

## 📚 Available Actions

The agent can perform various Solana operations:

- View wallet balances and token holdings
- Send SOL and SPL tokens
- Execute token swaps through Jupiter
- Query blockchain data and analytics
- Interact with custom smart contracts
- Track transaction history

## 🏗️ Project Structure

```
app/
├── api/
│   └── agent/           # Agent implementation
│       ├── providers/   # Custom action providers
│       ├── prepare-agentkit.ts
│       └── create-agent.ts
├── components/          # React components
├── chat/               # Chat interface
├── hooks/              # Custom React hooks
└── types/              # TypeScript definitions
```

## 📚 Documentation

- [AgentKit Documentation](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- [Solana Documentation](https://docs.solana.com)
- [Jupiter Documentation](https://docs.jup.ag)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/coinbase/agentkit/blob/main/CONTRIBUTING.md) for details.

## 📞 Support

- Join our [Discord Community](https://discord.gg/CDP)
- Open an issue in the repository
- Check the [AgentKit Documentation](https://docs.cdp.coinbase.com/agentkit/docs/welcome)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Configuring Your Agent

You can [modify your configuration](https://github.com/coinbase/agentkit/tree/main/typescript/agentkit#usage) of the agent. By default, your agentkit configuration occurs in the `/api/agent/prepare-agentkit.ts` file, and agent instantiation occurs in the `/api/agent/create-agent.ts` file.

### 1. Select Your LLM

Modify the OpenAI model instantiation to use the model of your choice.

### 2. Select Your Wallet Provider

AgentKit requires a **Wallet Provider** to interact with blockchain networks.

### 3. Select Your Action Providers

Action Providers define what your agent can do. You can use built-in providers or create your own.

---

## Next Steps

- Explore the AgentKit README: [AgentKit Documentation](https://github.com/coinbase/agentkit)
- Learn more about available Wallet Providers & Action Providers.
- Experiment with custom Action Providers for your specific use case.

---

## Learn More

- [Learn more about CDP](https://docs.cdp.coinbase.com/)
- [Learn more about AgentKit](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- [Learn more about Next.js](https://nextjs.org/docs)
- [Learn more about Tailwind CSS](https://tailwindcss.com/docs)

---

## Contributing

Interested in contributing to AgentKit? Follow the contribution guide:

- [Contribution Guide](https://github.com/coinbase/agentkit/blob/main/CONTRIBUTING.md)
- Join the discussion on [Discord](https://discord.gg/CDP)
