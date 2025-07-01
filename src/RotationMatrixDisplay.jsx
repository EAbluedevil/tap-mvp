import { useEffect, useState } from 'react';

function RotationMatrixDisplay({ day }) {
  const [matrix, setMatrix] = useState([]);
  const [officerMap, setOfficerMap] = useState({});
  const [leadOverrides, setLeadOverrides] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/rotation?day=${day}`)
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
  }, [day]); // re-fetch when day changes

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

  if (error) return <div style={{ textAlign: 'center', color: 'red' }}>Failed to fetch rotation matrix.</div>;
  if (!matrix.length) return <div style={{ textAlign: 'center' }}>Loading...</div>;

  const today = new Date();
  const localDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Los_Angeles'
  });
  const militaryTime = today.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'America/Los_Angeles'
  });
  const timestamp = `${localDate} - ${militaryTime} PST`;

  return (
    <div style={{ overflow: 'auto', maxHeight: '85vh', padding: '1rem' }}>
      <div style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginBottom: '1rem' }}>
        {timestamp}
      </div>

      <table style={{ borderCollapse: 'collapse', minWidth: '100%', position: 'relative' }}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, position: 'sticky', top: 0, left: 0, zIndex: 4, backgroundColor: '#222' }}>
              Officer
            </th>
            {blockLabels.map((label, i) => (
              <th key={i} style={{ ...headerStyle, position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#222' }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(officerMap).map((officer, rowIndex) => (
            <tr key={officer} style={rowIndex % 2 === 0 ? evenRow : oddRow}>
              <td
                style={{
                  ...officerStyle,
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  backgroundColor: officer === 'LEAD' ? 'gold' : '#f0f0f0',
                  border: officer === 'LEAD' ? '2px dashed black' : '1px solid #ccc',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                {officer}
              </td>
              {officerMap[officer].map((post, i) => (
                <td
                  key={i}
                  style={{
                    ...getCellStyle(officer, i, post),
                    opacity: i < 2 ? 0.5 : 1,
                  }}
                >
                  {post}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend Section */}
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center', fontSize: '18px', color: '#333' }}>
          Assignment Legend
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '0.5rem',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: 'gold', 
              marginRight: '8px', 
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <span><strong>LEAD</strong> - Lead Officer</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#f5deb3', 
              marginRight: '8px', 
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <span><strong>BAGS</strong> - Baggage Screening</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#bbdefb', 
              marginRight: '8px', 
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <span><strong>AIT_MALE</strong> - Male AIT Operator</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#f8bbd0', 
              marginRight: '8px', 
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <span><strong>AIT_FEMALE</strong> - Female AIT Operator</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#dcedc8', 
              marginRight: '8px', 
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <span><strong>BREAK</strong> - Rest Break</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#fff9c4', 
              marginRight: '8px', 
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <span><strong>LUNCH</strong> - Lunch Break</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#e1bee7', 
              marginRight: '8px', 
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}></div>
            <span><strong>DYNAMIC</strong> - Flexible Assignment</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: 'gold',
              border: '2px dashed black',
              marginRight: '8px',
              borderRadius: '3px'
            }}></div>
            <span><strong>Lead Flex</strong> - Lead Override Assignment</span>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          <strong>Note:</strong> First two time blocks appear faded and represent setup/briefing periods.
        </div>
      </div>
    </div>
  );
}

// Styling
const headerStyle = {
  backgroundColor: '#222',
  color: '#fff',
  padding: '10px 8px',
  textAlign: 'center',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  fontSize: '16px',
  zIndex: 3,
};

const officerStyle = {
  padding: '12px 10px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  fontSize: '16px',
  minWidth: '140px',
};

const defaultStyle = {
  padding: '10px 6px',
  fontSize: '14px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  fontFamily: 'Arial, sans-serif',
  verticalAlign: 'middle',
};

const evenRow = { backgroundColor: '#ffffff' };
const oddRow = { backgroundColor: '#f9f9f9' };

export default RotationMatrixDisplay;