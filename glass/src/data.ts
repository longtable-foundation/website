import raw from './data.json'

export type UseCase = {
  n: string
  slug: string
  t: string
  s: string
  video: string | null
  pp: string
  p: string[]
  d: string
  prob: string
  goal: string[]
  cap1?: string
  cap2?: string
  quote?: boolean
  qa?: string
  qLink?: string
  mile?: [string, string, string]
}

type Cfg = {
  sheetEndpoint: string
  formEndpoint: string
  pressEmail: string
  githubUrl: string
  proposal: { href: string; pages: number; date: string; title: string }
  videos: Record<string, string | number>
  links: Record<string, string>
  signatoriesConfirmed: boolean
  publicSignatories: { name: string; logo: string; tba?: boolean }[]
  speaker: { name: string; role: string }
}

type Data = {
  UC: UseCase[]
  GOAL1: string[]
  PH: { n: string; t: string; d: string; m?: string; g: string; now?: boolean }[]
  TL: { t: string; d: string }[]
  TC: string[]
  MCL: string[]
  INT: { id: string; k: string; t: string; d: string; c: string }[]
  CH: [string, string][]
  DUES: [string, string, number, number, 'r' | 'p' | 'o'][]
  BOILER: string
  cfg: Cfg
}

export const D = raw as unknown as Data
export const cfg = D.cfg
export const UC = D.UC
