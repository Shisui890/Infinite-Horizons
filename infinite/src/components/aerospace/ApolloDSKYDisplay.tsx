/**
 * ApolloDSKYDisplay.tsx
 *
 * Interface autêntica do computador de bordo Apollo Guidance Computer (DSKY)
 * das missões lunares da NASA (Mercury / Gemini / Apollo), inspirado no simulador Re-entry.
 * Exibe mostradores digitais de VERB, NOUN, PROG e os 3 registradores de telemetria R1, R2, R3.
 */

import { useState } from 'react';

interface Props {
  program?: number; // Ex: 11 (Launch), 30 (Maneuver burn), 63 (Lunar descent)
  verb?: number; // Ex: 16 (Monitor decimal)
  noun?: number; // Ex: 44 (Apoapsis / Periapsis)
  r1Value: string | number; // Ex: +00185 (Apoapsis km)
  r2Value: string | number; // Ex: +00160 (Periapsis km)
  r3Value: string | number; // Ex: +07780 (Velocidade m/s)
  r1Label?: string;
  r2Label?: string;
  r3Label?: string;
}

export default function ApolloDSKYDisplay({
  program = 11,
  verb = 16,
  noun = 44,
  r1Value,
  r2Value,
  r3Value,
  r1Label = 'APOAPSIS (KM)',
  r2Label = 'PERIAPSIS (KM)',
  r3Label = 'VELOCIDADE (M/S)',
}: Props) {
  const [uplinkActive] = useState(true);

  return (
    <div className="dsky-chassis">
      {/* Top Banner */}
      <div className="dsky-top-bar">
        <span className="dsky-brand">NASA / MIT IL // APOLLO GUIDANCE COMPUTER</span>
        <span className="dsky-status-dot" />
      </div>

      <div className="dsky-faceplate">
        {/* Annunciator Warning Lights Panel (Esquerda) */}
        <div className="dsky-annunciators">
          <div className={`annunc-lamp ${uplinkActive ? 'active-amber' : ''}`}>
            UPLINK ACTY
          </div>
          <div className="annunc-lamp">NO ATT</div>
          <div className="annunc-lamp active-green">STBY</div>
          <div className="annunc-lamp">KEY REL</div>
          <div className="annunc-lamp active-green">OPR ERR</div>
          <div className="annunc-lamp">PRIO DISP</div>
        </div>

        {/* 7-Segment Digital Readout Displays (Direita) */}
        <div className="dsky-displays">
          <div className="dsky-header-row">
            <div className="dsky-small-display">
              <span className="dsky-label">PROG</span>
              <div className="dsky-digits">{String(program).padStart(2, '0')}</div>
            </div>

            <div className="dsky-small-display">
              <span className="dsky-label">VERB</span>
              <div className="dsky-digits">{String(verb).padStart(2, '0')}</div>
            </div>

            <div className="dsky-small-display">
              <span className="dsky-label">NOUN</span>
              <div className="dsky-digits">{String(noun).padStart(2, '0')}</div>
            </div>
          </div>

          {/* R1, R2, R3 Registers */}
          <div className="dsky-register-row">
            <span className="dsky-reg-tag">R1 [{r1Label}]</span>
            <div className="dsky-reg-val">
              {typeof r1Value === 'number'
                ? (r1Value >= 0 ? `+${r1Value.toFixed(0).padStart(5, '0')}` : `-${Math.abs(r1Value).toFixed(0).padStart(5, '0')}`)
                : r1Value}
            </div>
          </div>

          <div className="dsky-register-row">
            <span className="dsky-reg-tag">R2 [{r2Label}]</span>
            <div className="dsky-reg-val">
              {typeof r2Value === 'number'
                ? (r2Value >= 0 ? `+${r2Value.toFixed(0).padStart(5, '0')}` : `-${Math.abs(r2Value).toFixed(0).padStart(5, '0')}`)
                : r2Value}
            </div>
          </div>

          <div className="dsky-register-row">
            <span className="dsky-reg-tag">R3 [{r3Label}]</span>
            <div className="dsky-reg-val">
              {typeof r3Value === 'number'
                ? (r3Value >= 0 ? `+${r3Value.toFixed(0).padStart(5, '0')}` : `-${Math.abs(r3Value).toFixed(0).padStart(5, '0')}`)
                : r3Value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
