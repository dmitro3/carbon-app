import { redirect, Route } from '@tanstack/react-router';
import { SimulatorProvider } from 'libs/d3';
import { rootRoute } from 'libs/routing/routes/root';
import { SimulatorPage } from 'pages/simulator';
import { SimulatorResultPage } from 'pages/simulator/result';
import { config } from 'services/web3/config';

export const simulatorRootRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/simulator',
});

interface SimulatorSearchBase {
  baseToken: string;
  quoteToken: string;
  sellBudget: string;
  sellMax: string;
  sellMin: string;
  buyMax: string;
  buyMin: string;
  buyBudget: string;
}

export interface SimulatorInputSearch extends SimulatorSearchBase {
  buyIsRange?: boolean;
  sellIsRange?: boolean;
}

export const simulatorRedirect = new Route({
  getParentRoute: () => simulatorRootRoute,
  path: '/',
  beforeLoad: () => {
    redirect({
      to: '/simulator/$simulationType',
      params: { simulationType: 'recurring' },
      throw: true,
    });
  },
  component: SimulatorPage,
});

export type SimulatorType = 'recurring' | 'overlapping';

export const simulatorInputRoute = new Route({
  getParentRoute: () => simulatorRootRoute,
  path: '$simulationType',
  component: SimulatorPage,
  parseParams: (params: Record<string, string>) => {
    return { simulationType: params.simulationType as SimulatorType };
  },
  validateSearch: (
    search: Record<string, string>
  ): Partial<SimulatorInputSearch> => {
    return {
      baseToken: search.baseToken || config.tokens.ETH,
      quoteToken: search.quoteToken || config.tokens.USDC,
      sellMax: search.sellMax || '',
      sellMin: search.sellMin || '',
      sellBudget: search.sellBudget || '',
      buyMax: search.buyMax || '',
      buyMin: search.buyMin || '',
      buyBudget: search.buyBudget || '',
      // isBuyLimit: Boolean(search.isBuyLimit),
      // isSellLimit: Boolean(search.isSellLimit),
    };
  },
});

export interface SimulatorResultSearch extends SimulatorSearchBase {
  start: string;
  end: string;
}

export const simulatorResultRoute = new Route({
  getParentRoute: () => simulatorRootRoute,
  path: 'result',
  component: () => (
    <SimulatorProvider>
      <SimulatorResultPage />
    </SimulatorProvider>
  ),
  validateSearch: (search: Record<string, string>): SimulatorResultSearch => {
    if (Number(search.start) <= 0) {
      throw new Error('Invalid start date');
    }
    if (Number(search.end) <= 0) {
      throw new Error('Invalid end date');
    }
    if (Number(search.start) >= Number(search.end)) {
      throw new Error('Invalid date range');
    }
    if (!search.baseToken.toLowerCase().startsWith('0x')) {
      throw new Error('Invalid base token');
    }
    if (search.baseToken.length !== 42) {
      throw new Error('Invalid base token');
    }
    if (!search.quoteToken.toLowerCase().startsWith('0x')) {
      throw new Error('Invalid base token');
    }
    if (search.quoteToken.length !== 42) {
      throw new Error('Invalid base token');
    }
    if (isNaN(Number(search.sellBudget))) {
      throw new Error('Invalid base budget');
    }
    if (isNaN(Number(search.buyBudget))) {
      throw new Error('Invalid quote budget');
    }
    if (isNaN(Number(search.sellMax))) {
      throw new Error('Invalid sell max');
    }
    if (isNaN(Number(search.sellMin))) {
      throw new Error('Invalid sell min');
    }
    if (isNaN(Number(search.buyMax))) {
      throw new Error('Invalid buy max');
    }
    if (isNaN(Number(search.buyMin))) {
      throw new Error('Invalid buy min');
    }

    return {
      start: search.start,
      end: search.end,
      baseToken: search.baseToken.toLowerCase(),
      quoteToken: search.quoteToken.toLowerCase(),
      sellMax: search.sellMax,
      sellMin: search.sellMin,
      sellBudget: search.sellBudget,
      buyMax: search.buyMax,
      buyMin: search.buyMin,
      buyBudget: search.buyBudget,
    };
  },
  // @ts-ignore
  errorComponent: (e) => <div>Invalid search: {e.error.message}</div>,
});