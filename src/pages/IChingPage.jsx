import { useMemo, useState } from "react";
import heroImage from "../../assets/generated/quantum-iching-hero.jpg";

function LineGlyph({ line, changed = false }) {
  const kind = changed && line.changing ? (line.kind === "yang" ? "yin" : "yang") : line.kind;

  return (
    <span
      className={`iching-line iching-line--${kind}${line.changing ? " is-changing" : ""}`}
      aria-label={`${line.index}: ${line.label}`}
    >
      {kind === "yin" ? (
        <>
          <span />
          <span />
        </>
      ) : (
        <span />
      )}
    </span>
  );
}

function HexagramFigure({ title, hexagram, lines, changed = false }) {
  if (!hexagram) return null;

  return (
    <article className="iching-hex-card">
      <div>
        <p className="iching-kicker">{title}</p>
        <h2>
          {hexagram.number}. {hexagram.ru}
        </h2>
        <p>{hexagram.keyword}</p>
      </div>
      <div className="iching-hex-visual" aria-hidden="true">
        {[...lines].reverse().map((line) => (
          <LineGlyph key={`${title}-${line.index}`} line={line} changed={changed} />
        ))}
      </div>
      <div className="iching-trigrams">
        <span>
          {hexagram.upper.glyph} {hexagram.upper.ru}
        </span>
        <span>
          {hexagram.lower.glyph} {hexagram.lower.ru}
        </span>
      </div>
    </article>
  );
}

function QuantumCast({ reading, isLoading }) {
  const lines = reading?.lines || [];

  return (
    <div className={`quantum-cast${isLoading ? " is-casting" : ""}`}>
      <div className="quantum-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="quantum-coin" aria-hidden="true">
        <span>Q</span>
      </div>
      <div className="cast-lines" aria-label="Гексаграмма">
        {lines.length
          ? [...lines].reverse().map((line) => <LineGlyph key={line.index} line={line} />)
          : Array.from({ length: 6 }, (_, index) => (
              <span className="iching-line iching-line--ghost" key={index}>
                <span />
              </span>
            ))}
      </div>
    </div>
  );
}

function ReadingMeta({ response }) {
  if (!response) return null;

  const signature = response.quantum?.signature
    ? `${response.quantum.signature.slice(0, 14)}...${response.quantum.signature.slice(-10)}`
    : "нет";

  return (
    <div className="iching-meta-grid">
      <div>
        <span>Источник</span>
        <strong>{response.quantum?.source || "qrandom.io"}</strong>
      </div>
      <div>
        <span>Модель</span>
        <strong>{response.model?.id || response.llm?.model || "openrouter/free"}</strong>
      </div>
      <div>
        <span>Биты</span>
        <strong>{response.reading.bits.join("")}</strong>
      </div>
      <div>
        <span>Подпись</span>
        <strong>{signature}</strong>
      </div>
    </div>
  );
}

function LineTable({ lines }) {
  if (!lines?.length) return null;

  return (
    <div className="coin-table">
      {lines.map((line) => (
        <div className="coin-row" key={line.index}>
          <span>{line.index}</span>
          <span>{line.bits.join(" ")}</span>
          <span>{line.coinValues.join("+")} = {line.value}</span>
          <strong>{line.label}</strong>
        </div>
      ))}
    </div>
  );
}

function Interpretation({ interpretation, llm }) {
  if (!interpretation) return null;

  return (
    <section className="iching-result-section">
      <div className="section__inner iching-reading-copy">
        <div className="iching-copy-head">
          <p className="iching-kicker">Трактовка</p>
          <h2>{interpretation.headline}</h2>
          <span>{llm?.status === "ok" ? "OpenRouter" : "Локальный текст"}</span>
        </div>
        <div className="iching-copy-grid">
          <article>
            <h3>Смысл</h3>
            <p>{interpretation.core}</p>
          </article>
          <article>
            <h3>Движение</h3>
            <p>{interpretation.movement}</p>
          </article>
          {interpretation.changingLines?.length ? (
            <article>
              <h3>Меняющиеся линии</h3>
              {interpretation.changingLines.map((line) => (
                <p key={`${line.line}-${line.text}`}>
                  <strong>{line.line}.</strong> {line.text}
                </p>
              ))}
            </article>
          ) : null}
          <article>
            <h3>Практика</h3>
            <p>{interpretation.practice}</p>
          </article>
        </div>
        <p className="iching-caution">{interpretation.caution}</p>
      </div>
    </section>
  );
}

export function IChingPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const movingLabel = useMemo(() => {
    const lines = response?.reading?.changingLines || [];
    if (!lines.length) return "без меняющихся линий";
    return `меняются линии ${lines.join(", ")}`;
  }, [response]);

  async function castOracle(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Не удалось получить расклад.");
      }

      setResponse(data);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="iching-page">
      <section className="iching-hero" style={{ "--iching-hero-image": `url(${heroImage})` }}>
        <div className="iching-hero__inner">
          <div className="iching-hero__copy">
            <p className="iching-kicker">Quantum I Ching</p>
            <h1>Книга перемен на квантовой случайности.</h1>
            <p className="iching-hero__lede">
              <span>18 квантовых битов приходят из qrandom.io.</span>
              <span>Линии собираются методом трех монет.</span>
              <span>Трактовку пишет OpenRouter.</span>
            </p>
            <div className="iching-source-pills" aria-label="Источники">
              <span>qrandom.io</span>
              <span>Quantis QRNG</span>
              <span>OpenRouter</span>
            </div>
          </div>

          <form className="iching-console" onSubmit={castOracle}>
            <label htmlFor="iching-question">Вопрос</label>
            <textarea
              id="iching-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Где сейчас главное напряжение?"
              rows={4}
            />
            <button className="button iching-cast-button" type="submit" disabled={isLoading}>
              {isLoading ? "Бросаю монеты" : "Получить расклад"}
            </button>
            {error ? <p className="iching-error">{error}</p> : null}
          </form>

          <QuantumCast reading={response?.reading} isLoading={isLoading} />
        </div>
      </section>

      {response ? (
        <>
          <section className="iching-result-section">
            <div className="section__inner iching-result-shell">
              <div className="iching-result-head">
                <div>
                  <p className="iching-kicker">Расклад</p>
                  <h2>
                    {response.reading.primary.number}. {response.reading.primary.ru}
                  </h2>
                </div>
                <span>{movingLabel}</span>
              </div>

              <div className="iching-hex-grid">
                <HexagramFigure
                  title="Основная"
                  hexagram={response.reading.primary}
                  lines={response.reading.lines}
                />
                <HexagramFigure
                  title="Измененная"
                  hexagram={response.reading.relating}
                  lines={response.reading.lines}
                  changed
                />
              </div>

              <ReadingMeta response={response} />
              <LineTable lines={response.reading.lines} />
            </div>
          </section>

          <Interpretation interpretation={response.interpretation} llm={response.llm} />
        </>
      ) : (
        <section className="iching-result-section">
          <div className="section__inner iching-empty-state">
            <p className="iching-kicker">Ожидание</p>
            <h2>Пока нет расклада.</h2>
            <p>Когда нажмешь кнопку, здесь появятся квантовые броски, гексаграмма и трактовка.</p>
          </div>
        </section>
      )}
    </main>
  );
}
