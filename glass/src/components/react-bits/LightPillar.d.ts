import type { CSSProperties, FC } from 'react'

export interface LightPillarProps {
  topColor?: string
  bottomColor?: string
  intensity?: number
  glowAmount?: number
  bloom?: number
  pillarWidth?: number
  pillarHeight?: number
  pillarRotation?: number
  twist?: number
  detail?: number
  rotationSpeed?: number
  flow?: number
  noiseIntensity?: number
  interactive?: boolean
  clickPulse?: boolean
  intro?: boolean
  fade?: number
  quality?: 'low' | 'medium' | 'high'
  resolution?: number
  mixBlendMode?: CSSProperties['mixBlendMode']
  lightMode?: boolean
  paused?: boolean
  className?: string
  style?: CSSProperties
}

declare const LightPillar: FC<LightPillarProps>
export default LightPillar
