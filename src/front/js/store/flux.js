const getState = ({ getStore, getActions, setStore }) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Función de log segura
    const safeLog = (message, data) => {
        if (!isProduction) {
            if (data && (data.access_token || data.refresh_token)) {
                // Ocultar tokens en los logs
                const sanitizedData = {
                    ...data,
                    access_token: data.access_token ? "[TOKEN OCULTO]" : undefined,
                    refresh_token: data.refresh_token ? "[TOKEN OCULTO]" : undefined
                };
                console.log(message, sanitizedData);
            } else {
                console.log(message, data);
            }
        }
    };
    return {
        store: {
            reservas: [],
            restaurantes: [],
            usuarios: [],
            valoraciones: [],
            categorias: [],
            restaurantes_favoritos: [],
            restaurantDetails: {},
            imagenes: [],
            userName: sessionStorage.getItem('user_name'),
            restoName: sessionStorage.getItem('restaurant_name'),
            descripcionRestaurante: ""
        },

        actions: {



            actualizarNombreUsuario: (nombre) => {
                setStore({ userName: nombre })

            },

            actualizarNombreResto: (nombre) => {
                setStore({ restoName: nombre })
            },


            // CAMBIAR CONTRASEÑA RESTAURANTE
            cambiarContraseña: async (data) => {
                const token = sessionStorage.getItem('token');
                try {
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/restaurante/cambiar_contrasena', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    });
                    console.log(response)
                    const result = await response.json();
                    if (response.ok) {
                        return { success: true, message: result.msg };
                    } else {
                        return { success: false, message: result.msg };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },

            // CAMBIAR CONTRASEÑA USUARIO
            cambiarContraseñaUser: async (data) => {
                const token = sessionStorage.getItem('token');
                try {
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/usuario/cambiar_contrasena', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (response.ok) {
                        return { success: true, message: result.msg };
                    } else {
                        return { success: false, message: result.msg };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },


            // CREAR RESERVA
            crearReserva: async function (data) {
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/usuario/reservas`;
                const token = sessionStorage.getItem("token");

                const bodyData = {
                    ...data,
                    niños: data.niños || 0,
                    trona: data.trona || 0
                };

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(bodyData)
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
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/usuario/${usuario_id}/reservas`;
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        return result;
                    } else {
                        const error = await response.json();
                        alert("Error: " + error.message);
                        return [];
                    }
                } catch (err) {
                    alert("Hubo un error al procesar la solicitud");
                    return [];
                }
            },

            // ACTUALIZAR RESERVAS
            actualizarReserva: async function (reserva_id, data, token) {
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/reservas/${reserva_id}`;
                try {
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
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
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/reservas/${reserva_id}`;
                try {
                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
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
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/signup", {
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
                    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/login", {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                        })
                    });

                    console.log("Respuesta del servidor:", response);
                    console.log("Estado de la respuesta:", response.status);

                    const data = await response.json();
                    console.log("Datos recibidos:", data);

                    if (response.ok) {
                        sessionStorage.setItem('token', data.access_token);
                        sessionStorage.setItem('user_name', data.user_name);
                        sessionStorage.setItem('user_id', data.user_id);
                        localStorage.setItem('usuario', data.user_id);

                        console.log("usuario_id guardado en sessionStorage:", sessionStorage.getItem('user_id'));

                        return { success: true, data: data };
                    } else if (response.status === 404) {
                        return { success: false, error: 'Usuario no registrado' };
                    } else if (response.status === 401) {
                        return { success: false, error: 'Contraseña incorrecta' };
                    } else {
                        return { success: false, error: data.msg || 'Error al iniciar sesión' };
                    }
                } catch (error) {
                    console.error("Error completo de login:", error);
                    return { success: false, error: 'Error de conexión' };
                }
            },


            modificarUsuario: async (userId, formData) => {
                console.log(formData)
                const token = sessionStorage.getItem("token");
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/usuario/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            nombres: formData.nombres,
                            apellidos: formData.apellidos,
                            telefono: formData.telefono,
                            password: formData.password ? formData.password : undefined
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { success: true, message: "Usuario modificado con éxito", data: data };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al modificar el usuario" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },


            obtenerDatosUsuario: async (userId) => {
                if (!userId) {
                    console.error("ID de usuario no proporcionado");
                    return null;
                }
                
                const token = sessionStorage.getItem("token");
                
                if (!token) {
                    console.error("No hay token de autenticación disponible");
                    return null;
                }
                
                try {
                    // Usar la URL con ID de usuario
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/usuario/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Datos obtenidos del usuario:", data);
                        return data;
                    } else {
                        const errorText = await response.text();
                        console.error(`Error (${response.status}):`, errorText);
                        
                        // Fallback a sessionStorage si falla
                        return {
                            nombres: sessionStorage.getItem("user_name") || '',
                            apellidos: '',
                            telefono: '',
                            email: sessionStorage.getItem("user_email") || ''
                        };
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                    
                    // Fallback a sessionStorage si hay excepción
                    return {
                        nombres: sessionStorage.getItem("user_name") || '',
                        apellidos: '',
                        telefono: '',
                        email: sessionStorage.getItem("user_email") || ''
                    };
                }
            },

            eliminarUsuario: async (userId) => {
                const token = sessionStorage.getItem("token");
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/usuario/${userId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        return { success: true, message: "Usuario eliminado con éxito" };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al eliminar el usuario" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },


            // OBTENER CATEGORÍAS
            obtenerCategorias: async () => {
                try {
                    console.log('URL de solicitud:', `${process.env.REACT_APP_BACKEND_URL}/api/categorias`);

                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categorias`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });

                    console.log('Estatus de respuesta:', response.status);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Datos recibidos:', data);

                    setStore({ categorias: data });
                } catch (error) {
                    console.error("Error al cargar categorías", error);
                }
            },

            // OBTENER UNA CATEGORÍA
            obtenerUnaCategoria: async (categoria_id) => {
                try {
                    console.log(`Intentando obtener la categoría con ID: ${categoria_id}`);
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categorias/${categoria_id}`);
                    if (!response.ok) {
                        throw new Error("Error al obtener la categoría");
                    }
                    const data = await response.json();
                    console.log(`Datos de la categoría obtenidos: `, data);
                    return data;
                } catch (error) {
                    console.error("Error al cargar la categoría", error);
                    return null;
                }
            },


            // OBTENER RESTAURANTES POR CATEGORIA
            obtenerRestaurantesPorCategoria: async (categoria_id) => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categorias/${categoria_id}/restaurantes`);
                    if (!response.ok) {
                        throw new Error("Error al obtener los restaurantes por categoría");
                    }
                    const data = await response.json();
                    setStore({ restaurantes: data });
                } catch (error) {
                    console.error("Error al cargar los restaurantes por categoría", error);
                }
            },



            // LOGIN RESTAURANTE
            loginRestaurante: async (formData) => {
                try {
                    const url = `${process.env.REACT_APP_BACKEND_URL}/api/login/restaurante`;
                    console.log("Fetching URL (login restaurante):", url);

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            password: formData.password,
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        sessionStorage.setItem('restaurant_name', data.restaurant_name);
                        sessionStorage.setItem('restaurant_id', data.restaurant_id);
                        return { success: true, data: data };
                    } else {
                        return { success: false, status: response.status, message: data.msg || 'Error al iniciar sesión' };
                    }
                } catch (error) {
                    return { success: false, message: 'Error de conexión' };
                }
            },



            // REGISTRAR UN RESTAURANTE DATOS INICIALES
            signupRestaurante: async (formData) => {
                try {
                    const url = `${process.env.REACT_APP_BACKEND_URL}/api/signup/restaurante`;
                    console.log("Fetching URL (signup restaurante):", url);

                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nombre: formData.restaurantName,
                            email: formData.email,
                            password: formData.password,
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



            // COMPLETAR REGISTRO RESTAURANTE
            completarRegistroRestaurante: async (restauranteId, formData) => {
                const token = sessionStorage.getItem("token");
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurante/${restauranteId}/completar`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            direccion: formData.direccion,
                            cubiertos: formData.cubiertos,
                            cantidad_mesas: formData.cantidad_mesas,
                            horario_mañana_inicio: formData.horario_mañana_inicio,
                            horario_mañana_fin: formData.horario_mañana_fin,
                            horario_tarde_inicio: formData.horario_tarde_inicio,
                            horario_tarde_fin: formData.horario_tarde_fin,
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

            // MODIFICAR DATOS DEL RESTAURANTE DESDE LA PÁGINA PRIVADA
            modificarDatosRestaurante: async (restauranteId, formData) => {
                const token = sessionStorage.getItem("token");
                try {
                    const formatearHora = (hora) => {
                        return hora ? hora.slice(0, 5) : null;
                    };
                    console.log(formData)

                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            nombre: formData.nombre,
                            email: formData.email,
                            direccion: formData.direccion,
                            cubiertos: formData.cubiertos,
                            cantidad_mesas: formData.cantidad_mesas,
                            horario_mañana_inicio: formatearHora(formData.horario_mañana_inicio),
                            horario_mañana_fin: formatearHora(formData.horario_mañana_fin),
                            horario_tarde_inicio: formatearHora(formData.horario_tarde_inicio),
                            horario_tarde_fin: formatearHora(formData.horario_tarde_fin),
                            reservas_por_dia: formData.reservas_por_dia,
                            categorias_id: formData.categorias_id,
                            telefono: formData.telefono
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        sessionStorage.setItem('restaurant_name', formData.nombre);
                        return { success: true, message: "Datos modificados con éxito", data: data };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al modificar los datos" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },



            // OBTENER RESTAURANTES
            obtenerRestaurantes: async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes`);
                    const data = await response.json();
                    setStore({ restaurantes: data });
                } catch (error) {
                    console.log(error);
                }
            },

            getRestaurante: async (restauranteId) => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}`);
                    if (!response.ok) {
                        throw new Error("Error al obtener los detalles del restaurante");
                    }
                    const data = await response.json();
                    setStore({ restaurantDetails: data });
                    return data
                } catch (error) {
                    console.error("Error al cargar el restaurante", error);
                }

            },

            obtenerValoracionRestaurante: async (restauranteId) => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurante/${restauranteId}/valoracion`);
                    const data = await response.json();
                    setStore({ valoraciones: data });
                } catch (error) {
                    console.error("Error al cargar las valoraciones", error);
                }
            },

            // OBTENER UN RESTAURANTES POR ID
            obtenerRestaurantesPorId: async (restaurante_id) => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restaurante_id}`);
                    const data = await response.json();
                    setStore({ restaurantes: data });
                } catch (error) {
                    console.log(error);
                }
            },

            // ELIMINAR RESTAURANTE
            eliminarRestaurante: async (restauranteId) => {
                const token = sessionStorage.getItem("token");
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        return { success: true, message: "Restaurante eliminado con éxito" };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al eliminar el restaurante" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },

            // OBTENER LOS FAVORITOS DEL USUARIO

            obtenerFavoritosDelUsuario: async (usuario_id) => {
                if (!usuario_id) {
                    console.log("⚠️ usuario_id es undefined o null, no se puede hacer fetch.");
                    return;
                }

                const url = `${process.env.REACT_APP_BACKEND_URL}/api/usuario/${usuario_id}/favoritos`;
                console.log("🔍 URL fetch:", url);

                try {
                    const response = await fetch(url);
                    const text = await response.text(); // Obtenemos el texto para verificar si es JSON o HTML
                    console.log("📌 Response text:", text); // Imprime la respuesta antes de convertirla a JSON

                    const data = JSON.parse(text); // Convertimos manualmente
                    setStore({ restaurantes_favoritos: data.restaurantes_favoritos });
                    return data;
                } catch (error) {
                    console.log("❌ Error en obtenerFavoritosDelUsuario:", error);
                }
            },



            // ELIMINAR FAV

            eliminarFavorito: async (usuario_id, favorito_id) => {
                try {
                    const token = sessionStorage.getItem('token');
                    const user_id = sessionStorage.getItem('user_id');

                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/usuario/${usuario_id}/favoritos/${favorito_id}`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });

                    if (response.ok) {
                        getActions().obtenerFavoritosDelUsuario(user_id)
                        const data = await response.json();
                        console.log("Favorito eliminado:", data);
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error eliminando favorito:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error al eliminar favorito:", error);
                    return false;
                }
            },


            // AGREGAR FAVORITOS DESDE EL BOTON

            agregarFavorito: async (usuario_id, restaurante_id) => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/usuario/${usuario_id}/favoritos`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ restaurante_id: restaurante_id }),
                    });

                    if (response.ok) {
                        const user_id = sessionStorage.getItem("user_id")
                        getActions().obtenerFavoritosDelUsuario(user_id)
                        const data = await response.json();
                        return data;
                    } else {
                        console.error("Error al agregar favorito");
                        return null;
                    }
                } catch (error) {
                    console.error("Error en la solicitud", error);
                    return null;
                }
            },

            // SUBIR IMAGEN A CLOUDINARY Y ASOCIARLA AL RESTAURANTE
            subirImagenRestaurante: async function (file, restauranteId) {
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
                    formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

                    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();

                        const token = sessionStorage.getItem('token');
                        const apiResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}/imagen`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ url_imagen: data.secure_url })
                        });

                        if (apiResponse.ok) {
                            return { success: true, url: data.secure_url };
                        } else {
                            return { success: false, message: "Error al asociar la imagen con el restaurante" };
                        }
                    } else {
                        return { success: false, message: "Error al subir la imagen a Cloudinary" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },

            // OBTENER IMÁGENES DE UN RESTAURANTE POR SU ID (GET)
            obtenerImagenesRestaurante: async function (restauranteId) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}/imagenes`, {
                        method: 'GET'
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ imagenes: data });
                    } else {
                        console.error("Error al obtener las imágenes del restaurante");
                    }
                } catch (error) {
                    console.error("Error al conectar con el servidor", error);
                }
            },

            // ACTUALIZAR IMAGEN DE UN RESTAURANTE (PUT)
            actualizarImagenRestaurante: async function (restauranteId, nuevaImagenUrl) {
                const token = sessionStorage.getItem("token");
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}/imagen`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ url_imagen: nuevaImagenUrl })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        alert("Imagen actualizada con éxito");
                        return { success: true, data: data };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al actualizar la imagen" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },




            deleteImageRestaurante: async (restaurante_id, imageURL) => {
                try {
                    const response = await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restaurante_id}/imagen?url_imagen=${encodeURIComponent(imageURL)}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${sessionStorage.getItem("token")}`
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Error eliminando la imagen");
                    }

                    const data = await response.json();
                    return { success: true, data };
                } catch (error) {
                    console.error("Error al eliminar la imagen:", error);
                    return { success: false, error };
                }
            },

            // OBTENER DESCRIPCIÓN DEL RESTAURANTE
            obtenerDescripcionRestaurante: async (restauranteId) => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}/descripcion`, {
                        method: "GET"
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { success: true, descripcion: data.descripcion };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al obtener la descripción" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },

            // ACTUALIZAR DESCRIPCIÓN DEL RESTAURANTE
            actualizarDescripcionRestaurante: async (restauranteId, descripcion) => {
                const token = sessionStorage.getItem("token");
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurantes/${restauranteId}/descripcion`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ descripcion })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { success: true, message: "Descripción actualizada con éxito", data: data };
                    } else {
                        const errorData = await response.json();
                        return { success: false, message: errorData.msg || "Error al actualizar la descripción" };
                    }
                } catch (error) {
                    return { success: false, message: "Error de conexión" };
                }
            },

        }
    };
};





export default getState;
