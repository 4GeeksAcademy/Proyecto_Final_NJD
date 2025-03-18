import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
    
  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI alternativa
    return { hasError: true };
  }
    
  componentDidCatch(error, errorInfo) {
    // Puedes también registrar el error en un servicio de reporte
    console.error("Error capturado:", error);
    console.error("Información del componente:", errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  // Método para reintentar
  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  }
    
  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI personalizada
      return (
        <div className="container text-center py-5">
          <h1 className="text-danger mb-4">Algo salió mal</h1>
          <p className="mb-4">Ha ocurrido un error inesperado en la aplicación.</p>
          
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button 
              className="btn btn-primary" 
              onClick={this.handleReset}
            >
              Reintentar
            </button>
            
            <Link to="/" className="btn btn-secondary">
              Volver al inicio
            </Link>
          </div>
          
          {/* Información técnica (opcional, podrías ocultarla en producción) */}
          <details className="text-start border p-3 mt-3" style={{maxWidth: "700px", margin: "0 auto"}}>
            <summary className="fw-bold mb-2">Detalles técnicos</summary>
            <p className="text-danger">{this.state.error && this.state.error.toString()}</p>
            <p className="text-muted small">
              Este error ha sido registrado. Si persiste, contacta al soporte técnico.
            </p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
    
export default ErrorBoundary;