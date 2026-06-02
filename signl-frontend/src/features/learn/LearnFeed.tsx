import LearnCard from './LearnCard'
import type { Article } from '@/types/article'

export default function LearnFeed({ articles }: { articles: Article[] }) {
  return (
    <div className="learn-grid">
      {articles.map((article) => (
        <LearnCard key={article.id} article={article} />
      ))}
    </div>
  )
}
