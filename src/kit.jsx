import React from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Mic } from 'lucide-react';
import SciFiButton from './components/ui/SciFiButton';
import SciFiTag from './components/ui/SciFiTag';
import SciFiLoader from './components/ui/SciFiLoader';
import SciFiInput from './components/ui/SciFiInput';
import SciFiSearch from './components/ui/SciFiSearch';
import './kit.css';

const BUTTON_VARIANTS = ['primary', 'secondary', 'single-stroke', 'transparent'];
const STATES = ['default', 'hover', 'pressed', 'disabled'];
const TAG_TYPES = ['primary', 'neutral', 'error', 'warning', 'information', 'success'];
const TAG_SHAPES = ['cut-edge', 'rectangle', 'rounded'];

function ButtonRows() {
  return BUTTON_VARIANTS.map((variant) => (
    <React.Fragment key={variant}>
      {['md', 'lg'].map((size) => (
        <div className="kit-row" key={size}>
          <div className="kit-row__label">
            <span>{variant}</span>
            <span className="kit-row__size">{size}</span>
          </div>
          {STATES.map((state) => (
            <div key={state} className={`kit-cell kit-cell--${state}`}>
              <SciFiButton
                variant={variant}
                size={size}
                disabled={state === 'disabled'}
                showArrow={false}
              >
                Button
              </SciFiButton>
            </div>
          ))}
        </div>
      ))}
    </React.Fragment>
  ));
}

function App() {
  return (
    <main className="kit">
      <header className="kit__head">
        <h1>Sci-fi UI Kit (Free)</h1>
        <p>
          Componentes portados desde Figma · <code>PEse2mXAsE9al2kYhm4hzF</code>
        </p>
      </header>

      <section>
        <h2>Button</h2>
        <ButtonRows />
        <div className="kit-inline">
          {BUTTON_VARIANTS.map((v) => (
            <SciFiButton key={v} variant={v}>
              Button
            </SciFiButton>
          ))}
        </div>
        <div className="kit-inline">
          {BUTTON_VARIANTS.map((v) => (
            <SciFiButton key={v} variant={v} size="lg">
              Celebrate Certification
            </SciFiButton>
          ))}
        </div>
      </section>

      <section>
        <h2>Tag · tipos (on dark)</h2>
        {TAG_SHAPES.map((shape) => (
          <div className="kit-inline" key={shape}>
            <span className="kit-row__size" style={{ width: 70 }}>{shape}</span>
            {TAG_TYPES.map((t) => (
              <SciFiTag key={t} type={t} shape={shape}>
                {t}
              </SciFiTag>
            ))}
          </div>
        ))}
        <h2 style={{ marginTop: 24 }}>Tag · stroke / tamaños / on light</h2>
        <div className="kit-inline">
          {TAG_TYPES.map((t) => (
            <SciFiTag key={t} type={t} stroke>
              {t}
            </SciFiTag>
          ))}
        </div>
        <div className="kit-inline">
          {TAG_TYPES.map((t) => (
            <SciFiTag key={t} type={t} size="lg">
              {t}
            </SciFiTag>
          ))}
        </div>
        <div className="kit-inline kit-inline--light">
          {TAG_TYPES.map((t) => (
            <SciFiTag key={t} type={t} onDark={false}>
              {t}
            </SciFiTag>
          ))}
        </div>
      </section>

      <section>
        <h2>Loader</h2>
        <div className="kit-inline">
          {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((s) => (
            <SciFiLoader key={s} size={s} />
          ))}
          <SciFiLoader size="md" label="Cargando telemetría…" />
        </div>
      </section>

      <section>
        <h2>Text field</h2>
        <div className="kit-inline kit-inline--light">
          <SciFiInput label="Title" required placeholder="Text here…" hint="Help text" />
          <SciFiInput label="Title" required state="focus" placeholder="Text here…" hint="Help text" />
          <SciFiInput label="Title" required error="Error message" placeholder="Text here…" />
          <SciFiInput label="Title" required state="disable" placeholder="Text here…" hint="Help text" />
        </div>
      </section>

      <section>
        <h2>Search bar</h2>
        <div className="kit-inline kit-inline--light">
          <SciFiSearch
            icon={<Search size={16} />}
            micIcon={<Mic size={16} />}
            onSearch={() => {}}
          />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
