import { OrderRow, useGetOrderBook } from 'libs/queries';
import { Options } from 'libs/charts';

export const useDepthChartWidget = (base?: string, quote?: string) => {
  const { data } = useGetOrderBook(base, quote);

  const getOrders = (orders?: OrderRow[]) => {
    return [...(orders || [])].splice(0, 50).map(({ rate, total }) => {
      return [+rate, +total];
    });
  };

  const getOptions = (
    bidsData?: number[][],
    asksData?: number[][]
  ): Options => {
    const left = bidsData?.[bidsData.length - 1]?.[0] || 0;
    const right = asksData?.[asksData.length - 1]?.[0] || 0;
    const xMiddle = (right + left) / 2;

    return {
      chart: {
        type: 'area',
        backgroundColor: '#000000',
        borderColor: '#000000',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: ' ',
      },
      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        plotLines: [
          {
            color: 'rgba(255, 255, 255, 0.25)',
            value: xMiddle,
            width: 1.5,
            label: {
              text: ' ',
              rotation: 90,
            },
          },
        ],
        title: {},
        tickWidth: 0,
        lineWidth: 0,
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        },
        crosshair: {
          color: 'rgba(255, 255, 255, 0.25)',
          width: 1,
          dashStyle: 'Dash',
        },
      },
      yAxis: [
        {
          lineWidth: 0,
          gridLineWidth: 0,
          title: {
            text: ' ',
          },
          tickWidth: 0,
          tickLength: 5,
          tickPosition: 'inside',
          labels: {
            x: 50,
            enabled: false,
          },
          crosshair: {
            color: 'rgba(255, 255, 255, 0.25)',
            width: 1,
            dashStyle: 'Dash',
          },
        },
        {
          opposite: true,
          linkedTo: 0,
          lineWidth: 0,
          gridLineWidth: 0,
          title: {
            text: ' ',
          },
          tickWidth: 0,
          tickLength: 5,
          tickPosition: 'inside',
          labels: {
            style: {
              color: 'rgba(255, 255, 255, 0.6)',
            },
          },
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillOpacity: 0.2,
          lineWidth: 1,
          step: 'center',
        },
        series: {
          states: {
            inactive: {
              opacity: 0.7,
            },
          },
        },
      },
      tooltip: {
        pointFormat: '{series.name} <b>{point.y}</b><br/>',
        valueDecimals: 2,
        borderRadius: 12,
        backgroundColor: '#212123',
        borderWidth: 0,
        style: {
          color: 'white',
        },
      },
      series: [
        {
          type: 'area',
          name: 'Asks',
          data: asksData,
          color: 'rgba(216, 99, 113, 0.8)',
          marker: {
            enabled: false,
          },
        },
        {
          type: 'area',
          name: 'Bids',
          data: bidsData,
          color: 'rgba(0, 181, 120, 0.8)',
          marker: {
            enabled: false,
          },
        },
      ],
    };
  };

  return {
    buyOrders: getOrders(data?.buy),
    sellOrders: getOrders(data?.sell),
    getOptions,
  };
};