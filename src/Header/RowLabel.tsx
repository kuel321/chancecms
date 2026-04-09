'use client'
import React from 'react'

export const RowLabel = ({ data }: { data?: { label?: string } }) => {
  return <>{data?.label || 'Row'}</>
}
