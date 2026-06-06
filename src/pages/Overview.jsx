import { useState } from 'react'

const WSE = ['Weapon', 'Secondary', 'Emblem']
const ACCESSORIES = ['Face', 'Eye', 'Earring', 'Pendant 1', 'Pendant 2', 'Belt', 'Ring 1', 'Ring 2', 'Ring 3', 'Ring 4']
const ARMOR = ['Hat', 'Top', 'Bottom', 'Shoes', 'Gloves', 'Cape', 'Shoulder']

const TIER_COLORS = {
  None: '#888',
  Rare: '#4a90d9',
  Epic: '#9b59b6',
  Unique: '#f39c12',
  Legendary: '#27ae60'
}

function SlotRow({ slotName, slot, mark, onCycle }) {
  if (!slot) return null
  const potentialParts = []
  if (slot.att) potentialParts.push(`${slot.att}% ATT`)
  if (slot.boss) potentialParts.push(`${slot.boss}% Boss`)
  if (slot.ied) potentialParts.push(`${slot.ied}% IED`)
  if (slot.stat) potentialParts.push(`${slot.stat}% Stat`)
  if (slot.critDmg) potentialParts.push(`${slot.critDmg}% CD`)
  if (slot.cooldown) potentialParts.push(`-${slot.cooldown}s CD`)

  const MARKS = ['', '⭐', '🔮', '🔄']

  return (
    <tr style={{ borderTop: '1px solid #eee' }}>
      <td style={{ padding: '0.25rem 0.4rem', fontSize: '13px', color: '#888', whiteSpace: 'nowrap' }}>{slotName}</td>
      <td style={{ padding: '0.25rem 0.4rem', fontSize: '13px' }}>{slot.itemLevel || '—'}</td>
      <td style={{ padding: '0.25rem 0.4rem', fontSize: '13px' }}>{slot.stars ? `${slot.stars}★` : '—'}</td>
      <td style={{ padding: '0.25rem 0.4rem', fontSize: '13px', color: TIER_COLORS[slot.potentialTier] || '#888' }}>
        {slot.potentialTier !== 'None' ? slot.potentialTier : '—'}
      </td>
      <td style={{ padding: '0.25rem 0.4rem', fontSize: '13px', color: '#555' }}>
        {potentialParts.length > 0 ? potentialParts.join(' / ') : '—'}
      </td>
      <td style={{ padding: '0.25rem 0.4rem', cursor: 'pointer', fontSize: '14px' }} onClick={onCycle}>
        {MARKS[mark] || <span style={{ color: '#ddd', fontSize: '12px' }}>○</span>}
      </td>
    </tr>
  )
}

function SlotGroup({ title, slots, char, mark, onCycle }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '11px', fontWeight: '500', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{title}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', fontSize: '11px', color: '#aaa', padding: '0.2rem 0.4rem', fontWeight: 400 }}>Slot</th>
            <th style={{ textAlign: 'left', fontSize: '11px', color: '#aaa', padding: '0.2rem 0.4rem', fontWeight: 400 }}>Lvl</th>
            <th style={{ textAlign: 'left', fontSize: '11px', color: '#aaa', padding: '0.2rem 0.4rem', fontWeight: 400 }}>Stars</th>
            <th style={{ textAlign: 'left', fontSize: '11px', color: '#aaa', padding: '0.2rem 0.4rem', fontWeight: 400 }}>Tier</th>
            <th style={{ textAlign: 'left', fontSize: '11px', color: '#aaa', padding: '0.2rem 0.4rem', fontWeight: 400 }}>Potential</th>
            <th style={{ textAlign: 'left', fontSize: '11px', color: '#aaa', padding: '0.2rem 0.4rem', fontWeight: 400 }}>Plan</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <SlotRow
              key={slot}
              slotName={slot}
              slot={char.slots[slot]}
              mark={mark[slot] || 0}
              onCycle={() => onCycle(slot)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SparesSection({ char }) {
  const [spares, setSpares] = useState(char.spares || [])
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState(1)
  const [reordering, setReordering] = useState(false)

  function saveSpares(updated) {
    const characters = JSON.parse(localStorage.getItem('characters') || '[]')
    const charIndex = characters.findIndex(c => c.name === char.name)
    if (charIndex === -1) return
    characters[charIndex].spares = updated
    localStorage.setItem('characters', JSON.stringify(characters))
    setSpares(updated)
  }

  function addSpare() {
    if (!newName.trim() || !newAmount) return
    const updated = [...spares, { name: newName.trim(), amount: parseInt(newAmount) }]
    saveSpares(updated)
    setNewName('')
    setNewAmount(1)
  }

  function removeAmount(index, amount) {
    const updated = spares.map((s, i) => i === index ? { ...s, amount: s.amount - amount } : s).filter(s => s.amount > 0)
    saveSpares(updated)
  }

  function removeAll(index) {
    saveSpares(spares.filter((_, i) => i !== index))
  }

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
  <div style={{ fontSize: '11px', fontWeight: '500', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spares</div>
  <button onClick={() => setReordering(!reordering)} style={{ fontSize: '11px', padding: '0.1rem 0.4rem' }}>
    {reordering ? 'Done' : 'Edit'}
  </button>
</div>
      {spares.length === 0 && (
        <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '0.5rem' }}>No spares added.</div>
      )}

      {spares.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '13px' }}>
          
          {reordering && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <button
              onClick={() => {
                if (i === 0) return
                const updated = [...spares]
                  ;[updated[i - 1], updated[i]] = [updated[i], updated[i - 1]]
                saveSpares(updated)
              }}
              style={{ fontSize: '9px', padding: '0 0.3rem', lineHeight: '1.2', transform: 'scale(0.8)'}} >▲</button>
            <button
              onClick={() => {
                if (i === spares.length - 1) return
                const updated = [...spares]
                  ;[updated[i + 1], updated[i]] = [updated[i], updated[i + 1]]
                saveSpares(updated)
              }}
              style={{ fontSize: '9px', padding: '0 0.3rem', lineHeight: '1.2', transform: 'scale(0.8)' }} >▼</button>
          </div>
        )}
          <span style={{ minWidth: '140px' }}>{s.name}</span>
          <span style={{ color: '#888' }}>×{s.amount}</span>
          {reordering && (
            <>
          <button onClick={() => removeAmount(i, 1)} style={{ fontSize: '11px', padding: '0.1rem 0.4rem' }}>−1</button>
          <button onClick={() => removeAll(i)} style={{ fontSize: '11px', padding: '0.1rem 0.4rem', color: '#c0392b' }}>Remove all</button> </>)}
          
          </div>
      ))}

      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Item name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSpare()}
          style={{ width: '140px' }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newAmount}
          onChange={e => setNewAmount(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSpare()}
          style={{ width: '70px' }}
        />
        <button onClick={addSpare}>Add spare</button>
      </div>
    </div>
  )
}

function CharacterCard({ char }) {
  const [expanded, setExpanded] = useState(false)
  const [mark, setMark] = useState(
    Object.fromEntries(Object.entries(char.slots).map(([k, v]) => [k, v.mark || 0]))
  )
  function cycleMark(slotName) {
    const characters = JSON.parse(localStorage.getItem('characters') || '[]')
    const charIndex = characters.findIndex(c => c.name === char.name)
    if (charIndex === -1) return
    const current = characters[charIndex].slots[slotName].mark || 0
    characters[charIndex].slots[slotName].mark = (current + 1) % 4
    localStorage.setItem('characters', JSON.stringify(characters))
    setMark(prev => ({ ...prev, [slotName]: characters[charIndex].slots[slotName].mark }))
  }


  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '10px', marginBottom: '0.75rem', overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', cursor: 'pointer', background: expanded ? '#f9f9f9' : 'white' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontWeight: '500', fontSize: '15px' }}>{char.name}</span>
          <span style={{ fontSize: '13px', color: '#888' }}>Lv. {char.level || '—'}</span>
          <span style={{ fontSize: '13px', color: '#888' }}>
            {char.combatPower ? `${parseFloat(char.combatPower).toLocaleString('no-NO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}m CP` : '— CP'}
          </span>
          <span style={{ fontSize: '13px', color: '#888' }}>Hexa: {char.hexaConverted || '—'}</span>
        </div>
        <span style={{ fontSize: '12px', color: '#aaa' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ padding: '1rem', borderTop: '1px solid #eee', fontFamily: "'Trebuchet MS', sans-serif"}}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '1rem', padding: '0.75rem', background: '#ececec', borderRadius: '8px' }}>
            <div><span style={{ fontSize: '11px', color: '#3d3d3d' }}>IED</span><br /><span style={{ fontSize: '14px' }}>{char.ied ? `${char.ied}%` : '—'}</span></div>
            <div><span style={{ fontSize: '11px', color: '#3d3d3d' }}>Acc. Item Drop</span><br /><span style={{ fontSize: '14px' }}>{char.accDropPct ? `${char.accDropPct}%` : '—'}</span></div>
            <div><span style={{ fontSize: '11px', color: '#3d3d3d' }}>Acc. Meso Drop</span><br /><span style={{ fontSize: '14px' }}>{char.accMesoPct ? `${char.accMesoPct}%` : '—'}</span></div>
            <div><span style={{ fontSize: '11px', color: '#3d3d3d' }}>Familiar Drop</span><br /><span style={{ fontSize: '14px' }}>{char.familiarDropPct ? `${char.familiarDropPct}%` : '—'}</span></div>
            <div><span style={{ fontSize: '11px', color: '#3d3d3d' }}>Arcane Force</span><br /><span style={{ fontSize: '14px' }}>{char.arcaneForce || '—'}</span></div>
            <div><span style={{ fontSize: '11px', color: '#3d3d3d' }}>Sacred Force</span><br /><span style={{ fontSize: '14px' }}>{char.sacredForce || '—'}</span></div>
            <div><span style={{ fontSize: '11px', color: '#3d3d3d' }}>OZ Rings</span><br /><span style={{ fontSize: '14px' }}>{(() => {
              const oz = char.ozRings || {}
              const active = [
                oz.cont ? `Cont ${oz.cont}` : null,
                oz.ror ? `RoR ${oz.ror}` : null,
                oz.wj ? `WJ ${oz.wj}` : null
              ].filter(Boolean)
              return active.length > 0 ? active.join(', ') : 'No OZ ring'
            })()}</span></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <SlotGroup title="WSE" slots={WSE} char={char} mark={mark} onCycle={cycleMark} />
            <SlotGroup title="Armor" slots={ARMOR} char={char} mark={mark} onCycle={cycleMark} />
            <SlotGroup title="Accessories" slots={ACCESSORIES} char={char} mark={mark} onCycle={cycleMark} />
            <SparesSection char={char} />
          </div>
        </div>
      )}
    </div>
  )
}

function Overview() {
  const characters = JSON.parse(localStorage.getItem('characters') || '[]')

  if (characters.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
        No characters added yet. Go to the Characters tab to add one.
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem', textAlign: 'left' }}>
      <h2>Overview</h2>
      {characters.map((char, i) => (
        <CharacterCard key={i} char={char} />
      ))}
    </div>
  )
}

export default Overview