import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { addressApi, authApi, orderApi, userApi, wishlistApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const sections = [
  { id: "my-profile", label: "My Profile", icon: "P", path: "/profile" },
  { id: "orders", label: "Orders", icon: "O", path: "/profile/orders" },
  { id: "wishlist", label: "Wishlist", icon: "W", path: "/profile/wishlist" },
  { id: "addresses", label: "Addresses", icon: "A", path: "/profile/addresses" },
  { id: "payment-methods", label: "Payment Methods", icon: "M", path: "/profile/payment-methods" },
  { id: "notifications", label: "Notifications", icon: "N", path: "/profile/notifications" },
  { id: "change-password", label: "Change Password", icon: "S", path: "/profile/change-password" }
];

const initialProfile = {
  name: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  profileImageUrl: ""
};

const initialAddress = {
  fullName: "",
  mobileNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  defaultAddress: false
};

const initialPassword = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: ""
};

const passwordChecks = (password) => [
  { label: "8+ characters", passed: password.length >= 8 },
  { label: "Uppercase", passed: /[A-Z]/.test(password) },
  { label: "Lowercase", passed: /[a-z]/.test(password) },
  { label: "Number", passed: /\d/.test(password) },
  { label: "Special", passed: /[^A-Za-z0-9]/.test(password) }
];

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "Not added";
}

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function profileInitials(name = "") {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return initials || "SV";
}

export default function Profile() {
  const { section } = useParams();
  const activeSection = section || "my-profile";
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setStatus({ type: "", message: "" });
    setLoading(true);
    try {
      const [profileData, orderData, addressData, wishlistData] = await Promise.all([
        userApi.me(),
        orderApi.all(),
        addressApi.all(),
        wishlistApi.all()
      ]);
      setProfile(profileData);
      setOrders(orderData || []);
      setAddresses(addressData || []);
      setWishlist(wishlistData || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!sections.some((item) => item.id === activeSection)) {
    return <div className="notice">Profile section not found.</div>;
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <section className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-identity">
          {profile?.profileImageUrl ? (
            <img src={profile.profileImageUrl} alt={profile.name} />
          ) : (
            <span>{profileInitials(profile?.name)}</span>
          )}
          <div>
            <strong>{profile?.name || "ShopVerse User"}</strong>
            <small>{profile?.email || "Loading account"}</small>
          </div>
        </div>
        <nav className="profile-nav" aria-label="Profile navigation">
          {sections.map((item) => (
            <NavLink key={item.id} to={item.path} end={item.path === "/profile"}>
              <span className="material-symbol">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button type="button" onClick={handleLogout}>
            <span className="material-symbol">L</span>
            Logout
          </button>
        </nav>
      </aside>

      <div className="profile-main">
        <div className="profile-topline">
          <div>
            <span>Account dashboard</span>
            <h1>{sections.find((item) => item.id === activeSection)?.label}</h1>
          </div>
          <Link className="light-button" to="/products">Continue Shopping</Link>
        </div>

        {loading && <div className="notice">Loading profile dashboard...</div>}
        {status.message && <div className={status.type === "success" ? "success" : "error"}>{status.message}</div>}

        {!loading && profile && activeSection === "my-profile" && (
          <ProfileOverview profile={profile} onSaved={(nextProfile) => {
            setProfile(nextProfile);
            setStatus({ type: "success", message: "Profile updated successfully." });
          }} />
        )}
        {!loading && activeSection === "orders" && <OrderHistory orders={orders} />}
        {!loading && activeSection === "wishlist" && (
          <WishlistSection
            items={wishlist}
            onChanged={async () => setWishlist(await wishlistApi.all())}
          />
        )}
        {!loading && activeSection === "addresses" && (
          <AddressSection
            addresses={addresses}
            onChanged={async () => setAddresses(await addressApi.all())}
          />
        )}
        {!loading && activeSection === "payment-methods" && <PaymentMethods />}
        {!loading && activeSection === "notifications" && <Notifications />}
        {!loading && activeSection === "change-password" && <ChangePassword />}
      </div>
    </section>
  );
}

function ProfileOverview({ profile, onSaved }) {
  const { updateStoredUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    ...initialProfile,
    name: profile.name || "",
    phone: profile.phone || "",
    gender: profile.gender || "",
    dateOfBirth: profile.dateOfBirth || "",
    profileImageUrl: profile.profileImageUrl || ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const fields = [
    ["Full name", profile.name],
    ["Email address", profile.email],
    ["Phone number", profile.phone || "Not added"],
    ["Gender", profile.gender || "Not added"],
    ["Date of birth", formatDate(profile.dateOfBirth)],
    ["Account creation date", formatDate(profile.createdAt)]
  ];

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setMessage("");
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) nextErrors.phone = "Enter a valid phone number.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, profileImageUrl: "Choose a valid image file." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("profileImageUrl", reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      const saved = await userApi.updateProfile({
        ...form,
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth || null
      });
      updateStoredUser(saved);
      onSaved(saved);
      setEditing(false);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="profile-card">
      <div className="profile-hero-row">
        <div className="profile-avatar-large">
          {form.profileImageUrl ? <img src={form.profileImageUrl} alt={profile.name} /> : <span>{profileInitials(profile.name)}</span>}
        </div>
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>
        <button className="gold-button" type="button" onClick={() => setEditing((current) => !current)}>
          {editing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {!editing ? (
        <div className="profile-facts">
          {fields.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <form className="profile-form" onSubmit={submit} noValidate>
          {message && <div className="error">{message}</div>}
          <label>
            Name
            <input value={form.name} onChange={(event) => update("name", event.target.value)} />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>
          <label>
            Phone number
            <input value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            {errors.phone && <small className="field-error">{errors.phone}</small>}
          </label>
          <label>
            Gender
            <select value={form.gender} onChange={(event) => update("gender", event.target.value)}>
              <option value="">Select gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
          </label>
          <label>
            Date of birth
            <input type="date" value={form.dateOfBirth || ""} onChange={(event) => update("dateOfBirth", event.target.value)} />
          </label>
          <label className="wide-field">
            Profile image
            <input type="file" accept="image/*" onChange={handleImage} />
            {errors.profileImageUrl && <small className="field-error">{errors.profileImageUrl}</small>}
          </label>
          <button className="gold-button">Save Profile</button>
        </form>
      )}
    </div>
  );
}

function AddressSection({ addresses, onChanged }) {
  const [form, setForm] = useState(initialAddress);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function edit(address) {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName || "",
      mobileNumber: address.mobileNumber || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      postalCode: address.postalCode || "",
      defaultAddress: Boolean(address.defaultAddress)
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        await addressApi.update(editingId, form);
      } else {
        await addressApi.create(form);
      }
      setForm(initialAddress);
      setEditingId(null);
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await addressApi.remove(id);
    await onChanged();
  }

  async function setDefault(id) {
    await addressApi.setDefault(id);
    await onChanged();
  }

  return (
    <div className="profile-card">
      <div className="split-heading">
        <div>
          <h2>Address Management</h2>
          <p>Save delivery addresses and choose your default checkout address.</p>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <form className="profile-form address-profile-form" onSubmit={submit}>
        <label>
          Full Name
          <input required value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
        </label>
        <label>
          Mobile Number
          <input required value={form.mobileNumber} onChange={(event) => update("mobileNumber", event.target.value)} />
        </label>
        <label className="wide-field">
          Address Line 1
          <input required value={form.addressLine1} onChange={(event) => update("addressLine1", event.target.value)} />
        </label>
        <label className="wide-field">
          Address Line 2
          <input value={form.addressLine2} onChange={(event) => update("addressLine2", event.target.value)} />
        </label>
        <label>
          City
          <input required value={form.city} onChange={(event) => update("city", event.target.value)} />
        </label>
        <label>
          State
          <input required value={form.state} onChange={(event) => update("state", event.target.value)} />
        </label>
        <label>
          Country
          <input required value={form.country} onChange={(event) => update("country", event.target.value)} />
        </label>
        <label>
          Postal Code
          <input required value={form.postalCode} onChange={(event) => update("postalCode", event.target.value)} />
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={form.defaultAddress} onChange={(event) => update("defaultAddress", event.target.checked)} />
          Set Default Address
        </label>
        <div className="form-actions">
          <button className="gold-button">{editingId ? "Update Address" : "Add Address"}</button>
          {editingId && (
            <button type="button" className="light-button" onClick={() => {
              setEditingId(null);
              setForm(initialAddress);
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="address-list">
        {addresses.length === 0 && <div className="notice">No saved addresses yet.</div>}
        {addresses.map((address) => (
          <article className="address-tile" key={address.id}>
            <div>
              <strong>{address.fullName}</strong>
              {address.defaultAddress && <span>Default</span>}
              <p>{address.mobileNumber}</p>
              <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
              <p>{address.city}, {address.state}, {address.country} - {address.postalCode}</p>
            </div>
            <div className="row-actions">
              {!address.defaultAddress && <button className="light-button" onClick={() => setDefault(address.id)}>Set Default</button>}
              <button className="light-button" onClick={() => edit(address)}>Edit</button>
              <button className="light-button danger" onClick={() => remove(address.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function OrderHistory({ orders }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="profile-card">
      <div className="split-heading">
        <div>
          <h2>Order History</h2>
          <p>Track payment, delivery status, and purchased products.</p>
        </div>
        <span>{orders.length} orders</span>
      </div>
      {orders.length === 0 && <div className="notice">No orders yet.</div>}
      <div className="profile-table">
        {orders.map((order) => (
          <article key={order.id} className="profile-table-row">
            <div>
              <span>Order ID</span>
              <strong>#{order.id}</strong>
            </div>
            <div>
              <span>Order Date</span>
              <strong>{formatDate(order.createdAt)}</strong>
            </div>
            <div>
              <span>Total Amount</span>
              <strong>{money(order.totalAmount)}</strong>
            </div>
            <div>
              <span>Payment Status</span>
              <strong>{order.paymentStatus || "PAID"}</strong>
            </div>
            <div>
              <span>Delivery Status</span>
              <strong>{order.status}</strong>
            </div>
            <button className="light-button" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              View Order Details
            </button>
            {expanded === order.id && (
              <div className="order-detail-panel">
                <p>Deliver to: {order.shippingAddress}</p>
                {(order.items || []).map((item) => (
                  <div key={item.id}>
                    <img src={item.product.imageUrl} alt={item.product.name} />
                    <span>{item.product.name}</span>
                    <strong>{item.quantity} x {money(item.unitPrice)}</strong>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function WishlistSection({ items, onChanged }) {
  const { addToCart } = useCart();
  const [error, setError] = useState("");

  async function remove(id) {
    setError("");
    try {
      await wishlistApi.remove(id);
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  async function moveToCart(productId) {
    setError("");
    try {
      await addToCart(productId, 1);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="profile-card">
      <div className="split-heading">
        <div>
          <h2>Wishlist</h2>
          <p>Saved products you can revisit or move into the cart.</p>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {items.length === 0 && <div className="notice">Your wishlist is empty.</div>}
      <div className="wishlist-grid">
        {items.map((item) => (
          <article className="wishlist-card" key={item.id}>
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div>
              <h3>{item.product.name}</h3>
              <strong>{money(item.product.price)}</strong>
              <div className="form-actions">
                <button className="gold-button" onClick={() => moveToCart(item.product.id)}>Add to Cart</button>
                <button className="light-button danger" onClick={() => remove(item.id)}>Remove from Wishlist</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ChangePassword() {
  const [form, setForm] = useState(initialPassword);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const checks = useMemo(() => passwordChecks(form.newPassword), [form.newPassword]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStatus({ type: "", message: "" });
  }

  function validate() {
    const nextErrors = {};
    if (!form.currentPassword) nextErrors.currentPassword = "Current password is required.";
    if (!checks.every((check) => check.passed)) nextErrors.newPassword = "New password does not meet the strength rules.";
    if (form.newPassword !== form.confirmNewPassword) nextErrors.confirmNewPassword = "Confirm password must match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (!validate()) return;

    try {
      const response = await authApi.updatePassword(form);
      setForm(initialPassword);
      setStatus({ type: "success", message: response?.message || "Password updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  return (
    <form className="profile-card profile-form" onSubmit={submit}>
      <h2>Change Password</h2>
      {status.message && <div className={status.type === "success" ? "success" : "error"}>{status.message}</div>}
      <label>
        Current Password
        <input type="password" value={form.currentPassword} onChange={(event) => update("currentPassword", event.target.value)} />
        {errors.currentPassword && <small className="field-error">{errors.currentPassword}</small>}
      </label>
      <label>
        New Password
        <input type="password" value={form.newPassword} onChange={(event) => update("newPassword", event.target.value)} />
        {errors.newPassword && <small className="field-error">{errors.newPassword}</small>}
      </label>
      <div className="password-rules">
        {checks.map((check) => <span key={check.label} className={check.passed ? "passed" : ""}>{check.label}</span>)}
      </div>
      <label>
        Confirm Password
        <input type="password" value={form.confirmNewPassword} onChange={(event) => update("confirmNewPassword", event.target.value)} />
        {errors.confirmNewPassword && <small className="field-error">{errors.confirmNewPassword}</small>}
      </label>
      <button className="gold-button">Update Password</button>
    </form>
  );
}

function PaymentMethods() {
  return (
    <div className="profile-card">
      <h2>Payment Methods</h2>
      <div className="payment-methods">
        <div>
          <span className="material-symbol">C</span>
          <strong>Cards</strong>
          <p>No saved cards yet.</p>
        </div>
        <div>
          <span className="material-symbol">U</span>
          <strong>Wallets and UPI</strong>
          <p>Saved payment options will appear here.</p>
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    wishlistDrops: true
  });

  function toggle(field) {
    setSettings((current) => ({ ...current, [field]: !current[field] }));
  }

  return (
    <div className="profile-card">
      <h2>Notifications</h2>
      {[
        ["orderUpdates", "Order and delivery updates"],
        ["promotions", "Promotions and offers"],
        ["wishlistDrops", "Wishlist price drops"]
      ].map(([field, label]) => (
        <label className="setting-row" key={field}>
          <span>{label}</span>
          <input type="checkbox" checked={settings[field]} onChange={() => toggle(field)} />
        </label>
      ))}
    </div>
  );
}
