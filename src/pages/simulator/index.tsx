import { Outlet } from '@tanstack/react-router';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { SimInputTokenSelection } from 'components/simulator/input/SimInputTokenSelection';
import { useSimDisclaimer } from 'components/simulator/input/useSimDisclaimer';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { simulatorInputRootRoute } from 'libs/routing/routes/sim';
import { SimulatorMobilePlaceholder } from 'components/simulator/mobile-placeholder';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { getUnixTime, subDays } from 'date-fns';

export const defaultStart = () => getUnixTime(subDays(new Date(), 364));
export const defaultEnd = () => getUnixTime(new Date());

export const SimulatorPage = () => {
  useSimDisclaimer();
  const searchState = simulatorInputRootRoute.useSearch();
  const { isError } = useGetTokenPriceHistory(searchState);
  const { aboveBreakpoint } = useBreakpoints();

  if (!aboveBreakpoint('md')) return <SimulatorMobilePlaceholder />;

  return (
    <>
      <h1 className="mb-16 px-20 text-24 font-weight-500">Simulate Strategy</h1>
      <div className="flex gap-20 px-20">
        {!isError && (
          <div className="flex w-[440px] flex-col gap-20">
            <SimInputTokenSelection
              baseToken={searchState.baseToken}
              quoteToken={searchState.quoteToken}
              noPriceHistory={isError}
            />
            <SimInputStrategyType />
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
};
