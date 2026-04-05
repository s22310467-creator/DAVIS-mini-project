import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Globe,
  Sparkles,
  Zap,
  Shirt,
  ShoppingCart,
  Armchair,
  Dumbbell,
  FolderOpen,
  Package,
  BarChart3,
  Star,
  DollarSign,
  AlertTriangle,
  Search,
  Diamond,
} from 'lucide-react';
import productData from './data/products.json';
import './App.css';

// ─── Category icon map (Lucide components) ─────────────────
const categoryIconMap: Record<string, React.ReactNode> = {
  All: <Globe size={16} />,
  beauty: <Sparkles size={16} />,
  electronics: <Zap size={16} />,
  fashion: <Shirt size={16} />,
  groceries: <ShoppingCart size={16} />,
  furniture: <Armchair size={16} />,
  sports: <Dumbbell size={16} />,
};

const getCategoryIcon = (cat: string, size = 16) => {
  const icons: Record<string, React.ReactNode> = {
    All: <Globe size={size} />,
    beauty: <Sparkles size={size} />,
    electronics: <Zap size={size} />,
    fashion: <Shirt size={size} />,
    groceries: <ShoppingCart size={size} />,
    furniture: <Armchair size={size} />,
    sports: <Dumbbell size={size} />,
  };
  return icons[cat] || <FolderOpen size={size} />;
};

// ─── Color palette for charts ──────────────────────────────
const CHART_COLORS = [
  '#7B61FF', '#60A5FA', '#F472B6', '#FBBF24',
  '#34D399', '#FB923C', '#A78BFA', '#38BDF8',
];

const generateColor = (index: number) => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

// ─── Tooltip style (must remain inline for recharts) ───────
const tooltipStyle: React.CSSProperties = {
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
  backgroundColor: 'rgba(20, 20, 40, 0.92)',
  backdropFilter: 'blur(20px)',
  padding: '12px 16px',
};

// ─── Sort options ──────────────────────────────────────────
type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'stock-desc' | 'stock-asc';

const App = () => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('default');

  const categories = ['All', ...Array.from(new Set(productData.map((item) => item.category)))];

  // Toggle multi-select: 'All' clears selection, others toggle individually
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      if (cat === 'All') {
        return new Set(); // clear = show all
      }
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const isAllSelected = selectedCategories.size === 0;
  const isCategoryActive = (cat: string) =>
    cat === 'All' ? isAllSelected : selectedCategories.has(cat);

  const filteredProducts = useMemo(() => {
    let result = isAllSelected
      ? [...productData]
      : productData.filter((item) => selectedCategories.has(item.category));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': result.sort((a, b) => b.rating - a.rating); break;
      case 'stock-desc': result.sort((a, b) => b.stock - a.stock); break;
      case 'stock-asc': result.sort((a, b) => a.stock - b.stock); break;
    }

    return result;
  }, [selectedCategories, isAllSelected, searchQuery, sortBy]);

  const totalProducts = filteredProducts.length;
  const totalStock = filteredProducts.reduce((acc, item) => acc + item.stock, 0);
  const avgRating =
    totalProducts > 0
      ? (filteredProducts.reduce((acc, item) => acc + item.rating, 0) / totalProducts).toFixed(1)
      : '0.0';
  const totalValue = filteredProducts
    .reduce((acc, item) => acc + item.price * item.stock, 0)
    .toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const lowStockItems = filteredProducts.filter((item) => item.stock < 20).length;

  const categoryMap = filteredProducts.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  const stockData = [...filteredProducts].sort((a, b) => b.stock - a.stock).slice(0, 8);
  const priceData = [...filteredProducts].sort((a, b) => b.price - a.price).slice(0, 8);

  const getStockStatus = (stock: number) =>
    stock < 20 ? 'Low' : stock < 50 ? 'Medium' : 'Healthy';

  const getStatusClass = (stock: number) =>
    stock < 20 ? 'status-low' : stock < 50 ? 'status-medium' : 'status-healthy';

  return (
    <div className="page">
      {/* ─── Background Decorations ──────────────────── */}
      <div className="bg-orb-1" />
      <div className="bg-orb-2" />
      <div className="bg-orb-3" />

      <div className="layout layout-responsive">
        {/* ─── SIDEBAR ───────────────────────────────── */}
        <aside className="sidebar sidebar-responsive">
          <div>
            <div className="logo">
              <Diamond size={20} style={{ color: '#7B61FF' }} />
              NEBULA
            </div>
            <p className="logo-sub">Analytics Dashboard</p>

            <div className="sidebar-section">
              <div className="sidebar-title">Categories</div>
              <div className="category-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`glass-nav-btn ${isCategoryActive(cat) ? 'active' : ''}`}
                  >
                    <span className="nav-icon-wrap">
                      {categoryIconMap[cat] || <FolderOpen size={16} />}
                    </span>
                    <span className="nav-label">{cat}</span>
                    {isCategoryActive(cat) && <span className="glass-nav-dot" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card-static side-stats">
            <div className="side-stats-title">Active Filters</div>
            <div className="side-stats-value">
              {isAllSelected ? 'All' : Array.from(selectedCategories).join(', ')}
            </div>
            <div className="side-stats-sub">
              {totalProducts} product{totalProducts !== 1 ? 's' : ''} · {lowStockItems} low stock
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ──────────────────────────── */}
        <main className="main-content">
          {/* ─── HEADER ──────────────────────────────── */}
          <section className="header">
            <div>
              <h1 className="page-title">Inventory Dashboard</h1>
              <p className="page-subtitle">
                Track stock, categories, prices, and inventory performance at a glance.
              </p>
            </div>
            <div className="header-controls">
              <div className="search-wrapper">
                <Search
                  size={18}
                  className="search-icon"
                  strokeWidth={2}
                  color="rgba(255,255,255,0.35)"
                />
                <input
                  className="glass-search"
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="glass-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating-desc">Top Rated</option>
                <option value="stock-desc">Most Stock</option>
                <option value="stock-asc">Least Stock</option>
              </select>
            </div>
          </section>

          {/* ─── CATEGORY TABS ───────────────────────── */}
          <section className="filter-tabs-section">
            <div className="filter-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-tab ${isCategoryActive(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <span className="filter-tab-icon">
                    {getCategoryIcon(cat, 14)}
                  </span>
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* ─── KPI CARDS ───────────────────────────── */}
          <section className="kpi-grid kpi-grid-responsive">
            {[
              { icon: <Package size={20} strokeWidth={1.5} />, label: 'Total Products', value: totalProducts.toString(), color: '#7B61FF', sub: 'In current view' },
              { icon: <BarChart3 size={20} strokeWidth={1.5} />, label: 'Total Stock', value: totalStock.toLocaleString(), color: '#60A5FA', sub: 'Available units' },
              { icon: <Star size={20} strokeWidth={1.5} />, label: 'Avg Rating', value: avgRating, color: '#FBBF24', sub: 'Customer score' },
              { icon: <DollarSign size={20} strokeWidth={1.5} />, label: 'Inventory Value', value: `$${totalValue}`, color: '#34D399', sub: 'Estimated value' },
            ].map((kpi, i) => (
              <div
                key={kpi.label}
                className="kpi-card animate-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="kpi-icon" style={{ color: kpi.color }}>{kpi.icon}</div>
                <div className="kpi-label">{kpi.label}</div>
                <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="kpi-sub">{kpi.sub}</div>
              </div>
            ))}
          </section>

          {/* ─── CHARTS ROW ──────────────────────────── */}
          <section className="charts-grid chart-grid-responsive">
            <div className="glass-card-static chart-panel">
              <div className="card-header">
                <h3 className="card-title">Top Stock Products</h3>
                <span className="card-badge">Top 8</span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stockData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                    itemStyle={{ color: '#B3A1FF' }}
                  />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7B61FF" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="stock" fill="url(#barGrad)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card-static chart-panel">
              <div className="card-header">
                <h3 className="card-title">Category Split</h3>
                <span className="card-badge">Live</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={generateColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: '#B3A1FF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-wrap">
                {pieData.map((item, index) => (
                  <div key={item.name} className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: generateColor(index) }} />
                    <span className="legend-text">{item.name}</span>
                    <span className="legend-count">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── CHARTS ROW 2 ────────────────────────── */}
          <section className="charts-grid-2 chart-grid-responsive">
            <div className="glass-card-static chart-panel">
              <div className="card-header">
                <h3 className="card-title">Price Trend</h3>
                <span className="card-badge">Top 8</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                    itemStyle={{ color: '#6EE7B7' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#34D399"
                    fill="url(#priceFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card-static chart-panel">
              <div className="card-header">
                <h3 className="card-title">Quick Insights</h3>
                <span className="card-badge">Summary</span>
              </div>
              <div className="insight-list">
                {[
                  { icon: <DollarSign size={18} />, title: 'Most expensive', desc: `${priceData[0]?.title || '-'} — $${priceData[0]?.price || 0}`, bg: 'rgba(123,97,255,0.1)', iconColor: '#B3A1FF' },
                  { icon: <Package size={18} />, title: 'Highest stock', desc: `${stockData[0]?.title || '-'} — ${stockData[0]?.stock || 0} units`, bg: 'rgba(52,211,153,0.1)', iconColor: '#6EE7B7' },
                  { icon: <Star size={18} />, title: 'Average rating', desc: `${avgRating} out of 5 stars`, bg: 'rgba(251,191,36,0.1)', iconColor: '#FCD34D' },
                  { icon: <AlertTriangle size={18} />, title: 'Low stock alert', desc: `${lowStockItems} product${lowStockItems !== 1 ? 's' : ''} below 20 units`, bg: 'rgba(239,68,68,0.1)', iconColor: '#FCA5A5' },
                ].map((insight) => (
                  <div key={insight.title} className="insight-item">
                    <div className="insight-icon" style={{ background: insight.bg, color: insight.iconColor }}>
                      {insight.icon}
                    </div>
                    <div className="insight-body">
                      <div className="insight-title">{insight.title}</div>
                      <div className="insight-desc">{insight.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── PRODUCT GRID ────────────────────────── */}
          <section className="product-section">
            <div className="section-header">
              <h2 className="section-title">Product Catalog</h2>
              <span className="section-count">{filteredProducts.length} items</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="glass-card-static empty-state">
                <div className="empty-state-icon">
                  <Search size={48} strokeWidth={1} color="rgba(255,255,255,0.2)" />
                </div>
                <div className="empty-state-title">No products found</div>
                <div className="empty-state-desc">
                  Try adjusting your search or filter
                </div>
              </div>
            ) : (
              <div className="product-grid product-grid-responsive">
                {filteredProducts.map((item, i) => (
                  <div
                    key={item.id}
                    className="product-card animate-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="product-card-glow" />

                    {/* Card header */}
                    <div className="pc-header">
                      <span className="pc-category">
                        <span className="pc-category-icon">
                          {getCategoryIcon(item.category, 13)}
                        </span>
                        {item.category}
                      </span>
                      <span className={getStatusClass(item.stock)}>{getStockStatus(item.stock)}</span>
                    </div>

                    {/* Product title */}
                    <h3 className="pc-title">{item.title}</h3>
                    <p className="pc-brand">{item.brand}</p>

                    {/* Price + Rating */}
                    <div className="pc-meta">
                      <div className="pc-price">${item.price.toFixed(2)}</div>
                      <div className="rating-display">
                        <Star size={13} fill="#FBBF24" color="#FBBF24" />
                        <span className="pc-rating-value">{item.rating.toFixed(1)}</span>
                        <div className="rating-bar-bg">
                          <div className="rating-bar-fill" style={{ width: `${(item.rating / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Stock bar */}
                    <div className="pc-stock-row">
                      <span className="pc-stock-label">Stock</span>
                      <span className="pc-stock-value">{item.stock} units</span>
                    </div>
                    <div className="pc-stock-bar-bg">
                      <div
                        className="pc-stock-bar-fill"
                        style={{
                          width: `${Math.min((item.stock / 200) * 100, 100)}%`,
                          background: item.stock < 20
                            ? 'linear-gradient(90deg, #EF4444, #F87171)'
                            : item.stock < 50
                              ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                              : 'linear-gradient(90deg, #7B61FF, #A78BFA)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ─── TABLE ───────────────────────────────── */}
          <section className="glass-card-static table-section">
            <div className="card-header">
              <h3 className="card-title">Inventory Table</h3>
              <span className="card-badge">
                {filteredProducts.length} items
              </span>
            </div>

            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    {['Product', 'Category', 'Brand', 'Price', 'Rating', 'Stock', 'Status'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.slice(0, 15).map((item) => {
                    const status = getStockStatus(item.stock);
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="product-info">
                            <div className="product-icon">
                              {getCategoryIcon(item.category, 18)}
                            </div>
                            <div>
                              <div className="product-title">{item.title}</div>
                              <div className="product-id">ID: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-badge">{item.category}</span>
                        </td>
                        <td>{item.brand}</td>
                        <td className="td-price">
                          ${item.price.toFixed(2)}
                        </td>
                        <td>
                          <span className="rating-inline">
                            <Star size={13} fill="#FBBF24" color="#FBBF24" />
                            {item.rating.toFixed(1)}
                          </span>
                        </td>
                        <td>{item.stock}</td>
                        <td>
                          <span className={getStatusClass(item.stock)}>{status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ─── FOOTER ──────────────────────────────── */}
          <footer className="footer">
            <span>Nebula Inventory Dashboard.</span>
            <span>Made by Vallerian & Marshanda</span>
            <span className="footer-dot">·</span>
            <span>{productData.length} total products</span>
            <span className="footer-dot">·</span>
            <span>{categories.length - 1} categories</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;