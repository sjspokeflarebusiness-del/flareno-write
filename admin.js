const BUCKET_NAME = "article-pdfs";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const loginPanel = document.getElementById("loginPanel");
const adminDashboard = document.getElementById("adminDashboard");
const loginForm = document.getElementById("loginForm");
const productForm = document.getElementById("productForm");
const loginMessage = document.getElementById("loginMessage");
const productMessage = document.getElementById("productMessage");
const publishButton = document.getElementById("publishButton");
const logoutButton = document.getElementById("logoutButton");
const adminProductList = document.getElementById("adminProductList");

function setMessage(element, text, isError = false) {
  element.textContent = text;
  element.classList.toggle("is-error", isError);
  element.classList.toggle("is-success", !isError && Boolean(text));
}

function safeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

function showAdmin() {
  loginPanel.hidden = true;
  adminDashboard.hidden = false;
  loadAdminProducts();
}

function showLogin() {
  adminDashboard.hidden = true;
  loginPanel.hidden = false;
  loginForm.reset();
  productForm.reset();
  setMessage(loginMessage, "");
  setMessage(productMessage, "");
}

async function checkSession() {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    showAdmin();
  } else {
    showLogin();
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(loginMessage, "Signing in...");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setMessage(loginMessage, error.message, true);
    return;
  }

  setMessage(loginMessage, "");
  showAdmin();
});

logoutButton.addEventListener("click", async () => {
  await supabaseClient.auth.signOut({ scope: "local" });
  showLogin();
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(productMessage, "");

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = Number(document.getElementById("price").value);
  const file = document.getElementById("pdf").files[0];

  if (!file || file.type !== "application/pdf") {
    setMessage(productMessage, "Please choose a PDF file.", true);
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setMessage(productMessage, "PDF must be smaller than 10 MB.", true);
    return;
  }

  publishButton.disabled = true;
  publishButton.textContent = "Uploading...";
  setMessage(productMessage, "Uploading your PDF safely...");

  const filePath = `articles/${Date.now()}-${safeFileName(file.name)}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: "application/pdf",
      upsert: false
    });

  if (uploadError) {
    publishButton.disabled = false;
    publishButton.textContent = "Upload & Publish";
    setMessage(productMessage, uploadError.message, true);
    return;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  const pdfUrl = publicUrlData.publicUrl;

  const { error: databaseError } = await supabaseClient
    .from("products")
    .insert({
      title,
      description,
      price,
      pdf_url: pdfUrl
    });

  publishButton.disabled = false;
  publishButton.textContent = "Upload & Publish";

  if (databaseError) {
    await supabaseClient.storage.from(BUCKET_NAME).remove([filePath]);
    setMessage(
      productMessage,
      `PDF uploaded, but product could not be saved: ${databaseError.message}`,
      true
    );
    return;
  }

  productForm.reset();
  setMessage(productMessage, "Article published successfully.");
  loadAdminProducts();
});

function productItem(product) {
  const item = document.createElement("article");
  item.className = "admin-product-item";

  const details = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = product.title;

  const price = document.createElement("span");
  price.textContent = `₹${Number(product.price).toLocaleString("en-IN")}`;

  details.append(title, price);

  const deleteButton = document.createElement("button");
  deleteButton.className = "admin-delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", async () => {
    const okay = window.confirm(`Delete "${product.title}" from the shop?`);

    if (!okay) return;

    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    const { error } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(`Could not delete this product: ${error.message}`);
      deleteButton.disabled = false;
      deleteButton.textContent = "Delete";
      return;
    }

    loadAdminProducts();
  });

  item.append(details, deleteButton);
  return item;
}

async function loadAdminProducts() {
  adminProductList.innerHTML = "<p class='admin-list-loading'>Loading your articles...</p>";

  const { data: products, error } = await supabaseClient
    .from("products")
    .select("id, title, price, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    adminProductList.innerHTML =
      "<p class='admin-list-loading'>Could not load products.</p>";
    return;
  }

  adminProductList.innerHTML = "";

  if (!products || products.length === 0) {
    adminProductList.innerHTML =
      "<p class='admin-list-loading'>No articles published yet.</p>";
    return;
  }

  products.forEach((product) => {
    adminProductList.appendChild(productItem(product));
  });
}

checkSession();
