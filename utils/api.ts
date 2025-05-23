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

/** Instância do Axios apontando para o backend */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

/** Interceptor para injetar token JWT */
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

/** Interceptor para tratar 401/403 e redirecionar */
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

/** Cria novo artigo */
export const createArticle = async (
  formData: FormData
): Promise<ArticleDetail> => {
  const { data } = await api.post<ArticleDetail>('/articles', formData)
  return data
}

/** Atualiza um artigo existente (PUT multipart/form-data) */
export const updateArticle = async (
  id: string,
  formData: FormData
): Promise<ArticleDetail> => {
  const { data } = await api.put<ArticleDetail>(`/articles/${id}`, formData)
  return data
}

/** Remove um artigo */
export const deleteArticle = async (id: string): Promise<void> => {
  await api.delete(`/articles/${id}`)
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
