export type BlockType =
  | 'PARAGRAPH'
  | 'HEADING'
  | 'QUOTE'
  | 'IMAGE'
  | 'TABLE'

export interface ContentBlock {

  id: string

  type: BlockType

  position: number

  content: any
}

export interface AnalysisStep {

  id?: string

  title: string

  description: string
}

export interface EditorArticle {

  id: string

  title: string

  summary: string

  signal?: string

  articleType: string

  status: string

  readTime: number
  
  views: number
  
  premium: boolean
  
  verified: boolean

  blocks: ContentBlock[]

  analysisSteps: AnalysisStep[]
}