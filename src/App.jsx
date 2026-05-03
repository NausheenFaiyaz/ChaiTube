import { useEffect, useMemo, useState } from 'react'
import './App.css'

const SORT_OPTIONS = [
  { label: 'Most Liked', value: 'mostLiked' },
  { label: 'Most Viewed', value: 'mostViewed' },
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
]

function formatNumber(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n)
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown date'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return 'Unknown date'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function App() {
  const [videos, setVideos] = useState([])
  const [query, setQuery] = useState('javascript')
  const [sortBy, setSortBy] = useState('mostViewed')
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(1)

  const encodedSort = useMemo(() => encodeURIComponent(sortBy), [sortBy])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchVideos() {
      setLoading(true)
      setError('')
      try {
        const url = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=${limit}&query=${encodeURIComponent(query)}&sortBy=${encodedSort}`
        const res = await fetch(url, {
          method: 'GET',
          headers: { accept: 'application/json' },
          signal: controller.signal,
        })
        const data = await res.json()

        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || 'Failed to fetch videos.')
        }

        const payload = data?.data || {}
        const items =
          payload?.data ||
          payload?.videos ||
          payload?.items ||
          payload?.docs ||
          []

        const pages =
          payload?.totalPages ||
          payload?.pagination?.totalPages ||
          Math.max(1, Math.ceil((payload?.total || items.length || 1) / limit))

        setVideos(Array.isArray(items) ? items : [])
        setTotalPages(pages)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch videos.')
          setVideos([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
    return () => controller.abort()
  }, [page, limit, query, encodedSort])

  function handleSearch(event) {
    event.preventDefault()
    const value = event.target.search.value.trim()
    setPage(1)
    setQuery(value || 'javascript')
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>ChaiTube</h1>
        <form className="searchbar" onSubmit={handleSearch}>
          <input
            name="search"
            type="text"
            placeholder="Search videos..."
            defaultValue={query}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <section className="controls">
        <div className="control">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              setPage(1)
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control">
          <span className="pill">Query: {query}</span>
          <span className="pill">Page: {page}</span>
        </div>
      </section>

      {loading && <p className="status">Loading videos...</p>}
      {error && !loading && <p className="status error">{error}</p>}
      {!loading && !error && videos.length === 0 && (
        <p className="status">No videos found for this query.</p>
      )}

      <main className="video-grid">
        {videos.map((video, index) => {
          const source = video?.items || video
          const id = source?._id || source?.id || `${source?.title || 'video'}-${index}`
          const videoId = source?.id || source?.videoId || source?.snippet?.resourceId?.videoId
          const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''
          const title =
            source?.title || source?.snippet?.title || 'Untitled video'
          const thumb =
            source?.thumbnail?.url ||
            source?.thumbnail ||
            source?.snippet?.thumbnails?.maxres?.url ||
            source?.snippet?.thumbnails?.standard?.url ||
            source?.snippet?.thumbnails?.high?.url ||
            source?.snippet?.thumbnails?.medium?.url ||
            'https://via.placeholder.com/640x360.png?text=No+Thumbnail'
          const channel =
            source?.channel?.name ||
            source?.channelTitle ||
            source?.snippet?.channelTitle ||
            'Unknown channel'
          const description = source?.snippet?.description || 'No description available.'
          const views = source?.views || source?.statistics?.viewCount || 0
          const likes = source?.likes || source?.statistics?.likeCount || 0
          const publishedAt = source?.publishedAt || source?.snippet?.publishedAt

          return (
            <article key={id} className="video-card">
              <div className="card-head">
                <p className="badge">Video</p>
                <button className="menu-dot" type="button" aria-label="More options">
                  ...
                </button>
              </div>
              <div className="thumb-frame">
                <img src={thumb} alt={title} className="thumb" loading="lazy" />
              </div>
              <div className="video-meta">
                <h2 title={title}>{title}</h2>
                <p className="channel">{channel}</p>
                <p className="desc">{description}</p>
                <div className="stats-row">
                  <div className="mini-stat">
                    <span>Views</span>
                    <strong>{formatNumber(views)}</strong>
                  </div>
                  <div className="mini-stat">
                    <span>Likes</span>
                    <strong>{formatNumber(likes)}</strong>
                  </div>
                </div>
                <p className="date">Published: {formatDate(publishedAt)}</p>
                {videoUrl && (
                  <a className="watch-btn" href={videoUrl} target="_blank" rel="noreferrer">
                    Watch on YouTube
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </main>

      <footer className="pager">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.max(1, totalPages)}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </footer>
    </div>
  )
}

export default App
