import { WalletConnect } from 'components/common/walletConnect';
import { CreateStrategyMain } from 'components/strategies/create';
import { useWeb3 } from 'libs/web3';

export const CreateStrategyPage = () => {
  const { user } = useWeb3();

  return user ? <CreateStrategyMain /> : <WalletConnect />;
};
