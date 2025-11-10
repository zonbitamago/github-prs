
import React, { useState, useEffect } from 'react';
import { useReviewedPRs } from './hooks/useReviewedPRs';

// URLクエリパラメータからtokenを取得する関数
function getTokenFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token') || '';
}

// URLクエリパラメータからstatusを取得する関数
function getStatusesFromQuery(): Set<string> {
  const params = new URLSearchParams(window.location.search);
  const statuses = params.getAll('status');
  return new Set(statuses);
}

const App: React.FC = () => {
  const [token, setToken] = useState(getTokenFromQuery());
  const { prs, loading, error } = useReviewedPRs(token);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(getStatusesFromQuery());

  // 利用可能なstatusのリストを取得
  const availableStatuses = Array.from(new Set(prs.map((pr) => pr.state)));

  // statusフィルタとテキスト検索フィルタを組み合わせる
  const filteredPrs = prs.filter((pr) => {
    const matchesSearch = pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.repository_url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(pr.state);
    return matchesSearch && matchesStatus;
  });

  const sortedPrs = filteredPrs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // statusフィルタのトグル機能
  const toggleStatus = (status: string) => {
    const newStatuses = new Set(selectedStatuses);
    if (newStatuses.has(status)) {
      newStatuses.delete(status);
    } else {
      newStatuses.add(status);
    }
    setSelectedStatuses(newStatuses);
  };

  // 全てのstatusをクリア
  const clearStatusFilters = () => {
    setSelectedStatuses(new Set());
  };

  // selectedStatusesが変更されたらURLクエリパラメータを更新
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // 既存のstatusパラメータを削除
    params.delete('status');
    // 新しいstatusを追加
    selectedStatuses.forEach((status) => {
      params.append('status', status);
    });
    // URLを更新(ページリロードなし)
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedStatuses]);

  const copyAllLinks = () => {
    const links = sortedPrs.map((pr) => pr.html_url).join('\n');
    navigator.clipboard.writeText(links).then(() => {
      alert('All PR links copied to clipboard!');
    });
  };

  return (
    <div className="App">
      <h1>GitHub PR Viewer</h1>
      <input
        type="text"
        placeholder="Enter your GitHub token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Search PRs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginTop: '1rem', padding: '0.5rem', width: '100%' }}
      />

      {/* Statusフィルタセクション */}
      <div style={{ margin: '1rem 0', textAlign: 'left' }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Filter by Status:</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {availableStatuses.map((status) => (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedStatuses.has(status) ? '#4CAF50' : '#f0f0f0',
                color: selectedStatuses.has(status) ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {status} ({prs.filter((pr) => pr.state === status).length})
            </button>
          ))}
          {selectedStatuses.size > 0 && (
            <button
              onClick={clearStatusFilters}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          Showing {sortedPrs.length} of {prs.length} PRs
        </div>
      </div>

      <button onClick={copyAllLinks} style={{ margin: '1rem 0', padding: '0.5rem 1rem' }}>
        Copy All Links
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Repository</th>
              <th>PR Number</th>
              <th>Status</th>
              <th>Title</th>
              <th>URL</th>
              <th>Last Reviewed</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrs.map((pr) => (
              <tr key={pr.id}>
                <td>
                  <a href={pr.repository_url} target="_blank" rel="noopener noreferrer">
                    {pr.repository_url.split('/').pop()}
                  </a>
                </td>
                <td>{pr.number}</td>
                <td>
                  <span className={`status-label ${pr.state}`}>{pr.state}</span>
                </td>
                <td>{pr.title}</td>
                <td>
                  <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                    <button>Open Link</button>
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(pr.html_url)}
                  >
                    Copy Link
                  </button>
                </td>
                <td>{new Date(pr.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
