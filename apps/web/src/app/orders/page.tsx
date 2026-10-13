export default function OrdersPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard de Pedidos</h1>
      <p>Acompanhe os pedidos gerados pelos Agentes IA.</p>
      
      <table style={{ width: '100%', marginTop: '2rem', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '0.5rem' }}>ID</th>
            <th style={{ padding: '0.5rem' }}>Cliente</th>
            <th style={{ padding: '0.5rem' }}>Status</th>
            <th style={{ padding: '0.5rem' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>#1024</td>
            <td style={{ padding: '0.5rem' }}>11999999999</td>
            <td style={{ padding: '0.5rem' }}>Aguardando Pagamento</td>
            <td style={{ padding: '0.5rem' }}>R$ 100,00</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
