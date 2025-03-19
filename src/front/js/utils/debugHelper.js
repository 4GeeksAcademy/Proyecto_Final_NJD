// Utilidad para depurar problemas de manipulación del DOM en React
export function enableDOMDebugging() {
    // Guarda los métodos originales
    const originalRemoveChild = Node.prototype.removeChild;
    const originalInsertBefore = Node.prototype.insertBefore;
    
    // Sobrescribe removeChild
    Node.prototype.removeChild = function(child) {
      try {
        if (!this.contains(child)) {
          console.error('Error: removeChild - El nodo no es hijo de este elemento');
          console.log('Padre:', this);
          console.log('Hijo que se intenta remover:', child);
          console.log('Pila de llamadas:', new Error().stack);
          return child; // Evitamos que se rompa la aplicación
        }
        return originalRemoveChild.call(this, child);
      } catch (e) {
        console.error('Error en removeChild:', e);
        return child;
      }
    };
    
    // Sobrescribe insertBefore
    Node.prototype.insertBefore = function(newNode, referenceNode) {
      try {
        if (referenceNode && !this.contains(referenceNode)) {
          console.error('Error: insertBefore - El nodo de referencia no es hijo de este elemento');
          console.log('Padre:', this);
          console.log('Nuevo nodo:', newNode);
          console.log('Nodo de referencia:', referenceNode);
          console.log('Pila de llamadas:', new Error().stack);
          return newNode; // Evitamos que se rompa la aplicación
        }
        return originalInsertBefore.call(this, newNode, referenceNode || null);
      } catch (e) {
        console.error('Error en insertBefore:', e);
        return newNode;
      }
    };
    
    console.log('Depuración DOM activada - Observa la consola para ver problemas detallados');
    
    return function disable() {
      // Función para restaurar los métodos originales
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.insertBefore = originalInsertBefore;
      console.log('Depuración DOM desactivada');
    };
  }