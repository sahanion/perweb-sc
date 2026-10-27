import React, { useState, useRef, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  minHeight?: number | string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your travelogue, reflections, notes on culture, environment, or personal anecdotes...',
  label = 'TRAVEL STORY / BLOG TEXT',
  required = false,
  minHeight = 220,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [currentBlock, setCurrentBlock] = useState('Paragraph')
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [activeTextColor, setActiveTextColor] = useState('#111827')
  const [activeHighlightColor, setActiveHighlightColor] = useState('#bbf7d0')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const savedSelectionRef = useRef<Range | null>(null)

  // Sync editor content with external value changes when not focused
  useEffect(() => {
    if (editorRef.current && !isFocused) {
      const currentHtml = editorRef.current.innerHTML
      const incomingHtml = value || ''
      if (currentHtml !== incomingHtml) {
        editorRef.current.innerHTML = incomingHtml
      }
    }
  }, [value, isFocused])

  // Save current text selection before opening popovers/modals
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  // Restore text selection
  const restoreSelection = () => {
    const sel = window.getSelection()
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedSelectionRef.current)
    }
  }

  const notifyChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      if (html === '<br>' || html === '<p><br></p>' || html.trim() === '') {
        onChange('')
      } else {
        onChange(html)
      }
    }
  }

  // Execute standard formatting commands without losing selection
  const executeCommand = (command: string, arg?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    notifyChange()
  }

  // Apply block formatting (p, h1, h2, h3, blockquote, pre)
  const applyFormatBlock = (tag: string, labelText: string) => {
    editorRef.current?.focus()
    document.execCommand('formatBlock', false, tag)
    setCurrentBlock(labelText)
    setShowBlockMenu(false)
    notifyChange()
  }

  // Text Color
  const applyTextColor = (color: string) => {
    restoreSelection()
    editorRef.current?.focus()
    document.execCommand('foreColor', false, color)
    setActiveTextColor(color)
    setShowTextColorPicker(false)
    notifyChange()
  }

  // Highlight / Marker Color
  const applyHighlightColor = (color: string) => {
    restoreSelection()
    editorRef.current?.focus()
    if (color === 'transparent') {
      document.execCommand('removeFormat', false, undefined)
    } else {
      if (!document.execCommand('hiliteColor', false, color)) {
        document.execCommand('backColor', false, color)
      }
    }
    setActiveHighlightColor(color)
    setShowHighlightPicker(false)
    notifyChange()
  }

  // Link Handling
  const handleOpenLinkModal = () => {
    saveSelection()
    setShowLinkModal(true)
    setLinkUrl('')
  }

  const handleApplyLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    restoreSelection()
    editorRef.current?.focus()
    if (linkUrl.trim()) {
      let finalUrl = linkUrl.trim()
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('#')) {
        finalUrl = `https://${finalUrl}`
      }
      document.execCommand('createLink', false, finalUrl)
    }
    setShowLinkModal(false)
    setLinkUrl('')
    notifyChange()
  }

  const handleUnlink = () => {
    editorRef.current?.focus()
    document.execCommand('unlink', false, undefined)
    notifyChange()
  }

  // Clear / Clean formatting
  const handleClean = () => {
    editorRef.current?.focus()
    document.execCommand('removeFormat', false, undefined)
    document.execCommand('formatBlock', false, '<p>')
    setCurrentBlock('Paragraph')
    notifyChange()
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.rte-dropdown-wrap')) {
        setShowBlockMenu(false)
        setShowTextColorPicker(false)
        setShowHighlightPicker(false)
      }
    }
    document.addEventListener('mousedown', handleGlobalClick)
    return () => document.removeEventListener('mousedown', handleGlobalClick)
  }, [])

  return (
    <div className="rich-text-editor-field">
      {/* Label above matching user screenshot */}
      <div className="rte-label-row">
        <label className="rte-label">
          {label} {required && <span className="req-star">*</span>}
        </label>
      </div>

      {/* Editor Box */}
      <div className={`rte-container ${isFocused ? 'is-focused' : ''}`}>
        {/* Toolbar */}
        <div className="rte-toolbar" role="toolbar" aria-label="Rich text editor toolbar">
          {/* Row 1 */}
          <div className="rte-toolbar-row">
            {/* Format Dropdown (Paragraph v) */}
            <div className="rte-dropdown-wrap">
              <button
                type="button"
                className="rte-btn rte-select-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  setShowBlockMenu(!showBlockMenu)
                  setShowTextColorPicker(false)
                  setShowHighlightPicker(false)
                }}
                title="Format Block"
              >
                <span>{currentBlock}</span>
                <span className="rte-chevron" aria-hidden="true">▾</span>
              </button>

              {showBlockMenu && (
                <div className="rte-dropdown-menu">
                  <button
                    type="button"
                    className={`rte-dropdown-item ${currentBlock === 'Paragraph' ? 'is-active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      applyFormatBlock('<p>', 'Paragraph')
                    }}
                  >
                    <span>Paragraph</span>
                  </button>
                  <button
                    type="button"
                    className={`rte-dropdown-item ${currentBlock === 'Heading 1' ? 'is-active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      applyFormatBlock('<h1>', 'Heading 1')
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Heading 1</span>
                  </button>
                  <button
                    type="button"
                    className={`rte-dropdown-item ${currentBlock === 'Heading 2' ? 'is-active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      applyFormatBlock('<h2>', 'Heading 2')
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Heading 2</span>
                  </button>
                  <button
                    type="button"
                    className={`rte-dropdown-item ${currentBlock === 'Heading 3' ? 'is-active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      applyFormatBlock('<h3>', 'Heading 3')
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Heading 3</span>
                  </button>
                  <button
                    type="button"
                    className={`rte-dropdown-item ${currentBlock === 'Quote' ? 'is-active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      applyFormatBlock('<blockquote>', 'Quote')
                    }}
                  >
                    <span style={{ fontStyle: 'italic', borderLeft: '2px solid #1f4f3c', paddingLeft: '6px' }}>Quote</span>
                  </button>
                  <button
                    type="button"
                    className={`rte-dropdown-item ${currentBlock === 'Code' ? 'is-active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      applyFormatBlock('<pre>', 'Code')
                    }}
                  >
                    <span style={{ fontFamily: 'monospace' }}>Code Block</span>
                  </button>
                </div>
              )}
            </div>

            <span className="rte-divider" aria-hidden="true" />

            {/* B, I, U, S */}
            <div className="rte-btn-group">
              <button
                type="button"
                className="rte-btn rte-style-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  executeCommand('bold')
                }}
                title="Bold (Ctrl+B)"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                className="rte-btn rte-style-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  executeCommand('italic')
                }}
                title="Italic (Ctrl+I)"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                className="rte-btn rte-style-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  executeCommand('underline')
                }}
                title="Underline (Ctrl+U)"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                className="rte-btn rte-style-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  executeCommand('strikeThrough')
                }}
                title="Strikethrough"
              >
                <s>S</s>
              </button>
            </div>

            <span className="rte-divider" aria-hidden="true" />

            {/* Colors: Text Color & Highlight Marker */}
            <div className="rte-btn-group">
              {/* Text Color A */}
              <div className="rte-dropdown-wrap">
                <button
                  type="button"
                  className="rte-btn rte-color-btn"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    saveSelection()
                    setShowTextColorPicker(!showTextColorPicker)
                    setShowHighlightPicker(false)
                    setShowBlockMenu(false)
                  }}
                  title="Text Color"
                >
                  <span className="rte-a-letter">A</span>
                  <span className="rte-color-underline" style={{ backgroundColor: activeTextColor }} />
                </button>

                {showTextColorPicker && (
                  <div className="rte-color-palette-popover">
                    <div className="rte-palette-title">Text Color</div>
                    <div className="rte-palette-grid">
                      {[
                        { color: '#111827', name: 'Ink' },
                        { color: '#1f4f3c', name: 'Evergreen' },
                        { color: '#047857', name: 'Emerald' },
                        { color: '#b45309', name: 'Bronze' },
                        { color: '#dc2626', name: 'Crimson' },
                        { color: '#2563eb', name: 'Navy' },
                        { color: '#7c3aed', name: 'Purple' },
                        { color: '#6b7280', name: 'Muted' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          className="rte-color-dot"
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            applyTextColor(c.color)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Marker / Highlighter Pen */}
              <div className="rte-dropdown-wrap">
                <button
                  type="button"
                  className="rte-btn rte-marker-btn"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    saveSelection()
                    setShowHighlightPicker(!showHighlightPicker)
                    setShowTextColorPicker(false)
                    setShowBlockMenu(false)
                  }}
                  title="Highlight Marker"
                >
                  <svg className="rte-marker-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 11-6 6v3h3l6-6" />
                    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
                  </svg>
                  <span className="rte-marker-bar" style={{ backgroundColor: activeHighlightColor === 'transparent' ? '#bbf7d0' : activeHighlightColor }} />
                </button>

                {showHighlightPicker && (
                  <div className="rte-color-palette-popover">
                    <div className="rte-palette-title">Highlight Marker</div>
                    <div className="rte-palette-grid">
                      {[
                        { color: '#fef08a', name: 'Yellow' },
                        { color: '#bbf7d0', name: 'Mint Green' },
                        { color: '#fed7aa', name: 'Soft Peach' },
                        { color: '#bae6fd', name: 'Sky Blue' },
                        { color: '#fecdd3', name: 'Rose Pink' },
                        { color: 'transparent', name: 'Clear Highlight' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          className={`rte-color-dot ${c.color === 'transparent' ? 'is-none' : ''}`}
                          style={{ backgroundColor: c.color === 'transparent' ? '#ffffff' : c.color }}
                          title={c.name}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            applyHighlightColor(c.color)
                          }}
                        >
                          {c.color === 'transparent' && '✕'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <span className="rte-divider" aria-hidden="true" />

            {/* Lists: • List & 1. List */}
            <div className="rte-btn-group">
              <button
                type="button"
                className="rte-btn rte-text-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  executeCommand('insertUnorderedList')
                }}
                title="Bullet List"
              >
                <span>• List</span>
              </button>
              <button
                type="button"
                className="rte-btn rte-text-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  executeCommand('insertOrderedList')
                }}
                title="Numbered List"
              >
                <span>1. List</span>
              </button>
            </div>

            <span className="rte-divider" aria-hidden="true" />

            {/* Links: Link & X Link */}
            <div className="rte-btn-group">
              <button
                type="button"
                className="rte-btn rte-text-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleOpenLinkModal()
                }}
                title="Insert Link"
              >
                <span className="rte-link-icon" aria-hidden="true">🔗</span>
                <span>Link</span>
              </button>
              <button
                type="button"
                className="rte-btn rte-text-btn"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleUnlink()
                }}
                title="Remove Link"
              >
                <span>✕ Link</span>
              </button>
            </div>
          </div>

          {/* Row 2: Divider, Clean, Undo, Redo */}
          <div className="rte-toolbar-row rte-toolbar-row-sub">
            <button
              type="button"
              className="rte-btn rte-sub-btn"
              onMouseDown={(e) => {
                e.preventDefault()
                executeCommand('insertHorizontalRule')
              }}
              title="Insert Horizontal Divider"
            >
              <span>—</span>
            </button>

            <button
              type="button"
              className="rte-btn rte-sub-btn rte-clean-btn"
              onMouseDown={(e) => {
                e.preventDefault()
                handleClean()
              }}
              title="Clean formatting"
            >
              <span className="rte-broom-icon" aria-hidden="true">🧹</span>
              <span>Clean</span>
            </button>

            <button
              type="button"
              className="rte-btn rte-sub-btn"
              onMouseDown={(e) => {
                e.preventDefault()
                executeCommand('undo')
              }}
              title="Undo"
            >
              <span>↺</span>
            </button>

            <button
              type="button"
              className="rte-btn rte-sub-btn"
              onMouseDown={(e) => {
                e.preventDefault()
                executeCommand('redo')
              }}
              title="Redo"
            >
              <span>↻</span>
            </button>
          </div>
        </div>

        {/* Modal / Bar to insert link URL */}
        {showLinkModal && (
          <div className="rte-link-prompt-bar">
            <span className="rte-link-prompt-label">Target URL:</span>
            <input
              type="url"
              className="rte-link-prompt-input"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleApplyLink()
                } else if (e.key === 'Escape') {
                  setShowLinkModal(false)
                }
              }}
            />
            <button
              type="button"
              className="rte-link-confirm-btn"
              onClick={() => handleApplyLink()}
            >
              Add Link
            </button>
            <button
              type="button"
              className="rte-link-cancel-btn"
              onClick={() => setShowLinkModal(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Contenteditable writing surface */}
        <div
          ref={editorRef}
          className="rte-editable-content"
          contentEditable
          data-placeholder={placeholder}
          style={{ minHeight }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            notifyChange()
          }}
          onInput={notifyChange}
          spellCheck
        />
      </div>
    </div>
  )
}
