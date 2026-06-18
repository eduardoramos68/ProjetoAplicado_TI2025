document.addEventListener('DOMContentLoaded', () => {
  carregarDashboard();
});

// Variável global para armazenar a instância do gráfico de categorias
let categoriasPieChart = null;

async function carregarDashboard() {
  loading(true);
  try {
    const data = await DashboardAPI.obterDados();
    
    // 1. Preencher os cards de métricas
    preencherCards(data.cards);
    
    // 2. Renderizar categorias
    renderCategorias(data.categorias);
    
    // 3. Renderizar estoque baixo
    renderEstoqueBaixo(data.estoqueBaixo);
    
    // 4. Renderizar produtos mais caros
    renderProdutosMaisCaros(data.produtosMaisCaros);
    
  } catch (err) {
    toast('Erro ao carregar dados do dashboard: ' + err.message, 'err');
    console.error(err);
  } finally {
    loading(false);
  }
}

function preencherCards(cards) {
  document.getElementById('cardTotalProdutos').textContent = cards.totalProdutos;
  document.getElementById('cardValorEstoque').textContent = 'R$ ' + fmtPreco(cards.valorEstoque);
  document.getElementById('cardCategorias').textContent = cards.totalCategorias;
  
  if (cards.produtoMaisCaro) {
    document.getElementById('cardProdutoMaisCaro').innerHTML = `
      <div style="font-size: 20px; font-weight: 700;">R$ ${fmtPreco(cards.produtoMaisCaro.preco)}</div>
      <div style="font-size: 11px; font-weight: 500; color: var(--muted); margin-top: 3px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${esc(cards.produtoMaisCaro.nome)}">${esc(cards.produtoMaisCaro.nome)}</div>
    `;
  } else {
    document.getElementById('cardProdutoMaisCaro').textContent = '—';
  }
}

function renderCategorias(lista) {
  const canvas = document.getElementById('categoriasPieChart');
  
  if (!lista || !lista.length) {
    canvas.style.display = 'none';
    return;
  }
  
  canvas.style.display = 'block';
  
  // Destruir gráfico anterior se existir
  if (categoriasPieChart) {
    categoriasPieChart.destroy();
  }
  
  // Extrair dados para o gráfico
  const labels = lista.map(cat => esc(cat.categoria));
  const data = lista.map(cat => parseFloat(cat.porcentagem || 0));
  
  // Paleta de cores
  const colors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'
  ];
  
  const backgroundColors = colors.slice(0, lista.length);
  const borderColors = backgroundColors.map(color => color);
  
  // Criar gráfico de pizza
  const ctx = canvas.getContext('2d');
  categoriasPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              weight: 500
            },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      }
    }
  });
}

function renderEstoqueBaixo(lista) {
  const tbody = document.getElementById('estoqueBaixoTbody');
  
  if (!lista || !lista.length) {
    tbody.innerHTML = '<tr><td colspan="2" class="td-vazio" style="color: #1b6b31; font-weight: 600;">Estoque regularizado. Nenhum item baixo!</td></tr>';
    return;
  }
  
  tbody.innerHTML = lista.map(p => `
    <tr>
      <td class="td-nome" style="font-size: 13.5px;">${esc(p.nome)}</td>
      <td style="text-align: right; padding-right: 24px;">
        <span class="badge-alerta">${p.estoque}</span>
      </td>
    </tr>
  `).join('');
}

function renderProdutosMaisCaros(lista) {
  const tbody = document.getElementById('maisCarosTbody');
  
  if (!lista || !lista.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="td-vazio">Nenhum produto cadastrado.</td></tr>';
    return;
  }
  
  tbody.innerHTML = lista.map(p => `
    <tr>
      <td class="td-nome">${esc(p.nome)}</td>
      <td>${esc(p.categoria || '—')}</td>
      <td>${esc(p.marca || '—')}</td>
      <td class="td-preco">R$ ${fmtPreco(p.preco)}</td>
    </tr>
  `).join('');
}

/* ── UI Helpers ── */
function loading(s) {
  document.getElementById('loading').style.display = s ? 'flex' : 'none';
}

function toast(msg, tipo) {
  const t = document.createElement('div');
  t.className = `toast ${tipo}`;
  t.textContent = msg;
  document.getElementById('toasts').appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { 
    t.classList.remove('show'); 
    setTimeout(() => t.remove(), 280); 
  }, 3800);
}

function fmtPreco(v) {
  return Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
