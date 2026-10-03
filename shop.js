const shopGrid = document.getElementById("shopGrid");
const shopLoading = document.getElementById("shopLoading");
const shopEmpty = document.getElementById("shopEmpty");

function money(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function whatsappLink(product) {
  const message =
    `Hi FLARENO WRITE, I want to buy this article:\n\n` +
    `Title: ${product.title}\n` +
    `Price: ${money(product.price)}\n\n` +
    `Please send me the payment details.`;

  return `https://wa.me/918838969397?text=${encodeURIComponent(message)}`;
}

function productCard(product) {
  const article = document.createElement("article");
  article.className = "shop-card";

  const tag = document.createElement("span");
  tag.className = "shop-tag";
  tag.textContent = "READY ARTICLE";

  const title = document.createElement("h2");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.textContent = product.description;

  const price = document.createElement("div");
  price.className = "shop-price";
  price.textContent = money(product.price);

  const note = document.createElement("p");
  note.className = "shop-card-note";
  note.textContent = "Full PDF is sent after payment confirmation.";

  const actions = document.createElement("div");
  actions.className = "shop-actions";

  const buy = document.createElement("a");
  buy.className = "button button-primary";
  buy.href = whatsappLink(product);
  buy.target = "_blank";
  buy.rel = "noopener";
  buy.textContent = "Buy on WhatsApp";

  actions.appendChild(buy);

  article.append(tag, title, description, price, note, actions);
  return article;
}

async function loadProducts() {
  const { data: products, error } = await supabaseClient
    .from("products")
    .select("id, title, description, price, pdf_url, created_at")
    .order("created_at", { ascending: false });

  shopLoading.hidden = true;

  if (error) {
    console.error(error);
    shopEmpty.hidden = false;
    shopEmpty.textContent = "Articles could not load right now. Please try again later.";
    return;
  }

  if (!products || products.length === 0) {
    shopEmpty.hidden = false;
    return;
  }

  products.forEach((product) => {
    shopGrid.appendChild(productCard(product));
  });
}

loadProducts();
