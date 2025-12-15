import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_API_PATH =
  '/wordpress/index.php?rest_route=/wp/v2/posts&_embed&per_page=10'
// Use env variable in prod (e.g. on Plesk) and fall back to same-origin + /wordpress for dev
const API_URL =
  import.meta.env.VITE_API_URL || `${window.location.origin}${DEFAULT_API_PATH}`

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <main className="page">
      <header className="page__header">
        <p className="eyebrow">Inagle headless</p>
        <h1>Blog headless</h1>
      </header>

      {loading && <p className="muted">Chargement...</p>}
      {error && (
        <p className="error">
          Erreur de chargement : {error}. Vérifie que l’API est accessible.
        </p>
      )}

      <section className="grid">
        {!loading &&
          !error &&
          posts.map((post) => {
            const featured =
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
            const date = new Date(post.date).toLocaleDateString('fr-FR')

            return (
              <article key={post.id} className="card">
                {featured && (
                  <img
                    src={featured}
                    alt=""
                    className="card__image"
                    loading="lazy"
                  />
                )}
                <div className="card__content">
                  <div className="meta">{date}</div>
                  <h2
                    className="card__title"
                    dangerouslySetInnerHTML={{ __html: post.title?.rendered }}
                  />
                  <div
                    className="excerpt"
                    dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered }}
                  />
                  <a className="link" href={post.link} target="_blank">
                    Lire l’article
                  </a>
                </div>
              </article>
            )
          })}
      </section>
    </main>
  )
}

export default App
