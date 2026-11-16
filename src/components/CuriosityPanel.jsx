import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Image, RotateCw, X } from 'lucide-react';
import { getCuriosities } from '../data/curiositiesData';
import ArtifactModel3D from './ArtifactModel3D';
import SciFiButton from './ui/SciFiButton';
import JamesWebbModel3D from './JamesWebbModel3D';
import { getAssetPath } from '../utils/assets';
import SolarSystemModel3D from './SolarSystemModel3D';
import PlanetModel3D from './PlanetModel3D';
import { getSolarSystemOverview } from '../data/solarSystemOverview';
import { useI18n } from '../i18n';
import { pick } from '../i18n/localize';

const CELESTIAL_PHOTOS = {
  sun: [
    { src: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~large.jpg', caption: { en: 'The Sun observed by NASA missions', es: 'El Sol observado por misiones de la NASA' } },
    { src: 'https://images-assets.nasa.gov/image/PIA26681/PIA26681~large.jpg', caption: { en: 'The Sun observed by NASA\'s Solar Dynamics Observatory', es: 'El Sol observado por el Solar Dynamics Observatory de la NASA' } }
  ],
  mercury: [
    { src: 'https://images-assets.nasa.gov/image/PIA15162/PIA15162~large.jpg', caption: { en: 'Mercury mapped by MESSENGER', es: 'Mercurio cartografiado por MESSENGER' } }
  ],
  venus: [
    { src: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~large.jpg', caption: { en: 'Radar view of Venus from Magellan', es: 'Vista de radar de Venus captada por Magellan' } }
  ],
  earth: [
    { src: 'https://images-assets.nasa.gov/image/PIA18033/PIA18033~large.jpg', caption: { en: 'Earth, our home planet', es: 'La Tierra, nuestro planeta hogar' } }
  ],
  moon: [
    { src: 'https://images-assets.nasa.gov/image/as11-40-5875/as11-40-5875~large.jpg', caption: { en: 'The lunar surface photographed during Apollo 11', es: 'La superficie lunar fotografiada durante el Apolo 11' } }
  ],
  mars: [
    { src: 'https://images-assets.nasa.gov/image/PIA00407/PIA00407~large.jpg', caption: { en: 'Mars photographed by Viking', es: 'Marte fotografiado por Viking' } }
  ],
  jupiter: [
    { src: 'https://images-assets.nasa.gov/image/PIA04866/PIA04866~large.jpg', caption: { en: 'Jupiter and its turbulent atmosphere', es: 'Júpiter y su atmósfera turbulenta' } }
  ],
  saturn: [
    { src: 'https://images-assets.nasa.gov/image/PIA06594/PIA06594~thumb.jpg', caption: { en: 'Splendid Saturn photographed by Cassini', es: 'Saturno fotografiado por Cassini' } },
    { src: 'https://images-assets.nasa.gov/image/PIA05983/PIA05983~thumb.jpg', caption: { en: 'Saturn from far and near, photographed by Cassini', es: 'Saturno observado desde lejos por Cassini' } }
  ],
  uranus: [
    { src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2023/04/STScI-01GWQDPJTF1MY8ZGN4WBMWMACJ.png?fit=clip&h=1268&w=1268', caption: { en: 'Uranus and its rings observed by Webb\'s NIRCam', es: 'Urano y sus anillos observados por la NIRCam de Webb' } },
    { src: 'https://images-assets.nasa.gov/image/PIA01977/PIA01977~thumb.jpg', caption: { en: 'Uranus\' ring system photographed by Voyager 2', es: 'Sistema de anillos de Urano fotografiado por Voyager 2' } }
  ],
  neptune: [
    { src: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~large.jpg', caption: { en: 'Neptune photographed by Voyager 2', es: 'Neptuno fotografiado por Voyager 2' } }
  ],
  pluto: [
    { src: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~large.jpg', caption: { en: 'Pluto photographed by New Horizons', es: 'Plutón fotografiado por New Horizons' } }
  ]
};

export default function CuriosityPanel({ artifact, body, probe, telescope, onClose, onOpenSurface, onOpenHubble }) {
  const { t, lang } = useI18n();
  const curiosities = useMemo(() => getCuriosities(lang), [lang]);
  const overview = useMemo(() => getSolarSystemOverview(lang), [lang]);
  const curiosity = artifact ? curiosities[artifact.id] : null;
  const gallery = useMemo(() => curiosity?.photos || [], [curiosity]);
  const celestialGallery = useMemo(() => {
    if (!body) return [];
    if (body.id === 'saturn' || body.id === 'uranus') return CELESTIAL_PHOTOS[body.id];
    return [
      { src: getAssetPath(body.texture), caption: { en: `${body.name} surface texture`, es: `Textura de la superficie de ${body.name}` } },
      ...(CELESTIAL_PHOTOS[body.id] || [])
    ];
  }, [body]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    setActivePhoto(0);
  }, [artifact?.id, body?.id, probe?.id]);

  const photoCaption = (photo) => pick(photo.caption, lang);

  return (
    <div className="absolute inset-x-2 top-[7.5rem] bottom-24 sm:left-auto sm:right-4 sm:w-[min(560px,calc(100vw-2rem))] lg:top-16 bg-black/95 backdrop-blur-xl border border-cyan-500/40 p-3 sm:p-5 overflow-y-auto pointer-events-auto shadow-[0_0_35px_rgba(0,0,0,0.95)] text-xs sm:text-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-700 pb-3 mb-4">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">{t('curiosity.title')}</span>
          <h2 className="text-base sm:text-lg font-bold text-white truncate">{artifact?.name || probe?.name || body?.name || t('curiosity.systemOverview')}</h2>
          <p className="text-[11px] text-slate-400">{artifact?.location || probe?.type || body?.type || t('curiosity.overview')}</p>
        </div>
        <button onClick={onClose} aria-label={t('curiosity.close')} className="shrink-0 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {artifact && (
        <>
          <div className="mb-4 overflow-hidden border border-cyan-500/30 bg-slate-950">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-cyan-300"><RotateCw className="w-3.5 h-3.5" /> {t('curiosity.model3d')}</span>
              <button onClick={() => setAutoRotate((value) => !value)} className="text-[10px] text-slate-400 hover:text-white">
                {autoRotate ? t('curiosity.pauseRotation') : t('curiosity.resumeRotation')}
              </button>
            </div>
            {artifact.isProceduralWebb || artifact.id === 'jwst' ? (
              <JamesWebbModel3D autoRotate={autoRotate} />
            ) : (
              <ArtifactModel3D src={artifact.modelUrl} alt={t('curiosity.modelAlt', { name: artifact.name })} autoRotate={autoRotate} />
            )}
          </div>

          <div className="mb-4 border border-slate-800 bg-slate-950 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-amber-300"><Image className="w-3.5 h-3.5" /> {t('curiosity.gallery')}</div>
            {gallery.length > 0 && (
              <>
                <img
                  src={gallery[activePhoto].src}
                  alt={gallery[activePhoto].caption}
                  onError={(event) => { event.currentTarget.src = `/textures/${artifact.body.toLowerCase()}.jpg`; }}
                  className="h-44 w-full object-cover sm:h-52"
                />
                <p className="mt-2 text-[11px] leading-relaxed text-slate-300">{gallery[activePhoto].caption}</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {gallery.map((photo, index) => (
                    <button key={photo.src} onClick={() => setActivePhoto(index)} className={`overflow-hidden border ${activePhoto === index ? 'border-cyan-400' : 'border-slate-700'}`}>
                      <img src={photo.src} alt="" className="h-12 w-full object-cover" onError={(event) => { event.currentTarget.src = `/textures/${artifact.body.toLowerCase()}.jpg`; }} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mb-4 border border-slate-800 bg-slate-950 p-3">
            <div className="mb-2 text-[10px] uppercase tracking-wider text-emerald-300">{t('curiosity.audioArchive')}</div>
            <p className="mb-2 text-[11px] text-slate-400">{artifact.audioTitle}</p>
            <audio controls preload="metadata" className="h-9 w-full" src={getAssetPath(artifact.audioSample)} />
          </div>

          {onOpenSurface && ['Moon', 'Mars'].includes(artifact.body) && (
            <SciFiButton onClick={onOpenSurface} className="mb-4 w-full">
              {t('curiosity.enterSurfaceMap')}
            </SciFiButton>
          )}

          {onOpenHubble && (['hubble', 'jwst'].includes(artifact?.id) || ['hubble', 'jwst'].includes(probe?.id)) && (
            <SciFiButton
              onClick={() => onOpenHubble(artifact?.id === 'jwst' || probe?.id === 'jwst' ? 'jwst' : 'hubble')}
              className="mb-4 w-full"
            >
              {artifact?.id === 'jwst' || probe?.id === 'jwst'
                ? t('curiosity.operateWebb')
                : t('curiosity.operateHubble')}
            </SciFiButton>
          )}

          <p className="mb-4 border-l-2 border-cyan-500/60 pl-3 font-sans text-xs leading-relaxed text-slate-200">{curiosity?.summary || artifact.theStory}</p>
          <div className="space-y-2">
            {(curiosity?.facts || []).map((fact) => <p key={fact} className="border border-slate-800 bg-slate-950 p-3 font-sans text-xs leading-relaxed text-slate-300">{fact}</p>)}
          </div>
          <a href={artifact.officialNasaUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-1 text-cyan-400 underline">
            {t('curiosity.officialSource')} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </>
      )}

      {!artifact && !telescope && !probe && !body && (
        <>
          <div className="mb-4 overflow-hidden border border-cyan-500/40 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-cyan-300"><RotateCw className="h-3.5 w-3.5" /> {t('curiosity.systemModel3d')}</span>
              <span className="text-[10px] text-slate-500">{t('curiosity.dragToRotate')}</span>
            </div>
            <SolarSystemModel3D />
          </div>

          <p className="mb-4 border-l-2 border-cyan-500/60 pl-3 font-sans text-xs leading-relaxed text-slate-200">{overview.summary}</p>

          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {overview.facts.map(([label, value]) => (
              <div key={label} className="border border-slate-800 bg-slate-950 p-3">
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-cyan-100">{value}</span>
              </div>
            ))}
          </div>

          <div className="mb-4 border border-slate-800 bg-slate-950 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-amber-300"><Image className="h-3.5 w-3.5" /> {t('curiosity.systemPhotos')}</div>
            <img src={overview.photos[0].src} alt={overview.photos[0].caption} className="h-40 w-full object-cover sm:h-48" onError={(event) => { event.currentTarget.src = getAssetPath('/textures/stars.jpg'); }} />
            <p className="mt-2 text-[11px] leading-relaxed text-slate-300">{overview.photos[0].caption}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {overview.photos.slice(1).map((photo) => <img key={photo.src} src={photo.src} alt={photo.caption} className="h-20 w-full object-cover" onError={(event) => { event.currentTarget.src = getAssetPath('/textures/stars.jpg'); }} />)}
            </div>
          </div>

          <div className="space-y-2">
            {overview.factsLong.map((fact) => <p key={fact} className="border border-slate-800 bg-slate-950 p-3 font-sans text-xs leading-relaxed text-slate-300">{fact}</p>)}
          </div>

          <a href="https://science.nasa.gov/solar-system/" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-1 text-cyan-400 underline">{t('curiosity.officialSource')} <ExternalLink className="h-3.5 w-3.5" /></a>
        </>
      )}

      {body && (
        <>
          <div className="mb-4 overflow-hidden border border-cyan-500/40 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-cyan-300"><RotateCw className="h-3.5 w-3.5" /> Modelo 3D del astro</span>
              <button onClick={() => setAutoRotate((value) => !value)} className="text-[10px] text-slate-400 hover:text-white">
                {autoRotate ? 'Pausar giro' : 'Reanudar giro'}
              </button>
            </div>
            <PlanetModel3D body={body} autoRotate={autoRotate} />
          </div>

          <div className="mb-4 border border-slate-800 bg-slate-950 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-amber-300"><Image className="h-3.5 w-3.5" /> Fotografías reales</div>
            {celestialGallery.length > 0 && (
              <>
                <img
                  src={celestialGallery[activePhoto].src}
                  alt={photoCaption(celestialGallery[activePhoto])}
                  className="h-44 w-full object-cover sm:h-52"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getAssetPath(body.texture);
                  }}
                />
                <p className="mt-2 text-[11px] leading-relaxed text-slate-300">{photoCaption(celestialGallery[activePhoto])}</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {celestialGallery.map((photo, index) => (
                    <button key={`${photo.src}-${index}`} onClick={() => setActivePhoto(index)} className={`overflow-hidden border ${activePhoto === index ? 'border-cyan-400' : 'border-slate-700'}`}>
                      <img
                        src={photo.src}
                        alt=""
                        className="h-12 w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = getAssetPath(body.texture);
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              ['Diámetro', body.realDiameter],
              ['Temperatura', body.surfaceTemp],
              ['Período orbital', body.orbitalPeriod],
              ['Composición / tipo', body.type],
              ['Masa del sistema', body.massPercent]
            ].filter(([, value]) => value).map(([label, value]) => (
              <div key={label} className="border border-slate-800 bg-slate-950 p-3">
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-cyan-100">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {(body.funFacts || []).map((fact) => <p key={fact} className="border border-slate-800 bg-slate-950 p-3 font-sans text-xs leading-relaxed text-slate-300">{fact}</p>)}
          </div>
        </>
      )}

      {!artifact && (probe?.funFacts || body?.funFacts)?.length > 0 && (
        !body && <div className="space-y-2">{(probe?.funFacts || body?.funFacts).map((fact) => <p key={fact} className="border border-slate-800 bg-slate-950 p-3 font-sans text-xs leading-relaxed text-slate-300">{fact}</p>)}</div>
      )}
    </div>
  );
}
