export const UNIT_MAP = {
  1: { symbol: '°C',  label: 'Sensor de Temperatura' },
  2: { symbol: '%',   label: 'Sensor de Umidade'     },
  3: { symbol: 'hPa', label: 'Sensor de Pressão'     },
};

export function getUnit(code) {
  return UNIT_MAP[code] ?? { symbol: '?', label: 'Sensor Desconhecido' };
}