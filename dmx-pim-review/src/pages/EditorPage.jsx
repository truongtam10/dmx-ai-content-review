import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { parsePimData, SECTION_META } from '../utils/pimParser';
import ProductHeader from '../components/ProductHeader';
import SectionBlock from '../components/SectionBlock';

const SECTIONS = ['general', 'content', 'specs'];

const PLACEHOLDER = JSON.stringify(
  { general: {}, content: {}, specs: {} },
  null, 2
);

export default function EditorPage() {
  const [jsonText, setJsonText] = useState('');
  const [attributes, setAttributes] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [stats, setStats] = useState(null);
  const editorRef = useRef(null);
  const [showSampleMenu, setShowSampleMenu] = useState(false);
  const sampleMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sampleMenuRef.current && !sampleMenuRef.current.contains(e.target)) {
        setShowSampleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleParse = () => {
    const text = jsonText.trim();
    if (!text) {
      setParseError('Editor đang trống — hãy paste JSON vào trước.');
      setAttributes(null);
      setStats(null);
      return;
    }
    try {
      const json = JSON.parse(text);
      const attrs = parsePimData(json);
      const matched  = attrs.filter(a => a.status === 'matched').length;
      const newValue = attrs.filter(a => a.status === 'new_value').length;
      const newAttr  = attrs.filter(a => a.status === 'new_attr').length;
      const missing  = attrs.filter(a => a.status === 'missing').length;
      setAttributes(attrs);
      setStats({ total: attrs.length, matched, newValue, newAttr, missing });
      setParseError(null);
    } catch (e) {
      setParseError(e.message);
      setAttributes(null);
      setStats(null);
    }
  };

  const SAMPLES = [
    { label: 'Mẫu máy lạnh', file: 'data/test_maylanh_PIM.json' },
    { label: 'Mẫu TV',       file: 'data/tv.json' },
  ];

  const handleLoadSample = async (file) => {
    setShowSampleMenu(false);
    try {
      const res = await fetch(import.meta.env.BASE_URL + file);
      const text = await res.text();
      setJsonText(text);
      setParseError(null);
    } catch {
      setParseError('Không tải được file mẫu.');
    }
  };

  const handleClear = () => {
    setJsonText('');
    setAttributes(null);
    setParseError(null);
    setStats(null);
  };

  return (
    <div className="editor-page">
      {/* ── LEFT: Monaco Editor ───────────────────────── */}
      <div className="editor-panel">
        <div className="editor-toolbar">
          <div className="editor-toolbar-left">
            <span className="editor-panel-label">JSON Input</span>
            {stats && (
              <span className="editor-stats">
                ✓ {stats.total} thuộc tính
                <span className="estat-matched"> · {stats.matched} matched</span>
                {stats.newValue > 0 && <span className="estat-newval"> · {stats.newValue} giá trị mới</span>}
                {stats.newAttr > 0 && <span className="estat-newattr"> · {stats.newAttr} new attr</span>}
                {stats.missing > 0 && <span className="estat-missing"> · {stats.missing} missing</span>}
              </span>
            )}
          </div>
          <div className="editor-toolbar-right">
            <div className="btn-sample-wrap" ref={sampleMenuRef}>
              <button className="btn-editor btn-sample" onClick={() => setShowSampleMenu(v => !v)}>
                Load mẫu ▾
              </button>
              {showSampleMenu && (
                <div className="sample-dropdown">
                  {SAMPLES.map(s => (
                    <button key={s.file} className="sample-dropdown-item" onClick={() => handleLoadSample(s.file)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="btn-editor btn-clear" onClick={handleClear}>
              Xóa
            </button>
            <button className="btn-editor btn-parse" onClick={handleParse}>
              ▶ Parse
            </button>
          </div>
        </div>

        <div className="monaco-wrapper">
          <Editor
            language="json"
            value={jsonText}
            onChange={v => setJsonText(v || '')}
            onMount={handleEditorMount}
            theme="vs"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'SF Mono', Menlo, Monaco, 'Courier New', monospace",
              wordWrap: 'off',
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              tabSize: 2,
              automaticLayout: true,
              scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            }}
          />
        </div>

        {parseError && (
          <div className="editor-error">
            <span className="editor-error-icon">✗</span>
            {parseError}
          </div>
        )}
      </div>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="editor-divider" />

      {/* ── RIGHT: Preview ────────────────────────────── */}
      <div className="preview-panel">
        {!attributes ? (
          <div className="preview-empty">
            <div className="preview-empty-icon">{ '{  }' }</div>
            <p className="preview-empty-title">Chưa có dữ liệu</p>
            <p className="preview-empty-hint">
              Paste JSON vào editor bên trái rồi bấm <strong>▶ Parse</strong>
            </p>
            <button className="btn-editor btn-parse" style={{ marginTop: 16 }} onClick={() => handleLoadSample('data/test_maylanh_PIM.json')}>
              Hoặc Load dữ liệu mẫu
            </button>
          </div>
        ) : (
          <div className="preview-scroll">
            <ProductHeader attributes={attributes} />
            {SECTIONS.map(section => {
              const meta = SECTION_META[section];
              return (
                <SectionBlock
                  key={section}
                  title={meta.title}
                  icon={meta.icon}
                  color={meta.color}
                  attributes={attributes.filter(a => a.section === section)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
