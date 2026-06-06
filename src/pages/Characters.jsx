import { useState, useEffect } from 'react'

const SLOTS = [
  'Weapon', 'Secondary', 'Emblem',
  'Hat', 'Top', 'Bottom', 'Shoes', 'Gloves', 'Cape', 'Shoulder',
  'Face', 'Eye', 'Earring', 'Pendant 1', 'Pendant 2', 'Belt',
  'Ring 1', 'Ring 2', 'Ring 3', 'Ring 4'
]

const ITEM_LEVELS = [100, 110, 120, 130, 135, 140, 150, 160, 200]
const POTENTIAL_TIERS = ['None', 'Rare', 'Epic', 'Unique', 'Legendary']
const STAT_PCT = [6, 7, 9, 10, 12, 13, 14, 15, 17, 18, 20, 21, 23, 24, 27, 30, 33]
const ATT_PCT = [9, 10, 12, 13, 18, 20, 21, 23, 26, 33, 36, 39]
const BOSS_PCT = [30, 35, 40]
const IED_PCT = [30, 35, 40]
const CRIT_DMG = [8, 16]
const COOLDOWN = [1, 2, 3, 4]

function emptySlot() {
  return {
    itemLevel: '',
    stars: 0,
    potentialTier: 'None',
    stat: '',
    att: '',
    boss: '',
    ied: '',
    critDmg: '',
    cooldown: '',
    mark: 0
  }
}

function emptyCharacter(name) {
  const slots = {}
  SLOTS.forEach(slot => { slots[slot] = emptySlot() })
  return {
    name,
    slots,
    level: '',
    combatPower: '',
    hexaConverted: '',
    ied: '',
    dropPct: '',
    mesoPct: '',
    arcaneForce: '',
    sacredForce: '',
    ozRings: {
      cont: '',
      ror:'',
      wj:'',
    },
    spares: []
  }
}

function PotentialInputs({ slot, data, onChange }) {
  const sel = (field, options, label, suffix = '%') => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
      <span style={{ fontSize: '12px', minWidth: '80px', color: '#888' }}>{label}</span>
      <select value={data[field]} onChange={e => onChange(field, e.target.value)}>
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}{suffix}</option>)}
      </select>
    </div>
  )

  if (slot === 'Weapon' || slot === 'Secondary') return (
    <div>
      {sel('att', ATT_PCT, 'ATT')}
      {sel('boss', BOSS_PCT, 'Boss')}
      {sel('ied', IED_PCT, 'IED')}
    </div>
  )

  if (slot === 'Emblem') return (
    <div>
      {sel('att', ATT_PCT, 'ATT')}
      {sel('ied', IED_PCT, 'IED')}
    </div>
  )

  if (slot === 'Gloves') return (
    <div>
      {sel('stat', STAT_PCT, 'All Stat')}
      {sel('critDmg', CRIT_DMG, 'Crit DMG')}
    </div>
  )

  if (slot === 'Hat') return (
    <div>
      {sel('stat', STAT_PCT, 'All Stat')}
      {sel('cooldown', COOLDOWN, 'Cooldown', 's')}
    </div>
  )

  return sel('stat', STAT_PCT, 'All Stat')
}

function Characters() {
  const [characters, setCharacters] = useState(() => {
    const saved = localStorage.getItem('characters')
    return saved ? JSON.parse(saved) : []
  })
  const [selected, setSelected] = useState(null)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    localStorage.setItem('characters', JSON.stringify(characters))
  }, [characters])

  function addCharacter() {
    if (!newName.trim() || characters.length >= 10) return
    const updated = [...characters, emptyCharacter(newName.trim())]
    setCharacters(updated)
    setSelected(updated.length - 1)
    setNewName('')
  }

  function removeCharacter(index) {
    const name = characters[index].name
    if (!window.confirm(`Are you sure you want to remove ${name}'s saved data?`)) return
    const updated = characters.filter((_, i) => i !== index)
    setCharacters(updated)
    setSelected(null)
  }

  function updateCharacterField(field, value) {
    const updated = [...characters]
    updated[selected][field] = value
    setCharacters(updated)
  }

  function updateSlot(slotName, field, value) {
    const updated = [...characters]
    updated[selected].slots[slotName][field] = value
    setCharacters(updated)
  }

  const char = selected !== null ? characters[selected] : null

  return (
    <div style={{ padding: '1rem', textAlign: 'left' }}>
      <h2>Characters</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          placeholder="Character name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCharacter()}
        />
        <button onClick={addCharacter} disabled={characters.length >= 10}>
          Add
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {characters.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              onClick={() => setSelected(i)}
              style={{ fontWeight: selected === i ? 'bold' : 'normal' }}
            >
              {c.name}
            </button>
            <button onClick={() => removeCharacter(i)}>✕</button>
          </div>
        ))}
      </div>

      {char && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            {[
              { label: 'Level', field: 'level', placeholder: '260' },
              { label: 'IED (%)', field: 'ied', placeholder: '95.5' },
              { label: 'Acc. Item Drop (%)', field: 'accDropPct', placeholder: '150' },
              { label: 'Acc. Meso Drop (%)', field: 'accMesoPct', placeholder: '200' },
              { label: 'Familiar Item Drop (%)', field: 'familiarDropPct', placeholder: '100' },
              { label: 'Arcane Force', field: 'arcaneForce', placeholder: '1200' },
              { label: 'Sacred Force', field: 'sacredForce', placeholder: '600' },
              { label: 'Hexa Converted', field: 'hexaConverted', placeholder: '0' },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '0.2rem' }}>{label}</div>
                <input
                  type="number"
                  placeholder={placeholder}
                  value={char[field]}
                  onChange={e => updateCharacterField(field, e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '0.2rem' }}>Combat Power</div>
              <input
                type="number"
                placeholder="16.5"
                value={char.combatPower}
                onChange={e => updateCharacterField('combatPower', e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
              {char.combatPower && (
                <div style={{ fontSize: '12px', color: '#888', marginTop: '0.2rem' }}>
                  {parseFloat(char.combatPower).toLocaleString('no-NO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}m CP
                </div>
              )}
            </div>
          </div>
<div style={{ gridColumn: 'span 2' }}>
  <div style={{ fontSize: '12px', color: '#888', marginBottom: '0.4rem' }}>OZ Rings</div>
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    {[{ label: 'Cont', field: 'cont' }, { label: 'RoR', field: 'ror' }, { label: 'WJ', field: 'wj' }].map(({ label, field }) => (
      <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <label style={{ fontSize: '13px' }}>{label}</label>
        <select
          value={char.ozRings?.[field] || ''}
          onChange={e => updateCharacterField('ozRings', { ...char.ozRings, [field]: e.target.value })}
        >
          <option value="">—</option>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    ))}
  </div>
</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.4rem' }}>Slot</th>
                <th style={{ padding: '0.4rem' }}>Item level</th>
                <th style={{ padding: '0.4rem' }}>Stars</th>
                <th style={{ padding: '0.4rem' }}>Tier</th>
                <th style={{ padding: '0.4rem' }}>Potential</th>
              </tr>
            </thead>
            <tbody>
              {SLOTS.map(slot => {
                const s = char.slots[slot]
                return (
                  <tr key={slot} style={{ borderTop: '1px solid #ccc' }}>
                    <td style={{ padding: '0.4rem' }}>{slot}</td>
                    <td style={{ padding: '0.4rem' }}>
                      <select value={s.itemLevel} onChange={e => updateSlot(slot, 'itemLevel', e.target.value)}>
                        <option value="">—</option>
                        {ITEM_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '0.4rem' }}>
                      <input
                        type="number" min="0" max="30"
                        value={s.stars}
                        onChange={e => updateSlot(slot, 'stars', e.target.value)}
                        style={{ width: '50px' }}
                      />
                    </td>
                    <td style={{ padding: '0.4rem' }}>
                      <select value={s.potentialTier} onChange={e => updateSlot(slot, 'potentialTier', e.target.value)}>
                        {POTENTIAL_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '0.4rem' }}>
                      <PotentialInputs
                        slot={slot}
                        data={s}
                        onChange={(field, value) => updateSlot(slot, field, value)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default Characters