import { max, min, scaleBand } from 'd3';
import { StrategyInput2, StrategyInputDispatch } from 'hooks/useStrategyInput';
import { D3ChartHandleLine } from 'libs/d3/charts/candlestick/D3ChartHandleLine';
import { DragablePriceRange } from 'libs/d3/charts/candlestick/DragablePriceRange';
import { XAxis } from 'libs/d3/charts/candlestick/xAxis';
import { D3YAxiRight } from 'libs/d3/primitives/D3YAxisRight';
import { useLinearScale } from 'libs/d3/useLinearScale';
import { SimulatorInputSearch } from 'libs/routing/routes/sim';
import { useCallback, useMemo } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { Candlesticks } from './Candlesticks';
import { CandlestickData, D3ChartSettings } from 'libs/d3';

interface Props {
  dms: D3ChartSettings;
  data: CandlestickData[];
  dispatch: StrategyInputDispatch;
  state: StrategyInput2;
  marketPrice?: number;
}

type GetDomainFn<T extends number | number[]> = (
  data: CandlestickData[],
  state: StrategyInput2,
  marketPrice?: number
) => T;

const yScaleDomainTolerance = 0.1;

const getDomainMin: GetDomainFn<number> = (data, state, marketPrice) => {
  let dataMin = min(data, (d) => d.low) as number;
  const values = [
    dataMin,
    Number(state.buy.min),
    Number(state.sell.min),
    Number(state.buy.max),
    Number(state.sell.max),
    marketPrice,
  ];
  return min(values, (d) => d) as number;
};

const getDomainMax: GetDomainFn<number> = (data, state, marketPrice) => {
  let dataMax = max(data, (d) => d.high) as number;
  const values = [
    dataMax,
    Number(state.buy.min),
    Number(state.sell.min),
    Number(state.buy.max),
    Number(state.sell.max),
    marketPrice,
  ];
  return max(values, (d) => d) as number;
};

const getDomain: GetDomainFn<number[]> = (data, state, marketPrice) => {
  const domainMin = getDomainMin(data, state, marketPrice);
  const domainMax = getDomainMax(data, state, marketPrice);

  const diff = domainMax - domainMin;
  const tolerance = diff * yScaleDomainTolerance;

  return [domainMin - tolerance, domainMax + tolerance];
};

export const D3ChartCandlesticks = (props: Props) => {
  const { dms, data, dispatch, state, marketPrice } = props;

  const xScale = useMemo(
    () =>
      scaleBand()
        .domain(data.map((d) => d.date.toString()))
        .range([0, dms.boundedWidth])
        .paddingInner(0.5),
    [data, dms.boundedWidth]
  );

  const y = useLinearScale({
    domain: getDomain(data, state, marketPrice),
    range: [dms.boundedHeight, 0],
  });

  // const [stateCopy, setStateCopy] = useState(state);
  // const [tmp, setTmp] = useState(false);
  //
  // useEffect(() => {
  //   if (!tmp) {
  //     // setTmp(true);
  //     return;
  //   }
  //   setTmp(false);
  //   console.log('jan jan jan');
  //   if (stateCopy.sell.max === state.sell.max) return;
  //   if (stateCopy.sell.min === state.sell.min) return;
  //   //
  //   // const domain = getDomain(data, stateCopy, marketPrice);
  //   // const scale = scaleLinear().domain(domain).range([dms.boundedHeight, 0]);
  //
  //   const invertedSellMax = y.scale
  //     .invert(Number(stateCopy.sell.max))
  //     .toString();
  //   dispatch('sellMax', invertedSellMax);
  //
  //   const invertedSellMin = y.scale
  //     .invert(Number(stateCopy.sell.min))
  //     .toString();
  //   dispatch('sellMin', invertedSellMin);
  // }, [
  //   data,
  //   dispatch,
  //   dms.boundedHeight,
  //   state.sell.max,
  //   state.sell.min,
  //   stateCopy,
  //   tmp,
  // ]);

  const handleDrag = useCallback(
    (key: keyof SimulatorInputSearch, value: number) => {
      // const domain = getDomain(data, state, marketPrice);
      // const scale = scaleLinear().domain(domain).range([dms.boundedHeight, 0]);

      // setTmp(true);
      //
      // if (key === 'sellMax') {
      //   setStateCopy((prev) => ({
      //     ...prev,
      //     sell: { ...prev.sell, max: value.toString() },
      //   }));
      // }
      //
      // if (key === 'sellMin') {
      //   setStateCopy((prev) => ({
      //     ...prev,
      //     sell: { ...prev.sell, min: value.toString() },
      //   }));
      // }

      const inverted = y.scale.invert(value).toString();
      dispatch(key, inverted);
    },
    [dispatch, y.scale]
  );

  return (
    <>
      <Candlesticks xScale={xScale} yScale={y.scale} data={data} />
      <D3YAxiRight
        ticks={y.ticks}
        dms={dms}
        formatter={(value) => prettifyNumber(value)}
      />
      <XAxis xScale={xScale} dms={dms} />

      {marketPrice && (
        <D3ChartHandleLine
          dms={dms}
          color="white"
          y={y.scale(marketPrice)}
          lineProps={{ strokeDasharray: 2 }}
          label={prettifyNumber(marketPrice, { currentCurrency: 'USD' })}
        />
      )}

      <DragablePriceRange
        type="buy"
        yScale={y.scale}
        onDrag={handleDrag}
        state={state}
        dms={dms}
      />
      <DragablePriceRange
        type="sell"
        yScale={y.scale}
        onDrag={handleDrag}
        state={state}
        dms={dms}
      />
    </>
  );
};