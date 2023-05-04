import type { CFWorkerEnv } from 'functions/types';

const cmcBaseUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/';

const getCMCHeaders = (env: CFWorkerEnv) => ({
  headers: {
    'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
  },
});

const fetchCMCIdByAddress = async (env: CFWorkerEnv, address: string) => {
  const res = await fetch(
    `${cmcBaseUrl}info?address=${address}`,
    getCMCHeaders(env)
  );

  const json = await res.json<{ data: any; status: any }>();
  if (json.status.error_code !== 0) {
    throw new Error(
      json.status.error_message + ' | fetchCMCIdByAddress: ' + address
    );
  }

  return Object.keys(json.data)[0];
};

const fetchCMCPriceById = async (
  env: CFWorkerEnv,
  id: string,
  convert = 'USD'
) => {
  const res = await fetch(
    `${cmcBaseUrl}quotes/latest?id=${id}&convert=${convert}`,
    getCMCHeaders(env)
  );

  const json = await res.json<{
    data: {
      [k in string]: {
        quote: { [k in string]: { price: number; last_updated: string } };
      };
    };
    status: any;
  }>();
  if (json.status.error_code !== 0) {
    throw new Error(json.status.error_message + ' | fetchCMCPriceById: ' + id);
  }

  return json.data[id].quote;
};

export const getCMCPriceByAddress = async (
  env: CFWorkerEnv,
  address: string,
  convert: string
) => {
  const id = await fetchCMCIdByAddress(env, address);
  const res = await fetchCMCPriceById(env, id, convert);

  const prices: { [k in string]: { price: number; timestamp: number } } = {};
  Object.keys(res).forEach((c) => {
    prices[c].price = res[c].price;
    prices[c].timestamp = new Date(res[c].last_updated).getTime();
  });

  return prices;
};