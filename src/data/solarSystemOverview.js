import { localize } from '../i18n/localize';

export const SOLAR_SYSTEM_OVERVIEW = {
  title: {
    en: 'Solar System',
    es: 'Sistema solar'
  },
  subtitle: {
    en: "The Sun's planetary system",
    es: 'Sistema planetario del Sol'
  },
  summary: {
    en: 'The solar system formed approximately 4.6 billion years ago. It is dominated by the Sun and contains eight planets, dwarf planets, moons, asteroids and comets orbiting under its gravity.',
    es: 'El sistema solar se formó hace aproximadamente 4.600 millones de años. Está dominado por el Sol y contiene ocho planetas, planetas enanos, lunas, asteroides y cometas que orbitan bajo la influencia de su gravedad.'
  },
  facts: [
    [
      { en: 'Age', es: 'Edad' },
      { en: '4.6 billion years', es: '4.600 millones de años' }
    ],
    [
      { en: 'Central star', es: 'Estrella central' },
      { en: 'The Sun holds 99.86% of the mass of the system', es: 'El Sol contiene el 99,86% de la masa del sistema' }
    ],
    [
      { en: 'Planets', es: 'Planetas' },
      { en: '8 recognised planets', es: '8 planetas reconocidos' }
    ],
    [
      { en: 'Outer region', es: 'Región exterior' },
      { en: 'Kuiper Belt and Oort Cloud', es: 'Cinturón de Kuiper y nube de Oort' }
    ],
    [
      { en: 'Scale', es: 'Escala' },
      { en: 'Sunlight takes about 5.5 hours to reach Neptune', es: 'La luz solar tarda unas 5,5 horas en llegar a Neptuno' }
    ],
    [
      { en: 'Exploration', es: 'Exploración' },
      { en: 'More than six decades of robotic and crewed missions', es: 'Más de seis décadas de misiones robóticas y tripuladas' }
    ]
  ],
  factsLong: [
    {
      en: 'The inner planets are rocky and compact; the outer ones are gas or ice giants with ring systems and many moons.',
      es: 'Los planetas interiores son rocosos y compactos; los exteriores son gigantes gaseosos o helados con sistemas de anillos y muchas lunas.'
    },
    {
      en: 'The heliosphere is the enormous bubble of particles and magnetic field created by the solar wind around the planetary system.',
      es: 'La heliosfera es la enorme burbuja de partículas y campo magnético creada por el viento solar alrededor del sistema planetario.'
    },
    {
      en: 'The current architecture of the solar system preserves clues about the formation of Earth and about the evolution of other planetary systems.',
      es: 'La arquitectura actual del sistema solar conserva pistas sobre la formación de la Tierra y sobre la evolución de otros sistemas planetarios.'
    }
  ],
  photos: [
    {
      src: 'https://images-assets.nasa.gov/image/PIA03153/PIA03153~large.jpg',
      caption: {
        en: 'The planets of the solar system in a NASA composition',
        es: 'Los planetas del sistema solar en una composición de NASA'
      }
    },
    {
      src: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001861/GSFC_20171208_Archive_e001861~large.jpg',
      caption: {
        en: 'The Sun, source of energy and gravity for the system',
        es: 'El Sol, fuente de energía y gravedad del sistema'
      }
    },
    {
      src: 'https://images-assets.nasa.gov/image/PIA17046/PIA17046~large.jpg',
      caption: {
        en: 'Earth seen from deep space',
        es: 'La Tierra observada desde el espacio profundo'
      }
    }
  ]
};

export const getSolarSystemOverview = (lang = 'en') => localize(SOLAR_SYSTEM_OVERVIEW, lang);
