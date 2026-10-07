const cart = [];
const $ = (selector) => document.querySelector(selector);
const cartDrawer = $('#cart-drawer');
const overlay = $('#overlay');
const toast = $('#toast');

function money(value) { return value.toFixed(2); }

function updateCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $('#cart-count').textContent = itemCount;
  $('#drawer-count').textContent = itemCount;
  $('#cart-total').textContent = money(total);
  const items = $('#cart-items');
  if (!cart.length) {
    items.innerHTML = '<div class="empty-cart">Your bag is ready for something unusual.</div>';
    return;
  }
  items.innerHTML = cart.map((item, index) => `
    <div class="cart-line">
      <div class="cart-swatch" style="background:linear-gradient(130deg,#182010,${item.color},#142106)"></div>
      <div class="cart-line-info"><b>${item.name}</b><small>$${money(item.price)} / can</small>
        <div class="quantity"><button aria-label="Remove one ${item.name}" data-change="-1" data-index="${index}">−</button><span>${item.quantity}</span><button aria-label="Add one ${item.name}" data-change="1" data-index="${index}">+</button></div>
      </div>
      <button class="cart-remove" aria-label="Remove ${item.name}" data-remove="${index}">×</button>
    </div>`).join('');
}

function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity: 1});
  updateCart();
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelectorAll('.product-card').forEach(card => {
  card.querySelector('.add-button').addEventListener('click', () => {
    addToCart({name: card.dataset.name, price: Number(card.dataset.price), color: card.dataset.color});
  });
});

$('#cart-items').addEventListener('click', event => {
  const index = Number(event.target.dataset.index);
  if (event.target.dataset.remove !== undefined) cart.splice(index, 1);
  if (event.target.dataset.change) {
    cart[index].quantity += Number(event.target.dataset.change);
    if (cart[index].quantity === 0) cart.splice(index, 1);
  }
  updateCart();
});

function setCart(open) {
  cartDrawer.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}
$('#open-cart').addEventListener('click', () => setCart(true));
$('#close-cart').addEventListener('click', () => setCart(false));
overlay.addEventListener('click', () => setCart(false));

$('#checkout').addEventListener('click', () => {
  if (!cart.length) { toast.querySelector('b').textContent = 'Your bag is empty'; toast.querySelector('small').textContent = 'Choose a flavor first.'; toast.classList.add('show'); return; }
  toast.querySelector('b').textContent = 'Checkout secured';
  toast.querySelector('small').textContent = 'A real checkout would open here.';
  toast.classList.add('show'); setCart(false);
});

const film = $('#film-modal');
$('#play-film').addEventListener('click', () => { film.classList.add('show'); film.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; });
$('#close-film').addEventListener('click', () => { film.classList.remove('show'); film.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; });
$('#pause-film').addEventListener('click', event => { event.target.textContent = event.target.textContent === 'Pause film' ? 'Resume film' : 'Pause film'; $('.film-orb').style.animationPlayState = event.target.textContent === 'Resume film' ? 'paused' : 'running'; });

$('#signup-form').addEventListener('submit', event => { event.preventDefault(); event.currentTarget.innerHTML = '<div style="padding:13px;color:#b6ff00;font-weight:700">You are officially on the list. ✦</div>'; });
$('.sound-button').addEventListener('click', (event) => { event.currentTarget.classList.toggle('on'); event.currentTarget.style.color = event.currentTarget.classList.contains('on') ? '#b6ff00' : ''; });

updateCart();
