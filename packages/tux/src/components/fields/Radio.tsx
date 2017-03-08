import React from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

interface Radio {
  id: string
  value: string
  label: string
  helpText: string
  choices: Array<string>
  onChange: (e: React.FormEvent<any>) => void
}

const Radio = ({ id, value, label, choices, onChange }: Radio) => (
  <div className="Radio">
    <label className="InputLabel">{label}: current value is {value}</label>
    {choices.map((choice) => (
      <input type="checkbox" value={choice} key={choice} />
    ))}
    <style jsx>{`
      .Radio {

      }
    `}</style>
  </div>
)

export default Radio
