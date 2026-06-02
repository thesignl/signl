import ArticleCard from './ArticleCard'
import EmptyState from '@/components/ui/EmptyState'
import type { Article } from '@/types/article'

export default function HomeFeed({ articles }: { articles: Article[] }) {
  return (
    <section className="home-feed" aria-labelledby="home-feed-title">
      <div className="container">
        <div className="section-header">
          <h2 id="home-feed-title" className="section-title">
            Latest
          </h2>
        </div>

        {articles.length === 0 ? (
          <EmptyState
            title="The feed is quiet"
            description="New stories will appear here as they publish. Check back shortly."
          />
        ) : (
          <div className="article-stack">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
