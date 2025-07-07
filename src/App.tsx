
import React, { useState } from 'react';
import { useReviewedPRs } from './hooks/useReviewedPRs';

// URLクエリパラメータからtokenを取得する関数
function getTokenFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token') || '';
}

const App: React.FC = () => {
  const [token, setToken] = useState(getTokenFromQuery());
  const { prs, loading, error } = useReviewedPRs(token);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrs = prs.filter((pr) =>
    pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.repository_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPrs = filteredPrs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

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
