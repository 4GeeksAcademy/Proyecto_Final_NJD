from sqlalchemy.exc import ProgrammingError
from api.models import db, Restaurantes

mock_restaurantes = [
                { "nombre": "Trattoria Bella", "telefono": "123 123 123", "email": "tratoriabella@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 1, "direccion": "Calle Mayor 45, Madrid", "image": "https://i0.wp.com/travelandleisure-es.com/wp-content/uploads/2024/04/TAL-ristorante-seating-ITLNRESTAURANTS0424-5403b234cdbd4026b2e98bed659b1634.webp?fit=750%2C500&ssl=1"},
                { "nombre": "Pasta Fresca", "telefono": "234 234 234", "email": "pastafresca@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 1, "direccion": "Calle de la Paz 10, Valencia", "image": "https://static.wixstatic.com/media/e7e925_6e8c1ffb4cd8432ea5a37cec591048ad~mv2.jpg/v1/fill/w_2880,h_1598,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/e7e925_6e8c1ffb4cd8432ea5a37cec591048ad~mv2.jpg"},
                { "nombre": "Osteria del Mare", "telefono": "345 345 345", "email": "osteriadelmare@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 20, "categorias_id": 1, "direccion": "Paseo Marítimo 8, Barcelona", "image": "https://s3.abcstatics.com/abc/www/multimedia/gastronomia/2023/01/16/forneria-RMj62LyNsJZlBCufEion5YK-1200x840@abc.jpg"},
                { "nombre": "El Mariachi Loco", "telefono": "456 456 456 ", "email": "elmariachiloco@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 3, "direccion": "Avenida de América 23, Madrid", "image": "https://i0.wp.com/lattin.ca/wp-content/uploads/2016/05/El_Catrin_Inside_51.png?w=1085&ssl=1"},
                { "nombre": "Cantina del Cactus", "telefono": "567 567 567", "email": "cantinadelcactus@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 3, "direccion": "Boulevard de los Aztecas 15, Barcelona", "image": "https://images.ecestaticos.com/kCk1Qljo-a1ll2eVt2ovDfRo7pY=/0x0:1885x900/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fc66%2Fa99%2F8d5%2Fc66a998d5952c07d264a23dfdbecdcf2.jpg" },
                { "nombre": "Tacos y Más", "telefono": "678 678 678", "email": "tacosymas@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 3, "direccion": "Calle del Carmen 99, Valencia", "image": "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/08/04/62ebd8920f8fe.r_d.3275-3425-1343.jpeg" },
                { "nombre": "Sakura House", "telefono": "789 789 789", "email": "sakurahouse@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 6, "direccion": "Calle Bonsai 12, Madrid", "image": "https://winegogh.es/wp-content/uploads/2024/08/kelsen-fernandes-2hEcc-4cwZA-unsplash-scaled.jpg" },
                { "nombre": "Samurai Sushi", "telefono": "890 890 890", "email": "samuraisushi@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 6, "direccion": "Avenida de Japón 23, Barcelona", "image": "https://imagenes.esdiario.com/files/image_990_660/uploads/2024/06/22/66765b6b14a50.jpeg" },
                { "nombre": "Yoko Ramen", "telefono": "901 901 901", "email": "yokoramen@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 6, "direccion": "Calle del Pescador 7, Valencia", "image": "https://media.timeout.com/images/100614777/1536/864/image.webp" },
                { "nombre": "Dragón Rojo", "telefono": "321 321 321", "email": "dragonrojo@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 35, "categorias_id": 5, "direccion": "Calle Pagoda 34, Madrid", "image": "https://offloadmedia.feverup.com/valenciasecreta.com/wp-content/uploads/2022/01/13123703/restaurantes-chinos-valencia-1024x683.jpg" },
                { "nombre": "Dim Sum Palace", "telefono": "432 432 432", "email": "dimsumpalace@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 5, "direccion": "Avenida Oriente 22, Barcelona", "image": "https://offloadmedia.feverup.com/valenciasecreta.com/wp-content/uploads/2022/01/13123704/277526606_706703347177521_4948663648545209465_n.jpg" },
                { "nombre": "Pekin Express", "telefono": "543 543 543", "email": "pekinexpress@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 5, "direccion": "Calle Muralla 8, Sevilla", "image": "https://www.lavanguardia.com/files/image_990_484/uploads/2020/01/15/5e9977269a0d4.jpeg" },
                { "nombre": "Curry Masala", "telefono": "654 654 654", "email": "currymasala@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 20, "categorias_id": 7, "direccion": "Calle Taj Mahal 12, Madrid", "image": "https://www.sentirsebiensenota.com/wp-content/uploads/2022/04/restaurantes-indios-valencia-1080x640.jpg" },
                { "nombre": "Palacio del Sabor", "telefono": "765 765 765", "email": "palaciodelsabor@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 35, "categorias_id": 7, "direccion": "Avenida Ganges 5, Valencia", "image": "https://tumediodigital.com/wp-content/uploads/2021/03/comida-india-valencia.jpg" },
                { "nombre": "Namaste India", "telefono": "876 876 876", "email": "namasteindia@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 20, "categorias_id": 7, "direccion": "Boulevard Raj 10, Barcelona", "image": "https://phantom-elmundo.unidadeditorial.es/7279f37ebecb49cf7738402f76486caa/crop/0x0/1478x985/resize/746/f/webp/assets/multimedia/imagenes/2021/06/15/16237493606773.png" },
                { "nombre": "Hard Rock", "telefono": "987 987 987", "email": "hardrock@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 40, "categorias_id": 8, "direccion": "Avenida de la Libertad 45, Madrid", "image": "https://ibiza-spotlight1.b-cdn.net/sites/default/files/styles/embedded_auto_740_width/public/article-images/138583/embedded-1901415944.jpeg?itok=oWiIVuDP" },
                { "nombre": "Steak House", "telefono": "109 109 109", "email": "steakhouse@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 8, "direccion": "Calle Ruta 66 77, Barcelona", "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/34/e2/7d/barbecued-pork-ribs.jpg?w=1200&h=-1&s=1" },
                { "nombre": "Bernie's Dinner", "telefono": "485 473 594", "email": "berniesdinner@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 8, "direccion": "Calle Manhattan 23, Valencia", "image": "https://offloadmedia.feverup.com/barcelonasecreta.com/wp-content/uploads/2015/07/09112834/usa-2.jpg" },
                { "nombre": "Taberna Flamenca", "telefono": "724 398 345", "email": "tabernaflamenca@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 4, "direccion": "Calle Sevilla 7, Sevilla", "image": "https://s1.ppllstatics.com/hoy/www/multimedia/202111/13/media/cortadas/165813563--1968x1310.jpg" },
                { "nombre": "Casa del Arroz", "telefono": "567 234 123", "email": "casadelarroz@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 4, "direccion": "Paseo de la Castellana 12, Madrid", "image": "https://ibiza-spotlight1.b-cdn.net/sites/default/files/styles/embedded_auto_740_width/public/article-images/138301/embedded-1808145593.jpg?itok=06R4cJZd" },
                { "nombre": "Sabores del Mar", "telefono": "765 345 098", "email": "saboresdelmar@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 4, "direccion": "Plaza del Mar 3, Barcelona", "image": "https://imagenes.elpais.com/resizer/v2/D7EEJHYCERGLVFSCY43QPDLO6E.jpg?auth=0dbf855b68440ee29905c103edef7d7cc1add094e50abbc376b2494772c44dd9&width=1200" },
                { "nombre": "Oasis del Sabor", "telefono": "987 345 234", "email": "oasisdelsabor@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 10, "direccion": "Calle del Desierto 14, Granada", "image": "https://www.sientemarruecos.viajes/wp-content/uploads/2019/10/El-Restaurante-Al-Mounia-es-un-restaurante-marroqu%C3%AD-en-Madrid.jpg" },
                { "nombre": "El Sultán", "telefono": "309 792 834", "email": "elsultan@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 10, "direccion": "Avenida Oasis 18, Córdoba", "image": "https://www.guiarepsol.com/content/dam/repsol-guia/contenidos-imagenes/comer/nuestros-favoritos/restaurante-el-califa-(vejer,-c%C3%A1diz)/00El_Califa_.jpg" },
                { "nombre": "Mezze Lounge", "telefono": "876 111 222", "email": "mezzelounge@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 40, "categorias_id": 10, "direccion": "Boulevard Dubai 25, Madrid", "image": "https://marruecoshoy.com/wp-content/uploads/2021/09/chebakia.png" },
                { "nombre": "Bangkok Delight", "telefono": "111 222 333", "email": "bankokdelight@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 20, "categorias_id": 9, "direccion": "Calle Siam 4, Barcelona", "image": "https://viajeatailandia.com/wp-content/uploads/2018/07/Restaurantes-Tailandia.jpg" },
                { "nombre": "Sabai Sabai", "telefono": "112 111 111", "email": "sabaisabai@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 9, "direccion": "Avenida Phuket 21, Madrid", "image": "https://www.topasiatour.com/pic/thailand/city/Bangkok/guide/jianxing-restaurant.jpg" },
                { "nombre": "Thai Spice", "telefono": "314 543 214", "email": "thaispicee@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 9, "direccion": "Boulevard Chiang Mai 8, Valencia", "image": "https://www.hola.com/imagenes/viajes/2015030677296/bares-restaurantes-rascacielos-bangkok-tailandia/0-311-16/a_Sirocco---interior-a.jpg" },
                { "nombre": "Haller", "telefono": "872 345 322", "email": "haller@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 11, "direccion": "Avenida Montmartre 9, Barcelona", "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/f8/0d/4d/arbol-de-yuca.jpg?w=2400&h=-1&s=1" },
                { "nombre": "Sublimotion", "telefono": "876 543 213", "email": "sublimotion@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 11, "direccion": "Paseo de la Castellana 13, Madrid", "image": "https://www.economistjurist.es/wp-content/uploads/sites/2/2023/08/293978.jpeg" },
                { "nombre": "Chez Marie", "telefono": "982 872 437", "email": "chezmarie@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 11, "direccion": "Calle Napoleón 19, Valencia", "image": "https://6e131064.rocketcdn.me/wp-content/uploads/2022/08/Girafe%C2%A9RomainRicard-5-1100x650-1.jpeg" },
                { "nombre": "Asador Don Julio", "telefono": "223 123 123", "email": "asadordonjulio@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 2, "direccion": "Calle de la Carne 9, Madrid","image": "https://media.timeout.com/images/106116523/1536/864/image.webp" },
                { "nombre": "Casa del Fernet", "telefono": "746 388 234", "email": "casadelfernet@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 2, "direccion": "Paseo Marítimo 11, Barcelona", "image": "https://rio-marketing.com/wp-content/uploads/2024/02/fernet1.webp" },
                { "nombre": "Empanadas Locas", "telefono": "223 123 123", "email": "empanadaslocas@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 23, "categorias_id": 2, "direccion": "Calle de Verdad 19, Valencia", "image": "https://cdn.inteligenciaviajera.com/wp-content/uploads/2019/11/comida-tipica-argentina.jpg" },
                { "nombre": "Green Delight", "telefono": "223 456 321", "email": "greenlight@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 13, "direccion": "Avenida de la Paz 45, Madrid", "image": "https://menusapiens.com/wp-content/uploads/2017/04/Comida-Sana-Alta-Cocina-MenuSapiens.jpeg" },
                { "nombre": "Vida Verde", "telefono": "542 234 223", "email": "vidaverde@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 13, "direccion": "Calle de la Luna 8, Barcelona", "image": "https://imagenes.elpais.com/resizer/v2/BSUD6VP76FGXJJE75BHINHYRAY.jpg?auth=2b94a0b2cdda6a164ea7b90ff96035281c2cd1ae8ead08a9d6d24df0d8ad9882&width=1200" },
                { "nombre": "Hortaliza Viva", "telefono": "456 332 223", "email": "hortalizaviva@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 13, "direccion": "Calle Mayor 21, Valencia", "image": "https://blog.covermanager.com/wp-content/uploads/2024/05/Como-Crear-un-Menu-Sostenible-para-Restaurantes-2048x1365.jpg" },
                { "nombre": "Sabor Latino", "telefono": "224 332 223", "email": "saborlatino@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 25, "categorias_id": 12, "direccion": "Calle de Alcalá 22, Madrid", "image": "https://www.clarin.com/img/2021/06/03/_32tg_291_1256x620__1.jpg" },
                { "nombre": "El Fogón de la Abuela", "telefono": "873 456 321", "email": "elfogondelaabuela@gmail.com","horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 12, "direccion": "Calle de la Reina 15, Barcelona", "image": "https://jotajotafoods.com/wp-content/uploads/2022/05/plato-Bandeja-Paisa.jpg" },
                { "nombre": "Casa Caribe", "telefono": "999 888 333", "email": "casacaribe@gmail.com", "horario_mañana_inicio": "12:00", "horario_mañana_fin": "15:30", "horario_tarde_inicio": "20:00", "horario_tarde_fin": "22:30", "cubiertos": 100, "reservas_por_dia": 30, "cantidad_mesas": 30, "categorias_id": 12, "direccion": "Paseo de la Castellana 33, Valencia", "image": "https://theobjective.com/wp-content/uploads/2024/04/2022-09-02.webp" }
]




def cargar_restaurantes_iniciales():
    try:
        if Restaurantes.query.count() == 0:  
            for restaurante in mock_restaurantes:
                nuevo_restaurante = Restaurantes(
                    nombre=restaurante['nombre'],
                    telefono=restaurante['telefono'],
                    email=restaurante['email'],
                    direccion=restaurante['direccion'],
                    cantidad_mesas=restaurante['cantidad_mesas'],
                    categorias_id=restaurante['categorias_id'],
                    horario_mañana_inicio=restaurante['horario_mañana_inicio'],
                    horario_mañana_fin=restaurante['horario_mañana_fin'],
                    horario_tarde_inicio=restaurante['horario_tarde_inicio'],
                    horario_tarde_fin=restaurante['horario_tarde_fin'],
                    reservas_por_dia=restaurante['reservas_por_dia'],
                    cubiertos=restaurante['cubiertos'],
                    image=restaurante['image']
                )

                nuevo_restaurante.set_password("defaultpassword")  

                db.session.add(nuevo_restaurante)
                db.session.flush()  

            
                db.session.commit()
                print("Restaurantes iniciales cargados.")
        else:
            print("Los restaurantes ya están cargados.")
    except ProgrammingError:
        print("No se pueden cargar los restaurantes porque las tablas no están listas.")
        db.session.rollback()



