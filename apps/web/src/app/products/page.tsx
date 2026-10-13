export default function ProductsPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Catálogo de Produtos</h1>
      <p>Gerencie seus produtos, preços e integrações aqui.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
         <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', minWidth: '250px' }}>
            <h3>Camiseta Básica (PROD-1)</h3>
            <p><strong>Preço:</strong> R$ 50,00</p>
            <p><strong>Variantes:</strong> P, M, G</p>
         </div>
      </div>
    </div>
  )
}
