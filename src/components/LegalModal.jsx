import { Modal } from './UI'

export default function LegalModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: '28px 24px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--color-dark)' }}>Mentions légales</h2>
          <button onClick={onClose} style={{
            background: 'var(--color-sand)', border: 'none', width: 30, height: 30,
            borderRadius: '50%', cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>
          <h3 style={{ color: 'var(--color-dark)', fontSize: 15, fontWeight: 700, margin: '16px 0 8px' }}>Éditeur</h3>
          <p>PadelSquad est une application web éditée à titre personnel.</p>
          <p>Contact : contact@padel-squad.com</p>

          <h3 style={{ color: 'var(--color-dark)', fontSize: 15, fontWeight: 700, margin: '16px 0 8px' }}>Hébergement</h3>
          <p>Application hébergée par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
          <p>Base de données hébergée par Supabase Inc., San Francisco, CA, États-Unis.</p>

          <h3 style={{ color: 'var(--color-dark)', fontSize: 15, fontWeight: 700, margin: '16px 0 8px' }}>Données personnelles</h3>
          <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ces droits, contactez-nous à l'adresse ci-dessus.</p>
          <p>Données collectées : adresse email, prénom, ville, département, niveau de jeu, photo de profil (optionnelle). Ces données sont utilisées uniquement pour le fonctionnement de l'application et ne sont pas transmises à des tiers.</p>

          <h3 style={{ color: 'var(--color-dark)', fontSize: 15, fontWeight: 700, margin: '16px 0 8px' }}>Cookies</h3>
          <p>PadelSquad utilise uniquement des cookies techniques nécessaires à l'authentification. Aucun cookie de tracking ou publicitaire n'est utilisé.</p>

          <h3 style={{ color: 'var(--color-dark)', fontSize: 15, fontWeight: 700, margin: '16px 0 8px' }}>Propriété intellectuelle</h3>
          <p>L'ensemble du contenu de l'application (textes, graphismes, logo) est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation préalable.</p>
        </div>
      </div>
    </Modal>
  )
}
