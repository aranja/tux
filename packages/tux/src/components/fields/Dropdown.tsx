import React from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

interface Dropdown {
  id: string
  value: string
  label: string
  helpText: string
  dropdownValues: Array<string>
  onChange: (e: React.FormEvent<any>) => void
}

const Dropdown = ({ id, value, label, dropdownValues, onChange }: Dropdown) => (
  <div className="Dropdown">
    <label className="InputLabel">{label}: current value is {value}</label>
    <select>
      {dropdownValues.map((value) => (
        <option key={value}>{value}</option>
      ))}
    </select>
      <style jsx>{`
        .Dropdown {

        }
      `}</style>
  </div>
)

export default Dropdown
