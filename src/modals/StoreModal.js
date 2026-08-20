import React from 'react';

const StoreModal = ({ panel, setPanel, children }) => {
  if (!panel) return null;
  const isAdminPage = panel === "admin";

  return (
    <div className={`store-modal-backdrop${isAdminPage ? " store-admin-backdrop" : ""}`} onMouseDown={() => !isAdminPage && setPanel(null)}>
      <section 
        className={`store-modal${isAdminPage ? " store-admin-page" : ""}`} 
        role={isAdminPage ? "main" : "dialog"} 
        aria-modal={!isAdminPage} 
        aria-label={`${panel} panel`} 
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="store-modal-close" onClick={() => setPanel(null)} aria-label={isAdminPage ? "Exit admin dashboard" : "Close"}>
          {isAdminPage ? "Exit dashboard" : "×"}
        </button>
        {children}
      </section>
    </div>
  );
};

export default StoreModal;