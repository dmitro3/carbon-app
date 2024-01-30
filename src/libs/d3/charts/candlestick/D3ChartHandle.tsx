import { drag, Selection } from 'd3';
import { D3ChartSettings } from 'libs/d3';
import { D3ChartHandleLine } from 'libs/d3/charts/candlestick/D3ChartHandleLine';
import { getSelector } from 'libs/d3/charts/candlestick/utils';
import { useEffect } from 'react';

interface Props {
  selector: string;
  dms: D3ChartSettings;
  onDrag: (y: number) => void;
  color: string;
  label?: string;
}

export const D3ChartHandle = ({ onDrag, ...props }: Props) => {
  const selection = getSelector(props.selector);

  const handleDrag = drag()
    .subject(() => {
      const line = selection.select('line');
      return {
        y: Number(line.attr('y1')),
      };
    })
    .on('drag', ({ y }) => onDrag(y));

  useEffect(() => {
    handleDrag(selection as Selection<Element, unknown, any, any>);
  });

  return <D3ChartHandleLine {...props} isDraggable />;
};