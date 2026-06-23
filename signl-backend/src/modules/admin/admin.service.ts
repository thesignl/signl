import {
  adminRepository
}
from './admin.repository.js'

import type {
  ListArticlesQuery,
  BulkArticleActionInput,
  UpdateAuthorInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateTagInput,
  UpdateTagInput,
  ListSubscribersQuery,
  AnalyticsViewsQuery,
  CreatePlacementInput,
  UpdatePlacementInput,
} from './admin.validation.js'

export const adminService = {

  getDashboardStats:
  async () => {

    const [stats, topTrending, editorialQueue, recentActivity] = await Promise.all([
      adminRepository.getStats(),
      adminRepository.getTopTrending(),
      adminRepository.getEditorialQueue(),
      adminRepository.getRecentActivity(),
    ])

    return { ...stats, topTrending, editorialQueue, recentActivity }
  },
  getUsers:
  async () => {

    return adminRepository
      .getUsers()
  },
  updateRole:
  async (

    id: string,

    role: string

  ) => {

    return adminRepository
      .updateUserRole(
        id,
        role
      )
  },

  deleteUser:
  async (
    id: string
  ) => {

    return adminRepository
      .deleteUser(id)
  },

  // ── Articles ──────────────────────────────────────────────────

  listArticles: async (filters: ListArticlesQuery) => {
    const { articles, total } = await adminRepository.listArticles(filters)
    return {
      articles,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    }
  },

  getArticleById: async (id: string) => {
    const article = await adminRepository.findArticleById(id)
    if (!article) throw new Error('Article not found')
    return article
  },

  changeArticleStatus: async (id: string, status: string) => {
    return adminRepository.updateArticleStatus(id, status)
  },

  bulkArticleAction: async (input: BulkArticleActionInput) => {
    const { ids, action } = input

    switch (action) {
      case 'publish':
        await adminRepository.bulkUpdateArticleStatus(ids, 'PUBLISHED')
        break
      case 'archive':
        await adminRepository.bulkUpdateArticleStatus(ids, 'ARCHIVED')
        break
      case 'delete':
        await adminRepository.bulkDeleteArticles(ids)
        break
    }

    return { affected: ids.length }
  },

  // ── Authors / Editors ─────────────────────────────────────────

  listAuthors: async () => {
    return adminRepository.listEditors()
  },

  getAuthor: async (id: string) => {
    const author = await adminRepository.findEditorById(id)
    if (!author) throw new Error('Author not found')
    return author
  },

  updateAuthor: async (id: string, data: UpdateAuthorInput) => {
    return adminRepository.updateEditorProfile(id, data as Record<string, unknown>)
  },

  // ── Categories ────────────────────────────────────────────────

  listCategories: async () => {
    return adminRepository.listCategories()
  },

  createCategory: async (data: CreateCategoryInput) => {
    return adminRepository.createCategory(data)
  },

  updateCategory: async (id: string, data: UpdateCategoryInput) => {
    return adminRepository.updateCategory(id, data)
  },

  deleteCategory: async (id: string) => {
    return adminRepository.deleteCategory(id)
  },

  toggleCategoryActive: async (id: string) => {
    return adminRepository.toggleCategoryActive(id)
  },

  // ── Tags ──────────────────────────────────────────────────────

  listTags: async () => {
    return adminRepository.listTags()
  },

  createTag: async (data: CreateTagInput) => {
    return adminRepository.createTag(data)
  },

  updateTag: async (id: string, data: UpdateTagInput) => {
    return adminRepository.updateTag(id, data)
  },

  deleteTag: async (id: string) => {
    return adminRepository.deleteTag(id)
  },

  // ── Newsletter Subscribers ────────────────────────────────────

  listSubscribers: async (filters: ListSubscribersQuery) => {
    const { subscribers, total } = await adminRepository.listSubscribers(filters)
    return {
      subscribers,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    }
  },

  exportSubscribers: async () => {
    return adminRepository.exportSubscribers()
  },

  // ── Analytics ─────────────────────────────────────────────────

  getAnalyticsOverview: async () => {
    return adminRepository.getAnalyticsOverview()
  },

  getAnalyticsViews: async (query: AnalyticsViewsQuery) => {
    return adminRepository.getAnalyticsViews(query.days)
  },

  // ── Placement ─────────────────────────────────────────────────

  listPlacements: async () => {
    return adminRepository.listPlacements()
  },

  createPlacement: async (data: CreatePlacementInput) => {
    return adminRepository.createPlacement(data)
  },

  updatePlacement: async (id: string, data: UpdatePlacementInput) => {
    return adminRepository.updatePlacement(id, data)
  },

  deletePlacement: async (id: string) => {
    return adminRepository.deletePlacement(id)
  },

}