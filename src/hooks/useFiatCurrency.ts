import Decimal from 'decimal.js';
import { useGetTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue } from 'utils/helpers';

export const useFiatCurrency = (token?: Token) => {
  const { fiatCurrency } = useStore();

  const { selectedFiatCurrency, availableCurrencies } = fiatCurrency;

  const tokenPriceQuery = useGetTokenPrice(token?.address);

  /** Verify that the token has a fiat value */
  const hasFiatValue = () => {
    return typeof tokenPriceQuery.data?.[selectedFiatCurrency] === 'number';
  };

  const getFiatValue = useMemo(() => {
    return (value: string, usd = false) => {
      return new Decimal(value || 0).times(
        tokenPriceQuery.data?.[
          usd ? availableCurrencies[0] : selectedFiatCurrency
        ] || 0
      );
    };
  }, [availableCurrencies, selectedFiatCurrency, tokenPriceQuery.data]);

  return {
    ...fiatCurrency,
    useGetTokenPrice,
    hasFiatValue,
    getFiatValue,
    getFiatAsString: (value: string) =>
      getFiatDisplayValue(getFiatValue(value), selectedFiatCurrency),
  };
};
