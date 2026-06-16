import { useState, useEffect, useRef } from "react";

const ENDPOINTS = [
  {
    key: "cpu-intensive",
    label: "CPU Intensivo",
    description: "Bubble Sort O(n²) con 30,000 elementos",
    icon: "⚙️",
    color: "#7F77DD",
    bg: "#EEEDFE",
  },
  {
    key: "heavy-query",
    label: "Consulta BD Pesada",
    description: "JOIN masivo de 3 tablas, 80,000 filas",
    icon: "🗄️",
    color: "#0F6E56",
    bg: "#E1F5EE",
  },
  {
    key: "massive-write",
    label: "Escritura Masiva",
    description: "1,000 INSERTs secuenciales en PostgreSQL",
    icon: "✍️",
    color: "#993C1D",
    bg: "#FAECE7",
  },
];

export default function Home() {
  const [running, setRunning] = useState(false);
  const [workers, setWorkers] = useState(10);
  const [duration, setDuration] = useState(20);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ total: 0, success: 0, errors: 0 });
  const [endpointStats, setEndpointStats] = useState({
    "cpu-intensive": { calls: 0, errors: 0, avgMs: 0 },
    "heavy-query": { calls: 0, errors: 0, avgMs: 0 },
    "massive-write": { calls: 0, errors: 0, avgMs: 0 },
  });
  const [log, setLog] = useState([]);
  const [rps, setRps] = useState(0);

  const activeRef = useRef(false);
  const statsRef = useRef({ total: 0, success: 0, errors: 0 });
  const epStatsRef = useRef({
    "cpu-intensive": { calls: 0, errors: 0, totalMs: 0 },
    "heavy-query": { calls: 0, errors: 0, totalMs: 0 },
    "massive-write": { calls: 0, errors: 0, totalMs: 0 },
  });
  const logRef = useRef([]);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);

  function addLog(msg, type = "info") {
    const entry = { msg, type, t: new Date().toLocaleTimeString() };
    logRef.current = [entry, ...logRef.current].slice(0, 60);
    setLog([...logRef.current]);
  }


async function hitEndpoint(key) {
    const start = Date.now();
    try {
      const res = await fetch(`/api/${key}`);
      const ms = Date.now() - start;
      const ep = epStatsRef.current[key];
      ep.calls++;
      ep.totalMs += ms;
      if (!res.ok) ep.errors++;
      statsRef.current.total++;
      if (res.ok) statsRef.current.success++;
      else statsRef.current.errors++;
      setEndpointStats(prev => ({
        ...prev,
        [key]: {
          calls: ep.calls,
          errors: ep.errors,
          avgMs: Math.round(ep.totalMs / ep.calls),
        }
      }));
      return { ok: res.ok, ms };
    } catch {
      const ep = epStatsRef.current[key];
      ep.calls++;
      ep.errors++;
      statsRef.current.total++;
      statsRef.current.errors++;
      return { ok: false, ms: Date.now() - start };
    }
  }

  async function workerLoop(endSec) {
    const keys = ENDPOINTS.map((e) => e.key);
    while (activeRef.current && Date.now() < endSec) {
      const key = keys[Math.floor(Math.random() * keys.length)];
      const { ok, ms } = await hitEndpoint(key);
      addLog(
        `${key} → ${ok ? "200 OK" : "ERROR"} (${ms}ms)`,
        ok ? "success" : "error"
      );
    }
  }

  function startTest() {
    activeRef.current = true;
    statsRef.current = { total: 0, success: 0, errors: 0 };
    epStatsRef.current = {
      "cpu-intensive": { calls: 0, errors: 0, totalMs: 0 },
      "heavy-query": { calls: 0, errors: 0, totalMs: 0 },
      "massive-write": { calls: 0, errors: 0, totalMs: 0 },
    };
    logRef.current = [];
    elapsedRef.current = 0;
    setElapsed(0);
    setStats({ total: 0, success: 0, errors: 0 });
    setLog([]);
    setRps(0);
    setRunning(true);

    const endSec = Date.now() + duration * 1000;

    for (let i = 0; i < workers; i++) {
      workerLoop(endSec);
    }

    addLog(`Test iniciado: ${workers} workers × ${duration}s`, "info");

    timerRef.current = setInterval(() => {
      elapsedRef.current++;
      setElapsed(elapsedRef.current);
      const t = statsRef.current.total;
      setRps(elapsedRef.current > 0 ? Math.round(t / elapsedRef.current) : 0);
      setStats({ ...statsRef.current });
      const ep = epStatsRef.current;
      setEndpointStats({
        "cpu-intensive": {
          calls: ep["cpu-intensive"].calls,
          errors: ep["cpu-intensive"].errors,
          avgMs:
            ep["cpu-intensive"].calls > 0
              ? Math.round(ep["cpu-intensive"].totalMs / ep["cpu-intensive"].calls)
              : 0,
        },
        "heavy-query": {
          calls: ep["heavy-query"].calls,
          errors: ep["heavy-query"].errors,
          avgMs:
            ep["heavy-query"].calls > 0
              ? Math.round(ep["heavy-query"].totalMs / ep["heavy-query"].calls)
              : 0,
        },
        "massive-write": {
          calls: ep["massive-write"].calls,
          errors: ep["massive-write"].errors,
          avgMs:
            ep["massive-write"].calls > 0
              ? Math.round(ep["massive-write"].totalMs / ep["massive-write"].calls)
              : 0,
        },
      });

      if (elapsedRef.current >= duration) {
        stopTest(true);
      }
    }, 1000);
  }

  function stopTest(auto = false) {
    activeRef.current = false;
    clearInterval(timerRef.current);
    setRunning(false);
    addLog(
      auto ? `Test completado. ${statsRef.current.total} peticiones totales.` : "Test detenido manualmente.",
      "info"
    );
  }

  const progress = duration > 0 ? Math.min((elapsed / duration) * 100, 100) : 0;
  const successRate =
    stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem", color: "#1a1a1a" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, margin: 0 }}>
          🧪 OS Resource Stress Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#666", marginTop: 6 }}>
          Next.js · PostgreSQL · Docker · Ubuntu WSL2 — Laboratorio de Sistemas Operativos
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          background: "#f8f8f8",
          border: "1px solid #e2e2e2",
          borderRadius: 12,
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
              Workers concurrentes: <strong>{workers}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={workers}
              disabled={running}
              onChange={(e) => setWorkers(Number(e.target.value))}
              style={{ width: 160 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
              Duración: <strong>{duration}s</strong>
            </label>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={duration}
              disabled={running}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ width: 160 }}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={startTest}
              disabled={running}
              style={{
                background: running ? "#ccc" : "#534AB7",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: running ? "not-allowed" : "pointer",
              }}
            >
              ▶ Iniciar test
            </button>
            <button
              onClick={() => stopTest(false)}
              disabled={!running}
              style={{
                background: !running ? "#ccc" : "#A32D2D",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: !running ? "not-allowed" : "pointer",
              }}
            >
              ■ Detener
            </button>
          </div>
        </div>

        {running && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
              Progreso: {elapsed}s / {duration}s
            </div>
            <div style={{ background: "#ddd", borderRadius: 6, height: 8, overflow: "hidden" }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#534AB7",
                  transition: "width 0.5s",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { label: "Total peticiones", value: stats.total, color: "#534AB7" },
          { label: "Exitosas (200)", value: stats.success, color: "#0F6E56" },
          { label: "Errores", value: stats.errors, color: "#A32D2D" },
          { label: "Req / seg", value: rps, color: "#185FA5" },
          { label: "Tasa éxito", value: `${successRate}%`, color: "#639922" },
          { label: "Tiempo (s)", value: elapsed, color: "#888780" },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: 10,
              padding: "0.85rem 1rem",
            }}
          >
            <div style={{ fontSize: 11, color: "#999", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {m.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Per-endpoint stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {ENDPOINTS.map((ep) => {
          const s = endpointStats[ep.key];
          return (
            <div
              key={ep.key}
              style={{
                background: ep.bg,
                border: `1px solid ${ep.color}33`,
                borderRadius: 10,
                padding: "1rem 1.1rem",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: ep.color, marginBottom: 4 }}>
                {ep.icon} {ep.label}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{ep.description}</div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#999" }}>Llamadas</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: ep.color }}>{s.calls}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#999" }}>Errores</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#A32D2D" }}>{s.errors}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#999" }}>Prom. ms</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#185FA5" }}>{s.avgMs}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log */}
      <div
        style={{
          background: "#0f0f0f",
          borderRadius: 10,
          padding: "1rem 1.25rem",
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
          — log de peticiones —
        </div>
        {log.length === 0 && (
          <div style={{ fontSize: 13, color: "#444" }}>Esperando inicio del test...</div>
        )}
        {log.map((entry, i) => (
          <div
            key={i}
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color:
                entry.type === "error"
                  ? "#F09595"
                  : entry.type === "success"
                  ? "#5DCAA5"
                  : "#888",
              marginBottom: 2,
            }}
          >
            <span style={{ color: "#555" }}>[{entry.t}]</span> {entry.msg}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem", fontSize: 12, color: "#bbb", textAlign: "center" }}>
        Dayan Stefany Marulanda Pulido · 202477427 · Laboratorio SO — Docker + WSL2
      </div>
    </div>
  );
}
