# Agentic Web3

## Description

Agentic Web3 is a decentralized AI agent platform that provides on-chain assistant to users. The ai agent can handle everything from basic web3 tasks to complex on-chain operations, making decentralization more accessible to users of all experience levels.

## Capabilities

📊 Token Price Analysis & Market Metrics
📈 Wallet Activity Tracking & Analytics
⚠️ Risk Assessment & Fraud Detection
📰 Real-time Crypto News & Insights
📊 On-Chain Data Analysis
👛 Wallet Integration & Management
💱 DeFi Operations & Token Swaps
🪙 Token Management & Deployment

## Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser

## Installation

1. Clone the repository:

```sh
git clone <https://github.com/4undRaiser/agentic_web3>
cd agentic_web3
```

2. Install dependencies:

```sh
npm install
```

3. Set up environment variables:

```sh
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your configuration
# Required variables:
# Required
# - OPENAI_API_KEY=your openai api key
# - SOLANA_PRIVATE_KEY=your solana wallet private key
# - ALCHEMY_API_KEY=your alchemy api key
# - CRYPTOCOMPARE_API_KEY=your cryptocompare api key
# - NEWS_API_KEY=your news api key

# Optional
# NETWORK_ID=solana-mainnet
# SOLANA_RPC_URL=
# CDP_API_KEY_NAME=
# CDP_API_KEY_PRIVATE_KEY=
```

## Running the Project

1. Start the development server:

```sh
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Starting a Chat**:

   - Connect your wallet using the wallet button in the top-right corner
   - Click on launch chat in the top nav bar
   - Type your message in the input field at the bottom
   - Press enter or click the send button to send your message

2. **Managing Chats**:

   - Use the sidebar to view your chat history
   - Click on any previous chat to load it
   - Delete chats using the trash icon
   - Collapse/expand the sidebar using the toggle button

3. **Message Limits**:

   - Each user has a daily message limit (default: 20 messages)
   - The remaining message count is displayed above the input field
   - Limits reset at midnight local time

4. **Blockchain Interactions**:
   - The agent can help you with various blockchain operations
   - Ensure your wallet is initialized in the .env file for blockchain interactions
   - The agent will guide you through any required confirmations

## Project Structure

```
agentic_web3/
├── app/
│   ├── api/           # API routes and agent configuration
│   ├── chat/          # Chat interface components
│   ├── components/    # Reusable UI components
│   └── hooks/         # Custom React hooks
├── public/            # Static assets
└── ...config files
```

## Configuration

### Agent Configuration

The agent's behavior can be customized in:

- `/api/agent/prepare-agentkit.ts`: AgentKit configuration
- `/api/agent/create-agent.ts`: Agent instantiation

Key configuration options:

1. **LLM Selection**: Choose your preferred OpenAI model
2. **Wallet Provider**: Configure blockchain wallet integration
3. **Action Providers**: Define what actions the agent can perform

```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Resources

- [AgentKit Documentation](https://github.com/coinbase/agentkit)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Coinbase Developer Platform](https://docs.cdp.coinbase.com/)

## Support

- Join the [Discord community](https://discord.gg/CDP)
- Open an issue in the repository
- Check the [AgentKit documentation](https://docs.cdp.coinbase.com/agentkit/docs/welcome)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```
