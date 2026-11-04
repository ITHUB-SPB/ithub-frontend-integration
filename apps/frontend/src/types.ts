export type User = {
  username: string
  role: 'user' | 'admin'
}

export type Course = {
  id: string
  title: string
  records_count?: number
}

export type RecordItem = {
  id: number
  course: {
    id: string
    title: string
  }
  author: User
  created_at: string
}

export type RecordsAll = {
  data: RecordItem[]
  data_count: number
}

export type RecordQueryParams = {
  accessToken: string
  authorId?: string
}

export type LoginResultData = {
  access_token: string
  token_type: string
}

export type RegisterData = {
  username: string
  password: string
}

export type RecordCreateData = {
  course_id: string
}

export type RecordMutationParams = {
  accessToken: string
  courseId: string
}

export type RecordDeleteParams = {
  accessToken: string
  id: number
}
