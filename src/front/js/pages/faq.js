import React, { useState, useEffect } from 'react';
import '../../styles/faq.css'; 

export const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const faqs = [
    { question: '¿Cómo puedo realizar una reserva en un restaurante?', answer: 'Para realizar una reserva, simplemente busca el restaurante que deseas, selecciona la fecha y hora, y sigue los pasos para confirmar tu reserva. Recibirás una confirmación en tu correo electrónico con los detalles.' },
    { question: '¿Es necesario registrarse para hacer una reserva?', answer: 'Te recomendamos crear una cuenta para disfrutar de beneficios adicionales, como guardar tus restaurantes favoritos, consultar tus reservas anteriores y gestionar futuras reservas con facilidad.' },
    { question: '¿Cómo puedo crear una cuenta en la plataforma?', answer: 'Haz clic en el botón de "Registro" en la esquina superior derecha. Rellena tus datos personales o inicia sesión a través de tu correo electrónico y contraseña. Una vez registrado, podrás acceder a todas las funciones de la "Hoy no cocino".' },
    { question: '¿Cómo añado un restaurante a mis favoritos?', answer: 'Una vez hayas iniciado sesión, puedes añadir cualquier restaurante a tu lista de favoritos haciendo clic en el icono de "corazón" que aparece en la página del restaurante. Podrás acceder a tus favoritos desde tu perfil.' },
    { question: '¿Dónde puedo consultar la carta de un restaurante?', answer: 'En la página de cada restaurante, encontrarás un apartado donde podrás ver el menú completo, con descripciones detalladas de los platos y bebidas ofrecidos. Algunos restaurantes también muestran precios y opciones especiales.' },
    { question: '¿Cómo puedo ver la ubicación y datos de contacto de un restaurante?', answer: 'En la página de cada restaurante, puedes consultar su dirección, horario de apertura, número de teléfono, y enlaces a sus redes sociales. También dispones de un mapa interactivo para obtener indicaciones de cómo llegar.' },
    { question: '¿Cuáles son los beneficios de que mi restaurante sea miembro de la plataforma?', answer: 'Al convertirte en miembro, tu restaurante se hará visible para miles de usuarios que buscan experiencias culinarias exclusivas. Los usuarios podrán reservar directamente, consultar tu carta, y agregar tu restaurante a sus favoritos. También recibirás herramientas para gestionar las reservas y contactar con tus clientes.'},
    { question: '¿Cómo gestiono las reservas de mi restaurante como miembro?', answer: 'Una vez registrado como miembro, tendrás acceso a un panel de control desde donde podrás gestionar las reservas, responder a consultas de los usuarios y actualizar la información de tu restaurante.' },
    { question: '¿Cómo cancelo o modifico una reserva que ya he realizado?', answer: 'Inicia sesión en tu cuenta y ve a la sección "Mis Reservas". Desde ahí, podrás modificar o cancelar cualquier reserva que hayas hecho. Te recomendamos hacerlo con al menos 24 horas de antelación para evitar posibles cargos.' },
    { question: '¿Recibo alguna confirmación de reserva?', answer: 'Sí, una vez hayas completado tu reserva, recibirás una confirmación por correo electrónico con todos los detalles. Además, podrás ver la reserva en la sección "Mis Reservas" dentro de tu cuenta.' },
    { question: '¿Cómo puedo contactar directamente con un restaurante?', answer: 'En la página del restaurante, encontrarás su número de teléfono y un formulario de contacto. También puedes enviarles un mensaje directamente desde nuestra plataforma si han habilitado esta opción.' },
    { question: '¿Puedo ver reseñas y valoraciones de otros usuarios?', answer: 'Sí, cada restaurante tiene una sección donde los usuarios pueden dejar sus reseñas y valoraciones. Te animamos a que compartas tu experiencia después de cada visita.' },
    { question: '¿Qué tipo de cocina ofrecen?', answer: 'Disponemos actualmente de 13 categorías diferentes de cocina: mediterránea, china, japonesa, india, americana, tailandesa, árabe, internacional, latinoamericana, saludable, italiana, argentina y mexicana.' },
    { question: '¿Hay restaurantes con listas de espera?', answer: 'Algunos restaurantes populares pueden tener listas de espera. En estos casos, te notificaremos si hay una mesa disponible después de haber solicitado la reserva, o puedes elegir un horario alternativo.' },
    { question: '¿Cómo puedo guardar mis restaurantes favoritos y cómo los consulto después?', answer: 'Una vez que hayas iniciado sesión en tu cuenta, puedes guardar cualquier restaurante en tu lista de favoritos haciendo clic en el icono de "corazón" en la página del restaurante. Para consultar tus favoritos, simplemente ve a la sección "Favoritos" en tu perfil. Desde allí podrás ver, gestionar, o hacer reservas en tus restaurantes favoritos.' },
    { question: '¿Qué ocurre si llego tarde a mi reserva?', answer: 'Si prevés que llegarás tarde a tu reserva, te recomendamos que te pongas en contacto directamente con el restaurante para informarlos. Algunos restaurantes tienen políticas restrictas sobre la puntualidad, y es posible que tu reserva sea cancelada si llegas demasiado tarde. Esto varía según el restaurante, así que consulta los términos al hacer tu reserva.' },
    { question: '¿Cómo puedo filtrar los restaurantes según mis preferencias?', answer: 'En nuestra plataforma, puedes filtrar los restaurantes según diferentes criterios, como tipo de cocina, ubicación, precio, valoraciones de usuarios y disponibilidad. Solo tienes que utilizar la barra de búsqueda o las opciones de filtrado disponibles en la página de exploración de restaurantes.' },
    { question: '¿Los restaurantes pueden ofrecer promociones o descuentos exclusivos a través de la plataforma?', answer: 'Sí, algunos restaurantes ofrecen promociones o descuentos especiales para los usuarios que reservan a través de nuestra plataforma. Estas ofertas estarán visibles en la página del restaurante y puedes aplicar los descuentos automáticamente durante el proceso de reserva si están disponibles.' },
    { question: '¿Cómo se asegura la calidad de los restaurantes en la plataforma?', answer: 'Solo incluimos restaurantes que cumplen con ciertos estándares de calidad. Además, realizamos revisiones periódicas y los usuarios pueden dejar reseñas y valoraciones que nos ayudan a mantener la calidad. Si un restaurante recibe varias quejas, investigamos y tomamos las medidas necesarias, que pueden incluir la eliminación del restaurante de nuestra plataforma.' },
    

  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="general-faq-container">
       <h1 className="tex-faq">PREGUNTAS FRECUENTES (FAQ)</h1>
    <div className="container-faq">
      <input
        type="text"
        className="search-bar-faq"
        placeholder="¿En qué puedo ayudarte? Consulta aquello que necesites."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="faq-container">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleAnswer(index)}
              >
                {faq.question}
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results-faq">No se encontraron resultados.</div>
        )}
      </div>
    </div>
    </div>
  );
};
