interface CosmicLoadingFallbackProps {
  label?: string;
}

export default function CosmicLoadingFallback({ label = 'Sincronizando malha espaçotempo...' }: CosmicLoadingFallbackProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        color: '#00e5ff',
        gap: '20px',
        zIndex: 50,
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '3px solid rgba(0, 229, 255, 0.15)',
          borderTopColor: '#00e5ff',
          borderRightColor: '#a855f7',
          animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          boxShadow: '0 0 24px rgba(0, 229, 255, 0.35)',
        }}
      />
      <div
        style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '12px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(232, 234, 246, 0.85)',
          textShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
        }}
      >
        {label}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
