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
    <div style={styles.page}>
      {/* ─── Background Decorations ──────────────────── */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgOrb3} />

      <div style={styles.layout} className="layout-responsive">
        {/* ─── SIDEBAR ───────────────────────────────── */}
        <aside style={styles.sidebar} className="sidebar-responsive">
          <div>
            <div style={styles.logo}>
              <Diamond size={20} style={{ color: '#7B61FF' }} />
              Inventory HnM
            </div>
            <p style={styles.logoSub}>Analytics Dashboard</p>

            <div style={styles.sidebarSection}>
              <div style={styles.sidebarTitle}>Categories</div>
              <div style={styles.categoryList}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`glass-nav-btn ${isCategoryActive(cat) ? 'active' : ''}`}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                      {categoryIconMap[cat] || <FolderOpen size={16} />}
                    </span>
                    <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                    {isCategoryActive(cat) && <span className="glass-nav-dot" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card-static" style={styles.sideStats}>
            <div style={styles.sideStatsTitle}>Active Filters</div>
            <div style={styles.sideStatsValue}>
              {isAllSelected ? 'All' : Array.from(selectedCategories).join(', ')}
            </div>
            <div style={styles.sideStatsSub}>
              {totalProducts} product{totalProducts !== 1 ? 's' : ''} · {lowStockItems} low stock
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ──────────────────────────── */}
        <main style={styles.main}>
          {/* ─── HEADER ──────────────────────────────── */}
          <section style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Inventory Dashboard</h1>
              <p style={styles.pageSubtitle}>
                Track stock, categories, prices, and inventory performance at a glance.
              </p>
            </div>
            <div style={styles.headerControls}>
              <div style={styles.searchWrapper}>
                <Search
                  size={18}
                  style={styles.searchIcon}
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
          <section style={{ marginBottom: '32px' }}>
            <div className="filter-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-tab ${isCategoryActive(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px', verticalAlign: 'middle' }}>
                    {getCategoryIcon(cat, 14)}
                  </span>
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* ─── KPI CARDS ───────────────────────────── */}
          <section style={styles.kpiGrid} className="kpi-grid-responsive">
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
                <div style={{ ...styles.kpiIcon, color: kpi.color }}>{kpi.icon}</div>
                <div style={styles.kpiLabel}>{kpi.label}</div>
                <div style={{ ...styles.kpiValue, color: kpi.color }}>{kpi.value}</div>
                <div style={styles.kpiSub}>{kpi.sub}</div>
              </div>
            ))}
          </section>

          {/* ─── CHARTS ROW ──────────────────────────── */}
          <section style={styles.chartsGrid} className="chart-grid-responsive">
            <div className="glass-card-static" style={{ padding: '28px' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Top Stock Products</h3>
                <span style={styles.cardBadge}>Top 8</span>
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
                    contentStyle={styles.tooltip}
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

            <div className="glass-card-static" style={{ padding: '28px' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Category Split</h3>
                <span style={styles.cardBadge}>Live</span>
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
                    contentStyle={styles.tooltip}
                    itemStyle={{ color: '#B3A1FF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.legendWrap}>
                {pieData.map((item, index) => (
                  <div key={item.name} style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: generateColor(index) }} />
                    <span style={styles.legendText}>{item.name}</span>
                    <span style={styles.legendCount}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── CHARTS ROW 2 ────────────────────────── */}
          <section style={styles.chartsGrid2} className="chart-grid-responsive">
            <div className="glass-card-static" style={{ padding: '28px' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Price Trend</h3>
                <span style={styles.cardBadge}>Top 8</span>
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
                    contentStyle={styles.tooltip}
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

            <div className="glass-card-static" style={{ padding: '28px' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Quick Insights</h3>
                <span style={styles.cardBadge}>Summary</span>
              </div>
              <div style={styles.insightList}>
                {[
                  { icon: <DollarSign size={18} />, title: 'Most expensive', desc: `${priceData[0]?.title || '-'} — $${priceData[0]?.price || 0}`, bg: 'rgba(123,97,255,0.1)', iconColor: '#B3A1FF' },
                  { icon: <Package size={18} />, title: 'Highest stock', desc: `${stockData[0]?.title || '-'} — ${stockData[0]?.stock || 0} units`, bg: 'rgba(52,211,153,0.1)', iconColor: '#6EE7B7' },
                  { icon: <Star size={18} />, title: 'Average rating', desc: `${avgRating} out of 5 stars`, bg: 'rgba(251,191,36,0.1)', iconColor: '#FCD34D' },
                  { icon: <AlertTriangle size={18} />, title: 'Low stock alert', desc: `${lowStockItems} product${lowStockItems !== 1 ? 's' : ''} below 20 units`, bg: 'rgba(239,68,68,0.1)', iconColor: '#FCA5A5' },
                ].map((insight) => (
                  <div key={insight.title} style={styles.insightItem}>
                    <div style={{ ...styles.insightIcon, background: insight.bg, color: insight.iconColor }}>
                      {insight.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.insightTitle}>{insight.title}</div>
                      <div style={styles.insightDesc}>{insight.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── PRODUCT GRID ────────────────────────── */}
          <section style={{ marginBottom: '40px' }}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Product Catalog</h2>
              <span style={styles.sectionCount}>{filteredProducts.length} items</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="glass-card-static" style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  <Search size={48} strokeWidth={1} color="rgba(255,255,255,0.2)" />
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>No products found</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginTop: '8px' }}>
                  Try adjusting your search or filter
                </div>
              </div>
            ) : (
              <div style={styles.productGrid} className="product-grid-responsive">
                {filteredProducts.map((item, i) => (
                  <div
                    key={item.id}
                    className="product-card animate-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="product-card-glow" />

                    {/* Card header */}
                    <div style={styles.pcHeader}>
                      <span style={styles.pcCategory}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '5px', verticalAlign: 'middle' }}>
                          {getCategoryIcon(item.category, 13)}
                        </span>
                        {item.category}
                      </span>
                      <span className={getStatusClass(item.stock)}>{getStockStatus(item.stock)}</span>
                    </div>

                    {/* Product title */}
                    <h3 style={styles.pcTitle}>{item.title}</h3>
                    <p style={styles.pcBrand}>{item.brand}</p>

                    {/* Price + Rating */}
                    <div style={styles.pcMeta}>
                      <div style={styles.pcPrice}>${item.price.toFixed(2)}</div>
                      <div className="rating-display">
                        <Star size={13} fill="#FBBF24" color="#FBBF24" />
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{item.rating.toFixed(1)}</span>
                        <div className="rating-bar-bg">
                          <div className="rating-bar-fill" style={{ width: `${(item.rating / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Stock bar */}
                    <div style={styles.pcStockRow}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Stock</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600 }}>{item.stock} units</span>
                    </div>
                    <div style={styles.pcStockBarBg}>
                      <div
                        style={{
                          ...styles.pcStockBarFill,
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
          <section className="glass-card-static" style={{ padding: '28px', marginBottom: '40px' }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Inventory Table</h3>
              <span style={styles.cardBadge}>
                {filteredProducts.length} items
              </span>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Product', 'Category', 'Brand', 'Price', 'Rating', 'Stock', 'Status'].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.slice(0, 15).map((item) => {
                    const status = getStockStatus(item.stock);
                    return (
                      <tr key={item.id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <div style={styles.productInfo}>
                            <div style={styles.productIcon}>
                              {getCategoryIcon(item.category, 18)}
                            </div>
                            <div>
                              <div style={styles.productTitle}>{item.title}</div>
                              <div style={styles.productId}>ID: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>{item.category}</span>
                        </td>
                        <td style={styles.td}>{item.brand}</td>
                        <td style={{ ...styles.td, fontWeight: 600, color: '#34D399' }}>
                          ${item.price.toFixed(2)}
                        </td>
                        <td style={styles.td}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={13} fill="#FBBF24" color="#FBBF24" />
                            {item.rating.toFixed(1)}
                          </span>
                        </td>
                        <td style={styles.td}>{item.stock}</td>
                        <td style={styles.td}>
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
          <footer style={styles.footer}>
            <span>Inventory HnM Dashboard</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span>{productData.length} total products</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span>{categories.length - 1} categories</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

// ─── STYLES ─────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: '100vw',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 30%, #0a0a1a 60%, #111128 100%)',
    overflowX: 'hidden',
    position: 'relative',
  },

  // Background decoration orbs
  bgOrb1: {
    position: 'fixed',
    top: '-10%',
    right: '-5%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(120,100,255,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgOrb2: {
    position: 'fixed',
    bottom: '-15%',
    left: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgOrb3: {
    position: 'fixed',
    top: '40%',
    left: '30%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  layout: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },

  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '260px',
    height: '100vh',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderRight: '1px solid rgba(255,255,255,0.04)',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto',
    zIndex: 10,
  },

  logo: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '6px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '-0.02em',
  },

  logoSub: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: '40px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },

  sidebarSection: {
    marginTop: '8px',
  },

  sidebarTitle: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 600,
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },

  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  sideStats: {
    padding: '24px',
    marginTop: '24px',
    textAlign: 'center',
  },

  sideStatsTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  sideStatsValue: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#fff',
    textTransform: 'capitalize',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },

  sideStatsSub: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '12px',
  },

  // ─── Main ─────────────────────────────────
  main: {
    padding: '32px 40px',
    marginLeft: '260px',
    width: 'calc(100% - 260px)',
    minWidth: 0,
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    gap: '24px',
    flexWrap: 'wrap',
  },

  pageTitle: {
    margin: 0,
    fontSize: '30px',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
  },

  pageSubtitle: {
    marginTop: '8px',
    color: 'rgba(255,255,255,0.35)',
    fontSize: '14px',
    fontWeight: 400,
  },

  headerControls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  searchWrapper: {
    position: 'relative',
    minWidth: '280px',
  },

  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    zIndex: 2,
  },

  // ─── KPI Grid ─────────────────────────────
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },

  kpiIcon: {
    marginBottom: '14px',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.04)',
  },

  kpiLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 500,
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  kpiValue: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#FFF',
    marginBottom: '4px',
    letterSpacing: '-0.02em',
  },

  kpiSub: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.25)',
    fontWeight: 400,
  },

  // ─── Charts ───────────────────────────────
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },

  chartsGrid2: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: '-0.01em',
  },

  cardBadge: {
    backgroundColor: 'rgba(120,100,255,0.12)',
    color: 'rgba(180,160,255,0.9)',
    padding: '5px 14px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },

  tooltip: {
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
    backgroundColor: 'rgba(20, 20, 40, 0.92)',
    backdropFilter: 'blur(20px)',
    padding: '12px 16px',
  },

  // ─── Legend ───────────────────────────────
  legendWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '16px',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 0',
  },

  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },

  legendText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'capitalize',
    flex: 1,
  },

  legendCount: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 600,
  },

  // ─── Insights ─────────────────────────────
  insightList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  insightItem: {
    display: 'flex',
    gap: '14px',
    padding: '14px 16px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.03)',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },

  insightIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  insightTitle: {
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '3px',
    color: 'rgba(255,255,255,0.85)',
  },

  insightDesc: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
  },

  // ─── Product Grid ─────────────────────────
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '-0.01em',
  },

  sectionCount: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 500,
  },

  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },

  pcHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  pcCategory: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'capitalize',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  },

  pcTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },

  pcBrand: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: '20px',
  },

  pcMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  pcPrice: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#34D399',
    letterSpacing: '-0.02em',
  },

  pcStockRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },

  pcStockBarBg: {
    width: '100%',
    height: '4px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '2px',
    overflow: 'hidden',
  },

  pcStockBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // ─── Table ────────────────────────────────
  tableWrapper: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    textAlign: 'left',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    padding: '0 16px 16px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },

  tableRow: {
    transition: 'background-color 0.2s ease',
  },

  td: {
    padding: '18px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
  },

  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  productIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.04)',
  },

  productTitle: {
    fontWeight: 600,
    color: '#FFF',
    marginBottom: '3px',
    fontSize: '14px',
  },

  productId: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.25)',
  },

  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.5)',
    padding: '5px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'capitalize',
  },

  // ─── Footer ───────────────────────────────
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 0',
    color: 'rgba(255,255,255,0.2)',
    fontSize: '12px',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    marginTop: '20px',
  },
};

export default App;