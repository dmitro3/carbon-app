import { Token } from 'libs/tokens';
import { FC, useId } from 'react';
import { cn, tokenAmount } from 'utils/helpers';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

interface Props {
  buy?: boolean;
  token: Token;
  initialBudget: string;
  withdraw: string;
  deposit: string;
  balance: string;
}

function getBudgetDistribution(
  initial: number,
  withdraw: number,
  deposit: number,
  balance: number
) {
  const total = initial + balance;
  const delta = ((deposit || withdraw) / total) * 100;
  const newAllocation = (Math.max(initial - withdraw, 0) / total) * 100;
  const newBalance = (Math.max(balance - deposit, 0) / total) * 100;
  return {
    mode: deposit ? 'deposit' : 'withdraw',
    allocationPercent: Math.round(newAllocation),
    deltaPercent: Math.round(delta),
    balancePercent: Math.round(newBalance),
  };
}

export const OverlappingBudgetDistribution: FC<Props> = (props) => {
  const allocatedId = useId();
  const walletId = useId();
  const { buy, token, initialBudget, withdraw, deposit, balance } = props;
  const dist = getBudgetDistribution(
    Number(initialBudget),
    Number(withdraw),
    Number(deposit),
    Number(balance)
  );
  const color = buy ? 'bg-buy' : 'bg-sell';
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-14 font-weight-500">{buy ? 'Buy' : 'Sell'}</h4>
      <div className="text-12 flex justify-between text-white/60">
        <label htmlFor={allocatedId}>
          Allocated:&nbsp;
          <span className="text-white">
            {tokenAmount(initialBudget, token)}
          </span>
        </label>
        <label htmlFor={walletId}>
          Wallet:&nbsp;
          <span className="text-white">{tokenAmount(balance, token)}</span>
        </label>
      </div>
      <div className="rounded-8 flex h-[24px] gap-4 overflow-hidden transition-[gap] duration-200">
        <div
          aria-valuenow={dist.allocationPercent}
          className={cn(
            color,
            'transition-[flex-grow] duration-200 aria-[valuenow="0"]:-ml-4'
          )}
          style={{ flexGrow: dist.allocationPercent }}
        ></div>
        <div
          aria-valuenow={dist.deltaPercent}
          className={cn(
            color,
            'transition-[flex-grow] duration-200 aria-[valuenow="0"]:-mx-2'
          )}
          style={{
            flexGrow: dist.deltaPercent,
            opacity: !dist.deltaPercent ? 0 : dist.mode === 'deposit' ? 1 : 0.4,
          }}
        ></div>
        <div
          aria-valuenow={dist.balancePercent}
          className={cn(
            color,
            'opacity-40 transition-[flex-grow] duration-200 aria-[valuenow="0"]:-mr-4'
          )}
          style={{ flexGrow: dist.balancePercent }}
        ></div>
      </div>
    </div>
  );
};

interface DescriptionProps {
  withdraw: string;
  deposit: string;
  token: Token;
  initialBudget: string;
  balance: string;
}
export const OverlappingBudgetDescription: FC<DescriptionProps> = (props) => {
  const token = props.token;
  const withdraw = Number(props.withdraw);
  const deposit = Number(props.deposit);
  if (deposit) {
    const balance = Number(props.balance);
    if (deposit > balance) {
      return (
        <WarningMessageWithIcon className="text-12" isError>
          You should&nbsp;
          <b className="font-weight-500">
            deposit {tokenAmount(deposit, token)}
          </b>
          &nbsp;from your wallet, but your wallet has insufficient balance.
          Consider changing token deposit amount or prices.
        </WarningMessageWithIcon>
      );
    }
    return (
      <p className="animate-scaleUp text-12 flex items-start gap-8 text-white/60">
        <span className="bg-buy/10 text-buy rounded-full p-4">
          <IconDeposit className="h-12 w-12" />
        </span>
        <span>
          You will&nbsp;
          <b className="font-weight-500">
            deposit {tokenAmount(deposit, token)}
          </b>
          &nbsp;from your wallet to the strategy.
        </span>
      </p>
    );
  }
  if (withdraw) {
    const initialBudget = Number(props.initialBudget);
    if (withdraw > initialBudget) {
      return (
        <WarningMessageWithIcon className="text-12" isError>
          You should&nbsp;
          <b className="font-weight-500">
            withdraw {tokenAmount(withdraw, token)}
          </b>
          &nbsp;from the strategy, but the strategy has insufficient funds.
          Consider changing token deposit amount or prices.
        </WarningMessageWithIcon>
      );
    }
    return (
      <p className="animate-scaleUp text-12 flex items-start gap-8 text-white/60">
        <span className="bg-sell/10 text-sell rounded-full p-4">
          <IconWithdraw className="h-12 w-12" />
        </span>
        <span>
          You will&nbsp;
          <b className="font-weight-500">
            withdraw {tokenAmount(withdraw, token)}
          </b>
          &nbsp;from the strategy to your wallet.
        </span>
      </p>
    );
  }
  return null;
};