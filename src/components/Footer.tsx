import { researcher } from '../data/researcher'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <p>{researcher.name}</p>
          <small>{researcher.affiliation}</small>
        </div>
        <div className="footer-col">
          <p>Research portfolio</p>
          <small>{researcher.location}</small>
        </div>
      </div>
    </footer>
  )
}
