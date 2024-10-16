import React from 'react';

const OpinionModal = ({ isOpen, onClose, opinions, currentIndex, nextOpinion, prevOpinion }) => {
  if (!isOpen) return null;

  const opinion = opinions[currentIndex];

  return (
    <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Opiniones de nuestros comensales</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <img src={opinion.photo} alt={opinion.name} className="opinion-photo mb-3" />
            <h3>{opinion.name}</h3>
            <p>{'⭐'.repeat(opinion.rating)}</p>
            <p>"{opinion.comment}"</p>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            

            <div className="d-flex gap-2">
              <button className="btn btn-secondary" onClick={prevOpinion}>Anterior</button>
              <button className="btn btn-secondary" onClick={nextOpinion}>Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpinionModal;
