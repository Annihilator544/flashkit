import React from 'react'

export const Thumb = (props) => {
  const { selected, onClick, image } = props

  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className={`border-2 rounded-xl overflow-hidden ${selected ? 'border-black' : ''}`}
      >
        <img src={image} alt="" />
      </button>
    </div>
  )
}
