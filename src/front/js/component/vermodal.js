// import React, { useEffect, useContext, useState } from 'react';
// import { Context } from '../store/appContext';
// import { ModalModificarReserva } from './ModalModificarReserva';
// export const ModalVerMisFavoritos = ({ isOpen, onClose }) => {
//     const { store, actions } = useContext(Context);
//     const [favoritos, setFavoritos] = useState([]);
//     const [favoritosSeleccionado, setFavoritosSeleccionado] = useState(null);
//     useEffect(() => {
//         if (isOpen) {
//             const fetchFavoritos = async () => {
//                 const token = sessionStorage.getItem('token');
//                 const user_id = sessionStorage.getItem('user_id');
//                 const result = await actions.obtenerReservas(token, user_id);
//                 setFavoritos(result);  // ACA SE GUARDAN LOS FAV
//             };
//             fetchFavoritos();
//         }
//     }, [isOpen]);
//     // Función para actualizar la reserva en la lista después de modificar o eliminar
//     const eliminarFavEnLista = (idEliminar) => {
//         if (idEliminar) {
//             // Si se elimina un fav, la removemos de la lista
//             setFavoritos((prevFav) => prevFav.filter(favoritos => favoritos.id !== idEliminar));
//         } else if (favActualizado) {
//             // Si se actualiza un fav, lo actualizamos en la lista
//             setFavoritos((prevFav) =>
//                 prevFav.map((reserva) =>
//                     favoritos.id === favActualizado.id ? favActualizado : reserva
//                 )
//             );
//         }
//     };
// };
// // Si el modal no está abierto, no se muestra nada
// if (!isOpen) return null;
// return (
//     <>
//         <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
//             <div className="modal-dialog modal-lg">  {/* Aumentamos el tamaño del modal */}
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title" id="favModalLabel">Tus favoritos</h5>
//                         <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
//                     </div>
//                     <div className="modal-body">
//                         {favoritos && favoritos.length > 0 ? (
//                             <div className="row">
//                                 {favoritos.map((favoritos, index) => (
//                                     <div key={index} className="col-md-6 mb-3">
//                                         <div className="card">
//                                             <div className="card-body">
//                                                 <strong>Restaurante:</strong> {favoritos.restaurant_name} <br />
//                                                 <button
//                                                     className="btn btn-secondary mt-2"
//                                                     onClick={() => eliminarFavEnLista(favoritos)}>
//                                                     Eliminar favoritos
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p>No tienes favoritos.</p>
//                         )}
//                     </div>
//                     <div className="modal-footer">
//                         <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         {/* Modal de modificar reserva */}
//         {reservaSeleccionada && (
//             <ModalModificarReserva
//                 isOpen={!!favoritosSeleccionado}
//                 onClose={() => setFavoritosSeleccionado(null)}
//                 favoritos={favoritosSeleccionado}
//                 actualizarFavvoritosEnLista={actualizarFavvoritosEnLista}  // Pasamos la función de actualización
//             />
//         )}
//     </>
// );
// //-------------------------------------------------------------------------------------------------------------------






























