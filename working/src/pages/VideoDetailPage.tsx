import { useParams, Link } from 'react-router-dom'
import React from 'react'

export default function VideoDetailPage() {
  const { videoId } = useParams<{ videoId: string }>()

  if (!videoId) {
    return <div>Video not found</div>
  }

  return (
    <div className="video-detail-page">
      <nav className="video-nav">
        <Link to="/" className="back-button">← Back to Portfolio</Link>
      </nav>

      <div className="video-content">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0&muted=1&background=1&scale_to_fill=1`}
          className="video-detail-iframe"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Portfolio Video"
        />
      </div>
    </div>
  )
}