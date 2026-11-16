import React, { useMemo, useState } from 'react';
import { ExternalLink, Image, RotateCw, X } from 'lucide-react';
import { getCuriosities } from '../data/curiositiesData';
import ArtifactModel3D from './ArtifactModel3D';
import SciFiButton from './ui/SciFiButton';
import JamesWebbModel3D from './JamesWebbModel3D';
import { getAssetPath } from '../utils/assets';
import SolarSystemModel3D from './SolarSystemModel3D';
import { getSolarSystemOverview } from '../data/solarSystemOverview';
import { useI18n } from '../i18n';

export default function CuriosityPanel({ artifact, body, probe, telescope, onClose, onOpenSurface, onOpenHubble }) {
  const { t, lang } = useI18n();
  const curiosities = useMemo(() => getCuriosities(lang), [lang]);
  const overview = useMemo(() => getSolarSystemOverview(lang), [lang]);
  const curiosity = artifact ? curiosities[artifact.id] : null;
  const gallery = useMemo(() => curiosity?.photos || [], [curiosity]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="absolute inset-x-2 top-16 bottom-24 sm:left-auto sm:right-4 sm:w-[min(560px,calc(100vw-2rem))] bg-black/95 backdrop-blur-xl border border-cyan-500/40 p-3 sm:p-5 overflow-y-auto pointer-events-auto shadow-[0_0_35px_rgba(0,0,0,0.95)] text-xs sm:text-sm">
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

      {!artifact && (probe?.funFacts || body?.funFacts)?.length > 0 && (
        <div className="space-y-2">{(probe?.funFacts || body?.funFacts).map((fact) => <p key={fact} className="border border-slate-800 bg-slate-950 p-3 font-sans text-xs leading-relaxed text-slate-300">{fact}</p>)}</div>
      )}
    </div>
  );
}
