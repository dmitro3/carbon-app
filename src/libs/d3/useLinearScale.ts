import { scaleLinear } from 'd3';
import { getAccessor } from 'libs/d3/utils';
import { D3AxisTick } from 'libs/d3/types';
import { SimulatorData } from 'libs/queries';
import { useCallback } from 'react';

interface Props {
  domain: Iterable<number>;
  range: Iterable<number>;
  pixelsPerTick?: number;
}

export type LinearScaleReturn = ReturnType<typeof useLinearScale>;

export const useLinearScale = ({ domain, range, pixelsPerTick }: Props) => {
  const scale = scaleLinear().domain(domain).range(range).nice(-1);

  const ticks: D3AxisTick[] = [];

  if (pixelsPerTick) {
    const width = scale.range()[1] - scale.range()[0];
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
    scale.ticks(numberOfTicksTarget).forEach((value) =>
      ticks.push({
        value,
        offset: scale(value),
      })
    );
  } else {
    scale.ticks().forEach((value) =>
      ticks.push({
        value,
        offset: scale(value),
      })
    );
  }

  const accessor = useCallback(
    (key: keyof SimulatorData) => getAccessor(key, scale),
    [scale]
  );

  return { scale, ticks, accessor };
};
