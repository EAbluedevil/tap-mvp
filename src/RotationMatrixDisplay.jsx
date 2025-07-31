/*
© 2025 Waking Digital Solutions. All rights reserved.
This source code is proprietary and confidential.
Unauthorized copying, distribution, modification, or use is strictly prohibited.
*/

import { useEffect, useState } from 'react';

function RotationMatrixDisplay({ day }) {
  const [matrix, setMatrix] = useState([]);
  const [officerMap, setOfficerMap] = useState({});
  const [leadOverrides, setLeadOverrides] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://tap-backend-1.onrender.com/api/rotation?day=${day}`)
      .then(res => res.json())
      .then(data => {
        const rotation = data.rotation;

        const tempMap = {};
        const overrideMap = {};

        rotation.forEach((block, blockIndex) => {
          block.forEach(({ name, post, isLeadOverride }) => {
            if (!tempMap[name]) tempMap[name] = Array(rotation.length).fill('');
            tempMap[name][blockIndex] = post;

            if (isLeadOverride) {
              if (!overrideMap[name]) overrideMap[name] = new Set();
              overrideMap[name].add(blockIndex);
            }
          });
        });

        setOfficerMap(tempMap);
        setLeadOverrides(overrideMap);
        setMatrix(rotation);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(true);
      });
  }, [day]);

  const blockLabels = matrix.map((_, i) => {
  const hour = 11 + Math.floor(i / 2);
  const min = i % 2 === 0 ? '00' : '30';
  const nextHour = min === '00' ? hour : hour + 1;
  const nextMin = min === '00' ? '30' : '00';
  return `${hour}:${min}–${nextHour}:${nextMin}`;
});

  const getCellStyle = (officer, blockIndex, post) => {
    const isOverride = leadOverrides[officer]?.has(blockIndex);
    const style = { ...defaultStyle };

    if (!post) return style;
    if (post.includes('BREAK')) return { ...style, backgroundColor: '#dcedc8' };
    if (post === 'LUNCH') return { ...style, backgroundColor: '#fff9c4' };
    if (post === 'DYNAMIC') return { ...style, backgroundColor: '#e1bee7' };
    if (post === 'AIT_MALE') return { ...style, backgroundColor: '#bbdefb' };
    if (post === 'AIT_FEMALE') return { ...style, backgroundColor: '#f8bbd0' };
    if (post === 'LEAD') return { ...style, backgroundColor: 'gold' };
    if (post === 'BAGS') return { ...style, backgroundColor: '#f5deb3' };
    if (isOverride) return { ...style, backgroundColor: 'gold', border: '2px dashed black' };
    return style;
  };

  if (error)
    return (
      <div style={{ textAlign: 'center', color: 'red' }}>
        Failed to fetch rotation matrix.
      </div>
    );
  if (!matrix.length)
    return <div style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {/* Morning Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Rotation Log – Morning (11:00–15:30)</h3>
        <table className="matrix-table" style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={headerStyle}>Officer</th>
              {blockLabels.slice(0, 9).map((label, i) => (
                <th key={i} style={headerStyle}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(officerMap).map((officer, rowIndex) => (
              <tr key={officer} style={rowIndex % 2 === 0 ? evenRow : oddRow}>
                <td
                  style={{
                    ...officerStyle,
                    backgroundColor: officer === 'LEAD' ? 'gold' : '#f0f0f0',
                    border: officer === 'LEAD' ? '2px dashed black' : '1px solid #ccc',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#cc0000'
                  }}
                >
                  {officer}
                </td>
                {officerMap[officer].slice(0, 9).map((post, i) => (
                  <td
                    key={i}
                    style={getCellStyle(officer, i, post)}
                  >
                    {post === 'AIT_FEMALE' ? 'AIT_F' :
                     post === 'AIT_MALE' ? 'AIT_M' :
                     post}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Afternoon Table */}
      <div>
        <h3>Rotation Log – Afternoon (15:30–19:30)</h3>
        <table className="matrix-table" style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={headerStyle}>Officer</th>
              {blockLabels.slice(9).map((label, i) => (
                <th key={i} style={headerStyle}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(officerMap).map((officer, rowIndex) => (
              <tr key={officer} style={rowIndex % 2 === 0 ? evenRow : oddRow}>
                <td
                  style={{
                    ...officerStyle,
                    backgroundColor: officer === 'LEAD' ? 'gold' : '#f0f0f0',
                    border: officer === 'LEAD' ? '2px dashed black' : '1px solid #ccc',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#cc0000'
                  }}
                >
                  {officer}
                </td>
                {officerMap[officer].slice(9).map((post, i) => (
                  <td
                    key={i}
                    style={getCellStyle(officer, i + 9, post)}
                  >
                    {post === 'AIT_FEMALE' ? 'AIT_F' :
                     post === 'AIT_MALE' ? 'AIT_M' :
                     post}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styling
const headerStyle = {
  backgroundColor: '#224f8f',
  color: '#fff',
  padding: '10px 8px',
  textAlign: 'center',
  fontWeight: 'bold',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  fontSize: '14px',
  zIndex: 3
};

const officerStyle = {
  padding: '8px 6px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  fontSize: '14px',
  minWidth: '140px'
};

const defaultStyle = {
  padding: '6px 4px',
  fontSize: '12px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  fontFamily: 'Arial, sans-serif',
  verticalAlign: 'middle'
};

const evenRow = { backgroundColor: '#ffffff' };
const oddRow = { backgroundColor: '#f9f9f9' };

export default RotationMatrixDisplay;
