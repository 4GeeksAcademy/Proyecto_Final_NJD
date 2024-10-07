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
            crearReserva: async function (data) {
                const url = `${process.env.BACKEND_URL}/api/usuario/reservas`;
                const token = sessionStorage.getItem("token");
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
                        alert("Reserva realizada con éxito");
                    } else {
                        const error = await response.json();
                        alert("Error: " + error.message);
                    }
                } catch (err) {
                    alert("Hubo un error al procesar la solicitud");
                }
            },

            // OBTENER RESERVAS
            obtenerReservas: async function (token, usuario_id) {
                const url = `${process.env.BACKEND_URL}/api/usuario/${usuario_id}/reservas`;
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
                        setStore({ reservas: result });
                    } else {
                        const error = await response.json();
                        alert("Error: " + error.message);
                    }
                } catch (err) {
                    alert("Hubo un error al procesar la solicitud");
                }
            },

            // ACTUALIZAR RESERVAS
            actualizarReserva: async function (reserva_id, data, token) {
                const url = `${process.env.BACKEND_URL}/api/reservas/${reserva_id}`;
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
                        const store = getStore();
                        const reservasActualizadas = store.reservas.map(reserva =>
                            reserva.id === reserva_id ? result : reserva
                        );
                        setStore({ reservas: reservasActualizadas });

                        alert("Reserva actualizada con éxito");
                    } else {
                        const error = await response.json();
                        alert("Error: " + error.message);
                    }
                } catch (err) {
                    alert("Hubo un error al procesar la solicitud");
                }
            },

            // BORRAR RESERVAS
            eliminarReserva: async function (reserva_id, token) {
                const url = `${process.env.BACKEND_URL}/api/reservas/${reserva_id}`;
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

                        alert("Reserva eliminada con éxito");
                    } else {
                        const error = await response.json();
                        alert("Error: " + error.message);
                    }
                } catch (err) {
                    alert("Hubo un error al procesar la solicitud");
                }
            },


            // REGISTRO DE USUARIO
            signupUsuario: async (formData) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nombres: formData.firstName,
                            apellidos: formData.lastName,
                            email: formData.email,
                            password: formData.password,
                            telefono: formData.phone,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { success: true, data: data };
                    } else if (response.status === 409) {
                        return { success: false, message: "El email ya existe" };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al registrar el usuario" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },



            // LOGIN USUARIO
            loginUsuario: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        sessionStorage.setItem('token', data.access_token);  // Guardar el token en sessionStorage
                        sessionStorage.setItem('user_name', data.user_name);  // Guardar el nombre del usuario en sessionStorage
                        return { success: true, data: data };  // Devolver el resultado exitoso
                    } else if (response.status === 404) {
                        return { success: false, error: 'Usuario no registrado' };
                    } else if (response.status === 401) {
                        return { success: false, error: 'Contraseña incorrecta' };
                    } else {
                        return { success: false, error: data.msg || 'Error al iniciar sesión' };
                    }
                } catch (error) {
                    return { success: false, error: 'Error de conexión' };
                }
            },



            // OBTENER RESTAURANTES
            obtenerRestaurantes: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurantes`);
                    const data = await response.json();
                    setStore({ restaurantes: data });
                } catch (error) {
                    console.log(error);
                }
            },


            // OBTENER CATEGORÍAS
            obtenerCategorias: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/categorias`);
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ categorias: data });
                    } else {
                        console.error("Error al obtener categorías");
                    }
                } catch (error) {
                    console.error("Error al cargar categorías", error);
                }
            },


            // OBTENER UNA CATEGORÍA POR ID
            obtenerUnaCategoria: async (categoria_id) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/categorias/${categoria_id}`);
                    if (!response.ok) {
                        throw new Error("Error al cargar la categoría");
                    }
                    const data = await response.json();
                    setStore({ categorias: [data] }); // Puedes ajustar esto según cómo necesites almacenar la categoría
                } catch (error) {
                    console.error("Error al cargar categoría", error);
                }
            },

            // REGISTRAR UN RESTAURANTE DATOS INICIALES
            signupRestaurante: async (formData) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/signup/restaurante", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nombre: formData.restaurantName,
                            email: formData.email,
                            password: formData.password, // Asegúrate de tener el campo "password" en el backend
                            telefono: formData.phone,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { success: true, message: "Restaurante registrado con éxito", data: data };
                    } else if (response.status === 409) {
                        return { success: false, message: "El restaurante ya está registrado" };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al registrar el restaurante" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },

            // OBTENER UN RESTAURANTE POR ID
            getRestaurante: async (restauranteId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurantes/${restauranteId}`);
                    if (!response.ok) {
                        throw new Error("Error al cargar el restaurante");
                    }
                    const data = await response.json();
                    setStore({ restaurantDetails: data }); // Guarda los detalles del restaurante en el store
                } catch (error) {
                    console.error("Error al cargar el restaurante", error);
                }
            },

            //COMPLETAR REGISTRO RESTAURANTE
            completarRegistroRestaurante: async (restauranteId, formData) => {
                const token = sessionStorage.getItem("token");
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurantes/${restauranteId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            direccion: formData.direccion,
                            cubiertos: formData.cubiertos,
                            cantidad_mesas: formData.cantidad_mesas,
                            franja_horaria: formData.franja_horaria,
                            reservas_por_dia: formData.reservas_por_dia,
                            categorias_id: formData.categorias_id
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { success: true, message: "Registro completado con éxito", data: data };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al completar el registro" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },
        }
    };
};

export default getState;
