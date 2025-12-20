import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--black)',
      color: 'var(--white)',
      padding: '20px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="flex justify-between align-center flex-column" style={{ gap: '16px' }}>
          <div className="text-center">
            <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>
              🍽️ GIU Food Court
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--medium-gray)' }}>
              Your campus dining solution - Order from university vendors with ease
            </p>
          </div>
          
          <div className="flex justify-center align-center gap-3" style={{ fontSize: '14px' }}>
            <span>© 2025 GIU Food Court</span>
            <span>•</span>
            <span>Made with ❤️ for GIU Community</span>
          </div>
          
          <div className="flex justify-center align-center gap-2" style={{ fontSize: '12px', color: 'var(--medium-gray)' }}>
            <span>🏛️ German International University</span>
            <span>•</span>
            <span>📞 Support: bedo1elkelesh2@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
