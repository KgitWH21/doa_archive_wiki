import doaLogo from '../../assets/ussf_doa_logo.png'

export default function LoadingScreen() {
  return (
    <div style={styles.root}>
      <div style={styles.pulseRing1} />
      <div style={styles.pulseRing2} />
      <div style={styles.pulseCore} />
      <div style={styles.sealWrapper}>
        <img src={doaLogo} alt="Department of Otherworldly Affairs" style={styles.seal} />
      </div>
      <p style={styles.label}>INITIALIZING SECURE CHANNEL</p>
      <p style={styles.sublabel}>STAND BY — CLASSIFICATION CHECK IN PROGRESS</p>
    </div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071325',
    zIndex: 9999,
    overflow: 'hidden',
  },
  // outermost slow pulse
  pulseRing1: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,193,85,0.1) 0%, transparent 70%)',
    animation: 'doa-pulse 3s ease-in-out infinite',
  },
  // inner faster pulse
  pulseRing2: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102,217,204,0.09) 0%, transparent 70%)',
    animation: 'doa-pulse 2s ease-in-out infinite 0.4s',
  },
  // tight hot core
  pulseCore: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,193,85,0.18) 0%, transparent 70%)',
    animation: 'doa-pulse 1.6s ease-in-out infinite 0.8s',
  },
  sealWrapper: {
    position: 'relative',
    width: 220,
    height: 220,
    borderRadius: '50%',
    overflow: 'hidden',
    animation: 'doa-seal-breathe 3s ease-in-out infinite',
    boxShadow: '0 0 24px rgba(236,193,85,0.35)',
  },
  seal: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  label: {
    marginTop: 32,
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '0.875rem',
    letterSpacing: '0.15em',
    color: '#ecc155',
    textTransform: 'uppercase',
  },
  sublabel: {
    marginTop: 8,
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    color: '#4e4636',
    textTransform: 'uppercase',
  },
}
