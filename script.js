
function navigate(pageId) {
  const pages = document.querySelectorAll('.page');
  const targetPage = document.getElementById(pageId);

  pages.forEach((page) => {
    if (page === targetPage) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  // Ativa link atual
  document.querySelectorAll('nav a').forEach((link) => {
    link.classList.remove('active');
  });

  const currentLink = document.querySelector(`nav a[href="#${pageId}"]`);
  if (currentLink) currentLink.classList.add('active');

  // Voltar para o topo ao trocar de página
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function toggleMenu() {
  const nav = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  nav.classList.toggle('show');
  overlay.classList.toggle('show');
  document.body.classList.toggle('menu-open');
}

function closeMenu() {
  const nav = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  nav.classList.remove('show');
  overlay.classList.remove('show');
  document.body.classList.remove('menu-open');
}

document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});