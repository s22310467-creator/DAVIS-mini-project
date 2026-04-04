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
import productData from './data/products.json';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(productData.map((item) => item.category)))];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return productData;
    return productData.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const totalProducts = filteredProducts.length;
  const totalStock = filteredProducts.reduce((acc, item) => acc + item.stock, 0);
  const avgRating =
    totalProducts > 0
      ? (
          filteredProducts.reduce((acc, item) => acc + item.rating, 0) / totalProducts
        ).toFixed(1)
      : '0.0';

  const totalValue = filteredProducts
    .reduce((acc, item) => acc + item.price * item.stock, 0)
    .toLocaleString();

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
  const tableData = [...filteredProducts].slice(0, 12);

  // warna unik banyak kategori
  const generateColor = (index: number) => {
    const hue = (index * 37) % 360;
    return `hsl(${hue}, 70%, 58%)`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        {/* LEFT FILTER PANEL */}
        <aside style={styles.sidebar}>
          <div>
            <div style={styles.logo}>📦 InventoryPRO</div>
            <p style={styles.logoSub}>Inventory analytics dashboard</p>

            <div style={styles.sidebarSection}>
              <div style={styles.sidebarTitle}>Category Filter</div>
              <div style={styles.categoryList}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      ...styles.categoryButton,
                      ...(selectedCategory === cat ? styles.categoryButtonActive : {}),
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.sideStats}>
            <div style={styles.sideStatsTitle}>Selected View</div>
            <div style={styles.sideStatsValue}>{selectedCategory}</div>
            <div style={styles.sideStatsSub}>
              {totalProducts} products shown
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main style={styles.main}>
          {/* PAGE TITLE */}
          <section style={styles.hero}>
            <div>
              <h1 style={styles.pageTitle}>Inventory Dashboard</h1>
              <p style={styles.pageSubtitle}>
                Track stock, categories, prices, and inventory performance in one place.
              </p>
            </div>
          </section>

          {/* KPI */}
          <section style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={styles.kpiIcon}>📦</div>
              <div style={styles.kpiLabel}>Total Products</div>
              <div style={styles.kpiValue}>{totalProducts}</div>
              <div style={styles.kpiSub}>Products in current view</div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiIcon}>📊</div>
              <div style={styles.kpiLabel}>Total Stock</div>
              <div style={{ ...styles.kpiValue, color: '#4F46E5' }}>{totalStock}</div>
              <div style={styles.kpiSub}>Available units</div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiIcon}>⭐</div>
              <div style={styles.kpiLabel}>Average Rating</div>
              <div style={{ ...styles.kpiValue, color: '#F59E0B' }}>{avgRating}</div>
              <div style={styles.kpiSub}>Customer review score</div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiIcon}>💰</div>
              <div style={styles.kpiLabel}>Inventory Value</div>
              <div style={{ ...styles.kpiValue, color: '#10B981' }}>${totalValue}</div>
              <div style={styles.kpiSub}>Estimated total value</div>
            </div>
          </section>

          {/* CHARTS ROW 1 */}
          <section style={styles.topGrid}>
            <div style={styles.cardLarge}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Top Stock Products</h3>
                <span style={styles.cardBadge}>Top 8</span>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stockData}>
                  <CartesianGrid stroke="#EEF2F7" vertical={false} />
                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={styles.tooltip} />
                  <Bar dataKey="stock" fill="#6366F1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Category Split</h3>
                <span style={styles.cardBadge}>Live</span>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={generateColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div style={styles.legendWrap}>
                {pieData.map((item, index) => (
                  <div key={item.name} style={styles.legendItem}>
                    <span
                      style={{
                        ...styles.legendDot,
                        backgroundColor: generateColor(index),
                      }}
                    />
                    <span style={styles.legendText}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CHARTS ROW 2 */}
          <section style={styles.bottomGrid}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Highest Value Products</h3>
                <span style={styles.cardBadge}>Price</span>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#EEF2F7" vertical={false} />
                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={styles.tooltip} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#10B981"
                    fill="url(#priceFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Quick Insights</h3>
                <span style={styles.cardBadge}>Summary</span>
              </div>

              <div style={styles.insightList}>
                <div style={styles.insightItem}>
                  <div style={styles.insightDot}></div>
                  <div>
                    <div style={styles.insightTitle}>Most expensive</div>
                    <div style={styles.insightDesc}>
                      {priceData[0]?.title || '-'} — ${priceData[0]?.price || 0}
                    </div>
                  </div>
                </div>

                <div style={styles.insightItem}>
                  <div style={{ ...styles.insightDot, backgroundColor: '#10B981' }}></div>
                  <div>
                    <div style={styles.insightTitle}>Highest stock</div>
                    <div style={styles.insightDesc}>
                      {stockData[0]?.title || '-'} — {stockData[0]?.stock || 0} units
                    </div>
                  </div>
                </div>

                <div style={styles.insightItem}>
                  <div style={{ ...styles.insightDot, backgroundColor: '#F59E0B' }}></div>
                  <div>
                    <div style={styles.insightTitle}>Average rating</div>
                    <div style={styles.insightDesc}>{avgRating} stars</div>
                  </div>
                </div>

                <div style={styles.insightItem}>
                  <div style={{ ...styles.insightDot, backgroundColor: '#EF4444' }}></div>
                  <div>
                    <div style={styles.insightTitle}>Low stock items</div>
                    <div style={styles.insightDesc}>{lowStockItems} products</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section style={styles.tableCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Inventory Table</h3>
              <span style={styles.cardBadge}>Filtered</span>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>PRODUCT</th>
                    <th style={styles.th}>CATEGORY</th>
                    <th style={styles.th}>BRAND</th>
                    <th style={styles.th}>PRICE</th>
                    <th style={styles.th}>RATING</th>
                    <th style={styles.th}>STOCK</th>
                    <th style={styles.th}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item) => {
                    const status =
                      item.stock < 20 ? 'Low' : item.stock < 50 ? 'Medium' : 'Healthy';

                    return (
                      <tr key={item.id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <div style={styles.productInfo}>
                            <div style={styles.productIcon}>📦</div>
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
                        <td style={styles.td}>${item.price}</td>
                        <td style={styles.td}>⭐ {item.rating}</td>
                        <td style={styles.td}>{item.stock}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor:
                                status === 'Low'
                                  ? '#FEF2F2'
                                  : status === 'Medium'
                                  ? '#FFF7ED'
                                  : '#ECFDF5',
                              color:
                                status === 'Low'
                                  ? '#DC2626'
                                  : status === 'Medium'
                                  ? '#EA580C'
                                  : '#059669',
                            }}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    overflowX: 'hidden',
  },

  layout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    minHeight: '100vh',
    width: '100%',
  },

  sidebar: {
    background: 'linear-gradient(180deg, #0F172A 0%, #111827 100%)',
    color: 'white',
    padding: '28px 22px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },

  logo: {
    fontSize: '28px',
    fontWeight: 800,
    marginBottom: '8px',
  },

  logoSub: {
    fontSize: '13px',
    color: '#94A3B8',
    marginBottom: '32px',
  },

  sidebarSection: {
    marginTop: '20px',
  },

  sidebarTitle: {
    fontSize: '13px',
    color: '#CBD5E1',
    fontWeight: 700,
    marginBottom: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '60vh',
    overflowY: 'auto',
    paddingRight: '4px',
  },

  categoryButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#CBD5E1',
    padding: '12px 14px',
    borderRadius: '14px',
    textAlign: 'left',
    fontSize: '14px',
    cursor: 'pointer',
  },

  categoryButtonActive: {
    backgroundColor: '#1E293B',
    color: 'white',
    fontWeight: 700,
    border: '1px solid #334155',
  },

  sideStats: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '20px',
    marginTop: '24px',
  },

  sideStatsTitle: {
    color: '#94A3B8',
    fontSize: '13px',
    marginBottom: '10px',
  },

  sideStatsValue: {
    fontSize: '30px',
    fontWeight: 800,
    marginBottom: '8px',
  },

  sideStatsSub: {
    color: '#CBD5E1',
    fontSize: '13px',
  },

  main: {
    padding: '28px',
    width: '100%',
  },

  hero: {
    marginBottom: '26px',
  },

  pageTitle: {
    margin: 0,
    fontSize: '34px',
    fontWeight: 800,
    color: '#0F172A',
  },

  pageSubtitle: {
    marginTop: '8px',
    color: '#64748B',
    fontSize: '15px',
  },

  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },

  kpiCard: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
  },

  kpiIcon: {
    fontSize: '24px',
    marginBottom: '14px',
  },

  kpiLabel: {
    fontSize: '12px',
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.06em',
  },

  kpiValue: {
    fontSize: '30px',
    fontWeight: 800,
    marginTop: '10px',
    marginBottom: '8px',
  },

  kpiSub: {
    fontSize: '13px',
    color: '#94A3B8',
  },

  topGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },

  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },

  cardLarge: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
  },

  tableCard: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
    marginBottom: '30px',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 800,
    color: '#0F172A',
  },

  cardBadge: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },

  tooltip: {
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
    backgroundColor: '#fff',
  },

  legendWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px 12px',
    marginTop: '10px',
    maxHeight: '180px',
    overflowY: 'auto',
    paddingRight: '4px',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },

  legendText: {
    fontSize: '13px',
    color: '#64748B',
  },

  insightList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  insightItem: {
    display: 'flex',
    gap: '14px',
    padding: '16px',
    borderRadius: '18px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #EEF2F7',
  },

  insightDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#6366F1',
    marginTop: '5px',
    flexShrink: 0,
  },

  insightTitle: {
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '4px',
    color: '#0F172A',
  },

  insightDesc: {
    fontSize: '13px',
    color: '#64748B',
    lineHeight: 1.6,
  },

  tableWrapper: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
  },

  th: {
    textAlign: 'left',
    fontSize: '11px',
    color: '#94A3B8',
    padding: '0 16px 10px',
    letterSpacing: '0.06em',
  },

  tableRow: {
    backgroundColor: '#F8FAFC',
  },

  td: {
    padding: '18px 16px',
    borderTop: '1px solid #EEF2F7',
    borderBottom: '1px solid #EEF2F7',
    fontSize: '14px',
    color: '#334155',
  },

  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  productIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#EEF2FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },

  productTitle: {
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '4px',
  },

  productId: {
    fontSize: '12px',
    color: '#94A3B8',
  },

  categoryBadge: {
    backgroundColor: '#EEF2F7',
    color: '#475569',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
  },

  statusBadge: {
    padding: '7px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    display: 'inline-block',
  },
};

export default App;