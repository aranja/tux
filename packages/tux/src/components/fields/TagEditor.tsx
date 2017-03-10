import React from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

interface TagEditor {
  id: string
  value: string
  label: string
  helpText: string
  onChange: (e: React.FormEvent<any>) => void
}

const TagEditor = ({ id, value, label, onChange }: TagEditor) => (
  <div className="Input">
    <label className="InputLabel">{label}</label>
      <p>{value}</p>
      <style jsx>{`
        .TagEditor {

        }
      `}</style>
  </div>
)

export default TagEditor
