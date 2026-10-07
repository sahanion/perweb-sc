import { researcher } from '../data/researcher'

export function Footer() {
  return <footer className="footer"><div className="container footer-inner"><div><span className="brand-mark">SC</span><p>{researcher.name}</p><small>{researcher.affiliation}</small></div><p className="footer-note">Research portfolio<br />Nantes, France</p><a className="footer-contact" href="#top">Back to top <span>↑</span></a></div></footer>
}
