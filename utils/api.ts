import axios from 'axios'

/** Tipos compartilhados */
export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Author {
  id: string
  name: string
}

export interface Article {
  id: string
  title: string
  excerpt: string
  thumbnailUrl?: string
  author: Author
  publishedAt: string
}

export interface ArticleDetail extends Omit<Article, 'excerpt'> {
  content: string
  updatedAt: string
  image?: string
}

/** Cria instância do Axios apontando pro seu backend */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

/** Interceptor de requisição: injeta token */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/** Interceptor de resposta: trata 401/403 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response?.status ?? 0)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/** Busca lista de artigos */
export const getArticles = async (): Promise<Article[]> => {
  const { data } = await api.get<Article[]>('/articles')
  return data
}

/** Busca detalhe de um artigo */
export const getArticleById = async (
  id: string
): Promise<ArticleDetail> => {
  const { data } = await api.get<ArticleDetail>(`/articles/${id}`)
  return data
}

/** Faz login e retorna token + user */
export const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/users/login', {
    email,
    password,
  })
  return data
}

/** Pega perfil do usuário logado */
export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/profile')
  return data
}

export default api
