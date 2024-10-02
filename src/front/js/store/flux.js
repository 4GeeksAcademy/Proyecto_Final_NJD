const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			reservas: [],
			restaurantes: [],
			usuarios: [],
			valoraciones: [],
			categorias: [],
			restaurantes_favoritos: [],
		},
		
		actions: {

			// CREAR RESERVA
			crearReserva: async function (data, usuario_id, token) {
				const url = `https://shiny-pancake-7v7jx5444vg42467-3001.app.github.dev/api/usuario/${usuario_id}/reservas`;
				try {
					const response = await fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}` // JWT
						},
						body: JSON.stringify(data)
					});
			
					if (response.ok) {
						const result = await response.json();
						console.log("Reserva realizada con éxito:", result);
						alert("Reserva realizada con éxito");
					} else {
						const error = await response.json();
						console.error("Error al realizar la reserva:", error);
						alert("Error: " + error.message);
					}
				} catch (err) {
					console.error("Error en la petición:", err);
					alert("Hubo un error al procesar la solicitud");
				}
			},
			
			// OBTENER RESERVAS
			obtenerReservas: async function (token, usuario_id) {
				const url = `https://shiny-pancake-7v7jx5444vg42467-3001.app.github.dev/api/usuario/${usuario_id}/reservas`;
			
				try {
					const response = await fetch(url, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}` // JWT
						}
					});
			
					if (response.ok) {
						const result = await response.json();
						console.log("Reservas cargadas con éxito:", result);
						setStore({ reservas: result });
					} else {
						const error = await response.json();
						console.error("Error al cargar las reservas:", error);
						alert("Error: " + error.message);
					}
				} catch (err) {
					console.error("Error en la petición:", err);
					alert("Hubo un error al procesar la solicitud");
				}
			},

			//ACTUALIZAR RESERVAS
			actualizarReserva: async function (reserva_id, data, token) {
				const url = `https://shiny-pancake-7v7jx5444vg42467-3001.app.github.dev/api/reservas/${reserva_id}`;
			
				try {
					const response = await fetch(url, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}` // JWT para autenticación
						},
						body: JSON.stringify(data)
					});
			
					if (response.ok) {
						const result = await response.json();
						console.log("Reserva actualizada con éxito:", result);
			
						const store = getStore();
						const reservasActualizadas = store.reservas.map(reserva =>
							reserva.id === reserva_id ? result : reserva
						);
						setStore({ reservas: reservasActualizadas });
			
						alert("Reserva actualizada con éxito");
					} else {
						const error = await response.json();
						console.error("Error al actualizar la reserva:", error);
						alert("Error: " + error.message);
					}
				} catch (err) {
					console.error("Error en la petición:", err);
					alert("Hubo un error al procesar la solicitud");
				}
			},
			//BORRAR RESERVAS
			eliminarReserva: async function (reserva_id, token) {
				const url = `https://shiny-pancake-7v7jx5444vg42467-3001.app.github.dev/api/reservas/${reserva_id}`;
			
				try {
					const response = await fetch(url, {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${token}` // JWT 
						}
					});
			
					if (response.ok) {
						const store = getStore();
						const reservasActualizadas = store.reservas.filter(reserva => reserva.id !== reserva_id);
						setStore({ reservas: reservasActualizadas });
			
						console.log("Reserva eliminada con éxito");
						alert("Reserva eliminada con éxito");
					} else {
						const error = await response.json();
						console.error("Error al eliminar la reserva:", error);
						alert("Error: " + error.message);
					}
				} catch (err) {
					console.error("Error en la petición:", err);
					alert("Hubo un error al procesar la solicitud");
				}
			},
		}
	}
}


export default getState;