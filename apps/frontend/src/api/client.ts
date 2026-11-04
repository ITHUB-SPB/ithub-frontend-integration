import fetcher from './fetcher'
import type {
  Course,
  LoginResultData,
  RecordCreateData,
  RecordDeleteParams,
  RecordItem,
  RecordMutationParams,
  RecordQueryParams,
  RecordsAll,
  RegisterData,
  User,
} from '#/types'

const authHeaders = (accessToken?: string): Record<string, string> & {
  'Content-Type': 'application/json'
} => ({
  'Content-Type': 'application/json',
  ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
})

const allRecordsFn = async ({
  accessToken,
  authorId,
}: RecordQueryParams): Promise<RecordsAll> => {
  return fetcher<RecordsAll>({
    path: '/records/',
    headers: authHeaders(accessToken),
    method: 'get',
    searchParams: { author: authorId },
  })
}

const getRecordFn = async ({
  accessToken,
  id,
}: RecordDeleteParams): Promise<RecordItem> => {
  return fetcher<RecordItem>({
    path: `/records/${id}`,
    headers: authHeaders(accessToken),
    method: 'get',
  })
}

const createRecordFn = async ({
  accessToken,
  courseId,
}: RecordMutationParams): Promise<RecordItem> => {
  const body: RecordCreateData = { course_id: courseId }

  return fetcher<RecordItem>({
    path: '/records/',
    headers: authHeaders(accessToken),
    method: 'post',
    body,
  })
}

const deleteRecordFn = async ({
  accessToken,
  id,
}: RecordDeleteParams): Promise<void> => {
  return fetcher<void>({
    path: `/records/${id}`,
    headers: authHeaders(accessToken),
    method: 'delete',
  })
}

const getCoursesFn = async (): Promise<Course[]> => {
  return fetcher<Course[]>({
    path: '/courses/',
    headers: authHeaders(),
    method: 'get',
  })
}

const getMeFn = async (accessToken: string): Promise<User> => {
  return fetcher<User>({
    path: '/auth/me',
    headers: authHeaders(accessToken),
    method: 'get',
  })
}

const loginFn = async ({
  username,
  password,
}: RegisterData): Promise<LoginResultData> => {
  return fetcher<LoginResultData>({
    path: '/auth/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ username, password }),
  })
}

const registerFn = async (data: RegisterData): Promise<void> => {
  return fetcher<void>({
    path: '/auth/',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
}

export default {
  records: {
    all: allRecordsFn,
    get: getRecordFn,
    create: createRecordFn,
    delete: deleteRecordFn,
  },
  courses: {
    all: getCoursesFn,
  },
  auth: {
    login: loginFn,
    register: registerFn,
    me: getMeFn,
  },
}
