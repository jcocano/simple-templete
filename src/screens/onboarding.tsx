// Onboarding — first screen
function Onboarding({ onDone }) {
  const t = window.stI18n.t;
  window.stI18n.useLang();
  return (
    <div className="onboard fade-in">
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <window.BrandIcon size={32}/>
          <div style={{fontSize:13,color:'var(--fg-3)'}}>Simple Template</div>
        </div>
        <h1>{t('onboarding.title')}</h1>
        <div className="lede">{t('onboarding.lede')}</div>
        <ol>
          <li>
            <div className="step-n">1</div>
            <div>
              <div className="step-t">{t('onboarding.step1.title')}</div>
              <div className="step-d">{t('onboarding.step1.desc')}</div>
            </div>
          </li>
          <li>
            <div className="step-n">2</div>
            <div>
              <div className="step-t">{t('onboarding.step2.title')}</div>
              <div className="step-d">{t('onboarding.step2.descBefore')} <code style={{fontFamily:'var(--font-mono)',fontSize:12,background:'var(--surface-3)',padding:'1px 5px',borderRadius:3}}>{`{{nombre}}`}</code> {t('onboarding.step2.descAfter')}</div>
            </div>
          </li>
          <li>
            <div className="step-n">3</div>
            <div>
              <div className="step-t">{t('onboarding.step3.title')}</div>
              <div className="step-d">{t('onboarding.step3.desc')}</div>
            </div>
          </li>
          <li>
            <div className="step-n">4</div>
            <div>
              <div className="step-t">{t('onboarding.step4.title')}</div>
              <div className="step-d">{t('onboarding.step4.desc')}</div>
            </div>
          </li>
        </ol>
        <div className="row" style={{justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn ghost" onClick={onDone}>{t('onboarding.skip')}</button>
          <div className="row">
            <div className="chip">{t('onboarding.helpBefore')} <span className="kbd">?</span> {t('onboarding.helpAfter')}</div>
            <button className="btn primary" onClick={onDone}>{t('onboarding.start')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
