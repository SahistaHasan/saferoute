import React, { useEffect, useState } from 'react';



const MapWithDirectionPOI = () => {
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  const [questStarted, setQuestStarted] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
const apiKey = import.meta.env.VITE_API_KEY;
  const avatars = [
    { name: 'Ranger', emoji: '🧝‍♂️' },
    { name: 'Wizard', emoji: '🧙‍♀️' },
    { name: 'Knight', emoji: '🛡️' },
    { name: 'Scout', emoji: '🧑‍🚀' },
  ];

  useEffect(() => {
    if (!questStarted) return;

    const script1 = document.createElement('script');
    script1.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap1`;
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_plugins?v=3.0`;
    script2.async = true;

    window.initMap1 = function () {
      const map = new window.mappls.Map('map', {
        center: [28.09, 78.3],
        zoom: 5,
      });

      map.addListener('load', function () {
        const direction_option = {
          map: map,
          isDraggable: false,
          start: { label: 'India Gate', geoposition: '28.612894,77.229446' },
          end: { label: 'Nehru Place', geoposition: '28.84820173428862,77.25112795829774' },
          Profile: ['driving', 'biking', 'trucking', 'walking'],
          alongTheRoute: {
            poicallback: function (data) {
              const gainedXP = (data?.length || 5) * 10;
              setXp((prevXP) => {
                const totalXP = prevXP + gainedXP;
                updateBadges(totalXP);
                return totalXP;
              });
            }
          }
        };

        window.mappls.direction(direction_option, () => {
          setXp((prevXP) => {
            const totalXP = prevXP + 20;
            updateBadges(totalXP);
            return totalXP;
          });
        });
      });
    };

    const updateBadges = (xpTotal) => {
      const newBadges = [];
      if (xpTotal >= 50 && !badges.includes('🏅 Explorer')) {
        newBadges.push('🏅 Explorer');
      }
      if (xpTotal >= 100 && !badges.includes('🧭 Master Navigator')) {
        newBadges.push('🧭 Master Navigator');
      }
      if (newBadges.length > 0) {
        setBadges((prev) => [...new Set([...prev, ...newBadges])]);
      }
    };

    document.body.appendChild(script1);
    document.body.appendChild(script2);
  }, [questStarted]);

  return (
    <div style={{ position: 'relative' }}>
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>

      {!questStarted && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10000, fontFamily: '"Press Start 2P", cursive'
        }}>
          <div style={{
            background: '#1c1c2b',
            border: '5px solid #ffcc00',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '20px',
            boxShadow: '0 0 30px #ffaa00',
            width: '90%',
            maxWidth: '600px'
          }}>
            <h1 style={{ color: '#00f2ff', fontSize: '1rem', marginBottom: '1rem' }}>🧭 Choose Your Avatar</h1>
            <p style={{ color: '#fff', fontSize: '0.7rem', marginBottom: '1.5rem' }}>Pick your character before starting the journey!</p>

            <div style={{
              display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem'
            }}>
              {avatars.map((avatar) => (
                <button
                  key={avatar.name}
                  onClick={() => setSelectedAvatar(avatar)}
                  style={{
                    fontSize: '1.5rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    backgroundColor: selectedAvatar?.name === avatar.name ? '#00f2ff' : '#333',
                    border: '2px solid #fff',
                    cursor: 'pointer',
                    color: '#000',
                    minWidth: '80px',
                    boxShadow: selectedAvatar?.name === avatar.name ? '0 0 15px #00f2ff' : 'none'
                  }}
                >
                  {avatar.emoji}
                  <div style={{ fontSize: '0.6rem', marginTop: '6px', color: '#fff' }}>{avatar.name}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedAvatar && setQuestStarted(true)}
              disabled={!selectedAvatar}
              style={{
                fontSize: '0.7rem',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: selectedAvatar ? '#00f2ff' : '#444',
                border: '2px solid #fff',
                color: '#000',
                cursor: selectedAvatar ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                boxShadow: selectedAvatar ? '0 0 15px #00f2ff' : 'none'
              }}
            >
              🚀 Start Your Quest
            </button>
          </div>
        </div>
      )}

      {questStarted && (
        <div className="gamification-ui" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '1rem',
          borderRadius: '18px',
          color: '#fff',
          fontFamily: '"Press Start 2P", cursive',
          width: '90%',
          maxWidth: '320px',
          border: '2px solid #00f2ff',
          boxShadow: '0 0 15px #00f2ff, 0 0 40px #00f2ff33',
          zIndex: 9999
        }}>
          <h2 style={{ fontSize: '0.8rem', color: '#00f2ff', marginBottom: '1rem' }}>
            🚗 MAP ADVENTURE: STATUS
          </h2>

          {selectedAvatar && (
            <div style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
              {selectedAvatar.emoji} <span style={{ color: '#00f2ff' }}>{selectedAvatar.name}</span>
            </div>
          )}

          {badges.length > 0 && (
            <>
              <p style={{ fontSize: '0.7rem', color: '#ffee00', marginBottom: '6px' }}>🎖️ Achievements:</p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {badges.map((badge, i) => (
                  <li key={i} style={{
                    background: '#1a1a2b',
                    border: '1px solid #666',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.6rem',
                    boxShadow: '0 0 8px #ffaa00aa',
                    color: '#fff'
                  }}>
                    {badge}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1024px) {
          .gamification-ui {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MapWithDirectionPOI;




