import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import Decimal from 'decimal.js';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { ModalTradeRoutingRowCell } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingRowCell';
import { ForwardArrow } from 'components/common/forwardArrow';
import { FiatPriceDict } from 'utils/carbonApi';

type ModalTradeRoutingRowProps = {
  action: Action;
  source: Token;
  target: Token;
  sourceFiatPrice?: FiatPriceDict;
  targetFiatPrice?: FiatPriceDict;
  isSelected: boolean;
  handleClick: (id: string) => void;
};

export const ModalTradeRoutingRow: FC<ModalTradeRoutingRowProps> = ({
  action: { sourceAmount, targetAmount, id },
  source,
  target,
  sourceFiatPrice,
  targetFiatPrice,
  isSelected,
  handleClick,
}) => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const averagePrice = new Decimal(sourceAmount).div(targetAmount);
  const averagePriceFiat = averagePrice.times(
    sourceFiatPrice?.[selectedFiatCurrency] || 0
  );
  const sourceAmountFiat = new Decimal(sourceAmount).times(
    sourceFiatPrice?.[selectedFiatCurrency] || 0
  );
  const targetAmountFiat = new Decimal(targetAmount).times(
    targetFiatPrice?.[selectedFiatCurrency] || 0
  );

  const onCheckboxClick = () => {
    handleClick(id);
  };

  return (
    <>
      <div className={'flex items-center space-x-20'}>
        <Checkbox isChecked={isSelected} setIsChecked={onCheckboxClick} />

        <ModalTradeRoutingRowCell
          amount={sourceAmount}
          fiatAmount={sourceAmountFiat}
          logoURI={source.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </div>
      <div className={'flex items-center space-x-10'}>
        <div
          className={
            'flex h-18 w-18 items-center justify-center rounded-full bg-silver'
          }
        >
          <ForwardArrow arrowType="full" />
        </div>

        <ModalTradeRoutingRowCell
          amount={targetAmount}
          fiatAmount={targetAmountFiat}
          logoURI={target.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </div>

      <ModalTradeRoutingRowCell
        amount={averagePrice}
        fiatAmount={averagePriceFiat}
        logoURI={source.logoURI}
        selectedFiatCurrency={selectedFiatCurrency}
      />
    </>
  );
};
